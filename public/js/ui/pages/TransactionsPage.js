/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    this.element = element ? element : this.showError();
    this.content = this.element.querySelector( '.content' );

    this.registerEvents();
  }

  showError() {
    let error = new Error( 'Такого элемента не существует' );
    throw error;
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render( this.lastOptions );
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    const accountRemoveBtn = this.element.querySelector( '.remove-account' );
    accountRemoveBtn.addEventListener( 'click', () => this.removeAccount() );

    const transactionRemoveBtns = this.element.querySelectorAll( '.transaction__remove' );

    if ( transactionRemoveBtns.length === 0 ) return;

    transactionRemoveBtns.forEach(removeBtn => {
      removeBtn.addEventListener('click', () => {
        this.removeTransaction( removeBtn.dataset.id );
      })
    })
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if ( !this.lastOptions ) return;

    let questionDelete = confirm( 'Вы действительно хотите удалить счёт?' );

    if ( !questionDelete ) return; 

    Account.remove({ id: this.accountId }, ( response ) => {
      if ( response.success ) {
        App.getWidget( 'accounts' ).update();
        App.getForm( 'createIncome' ).renderAccountsList();
        App.getForm( 'createExpense' ).renderAccountsList();
      }
    })

    this.clear();
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction( id ) {
    let questionDelete = confirm( 'Вы действительно хотите удалить эту транзакцию?' );

    if ( !questionDelete ) return; 
    
    Transaction.remove({ id: id }, ( response ) => {
      if ( response.success ) {
        this.update();
        App.getWidget( 'accounts' ).update();
      }
    })
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options){

    if ( !options ) return; 

    this.lastOptions = options;
    this.accountId = this.lastOptions.account_id;

    Account.get(this.accountId, ( response ) => {
      if ( response.success ) {
        this.renderTitle( response.data.name );
      } else {
        console.log( response.error );
      }
    })

    Transaction.list(this.accountId, ( response ) => {
      if ( response.success ) {
        let transactionList = this.element.querySelectorAll( '.transaction' );

        if ( transactionList.length > 0 ) {
          this.removeTransactionList( transactionList );
        }

        this.renderTransactions( response.data );
      }
    })
  }

  //Удаляет весь список транзакций
  removeTransactionList( list ) {
    list.forEach( transaction => transaction.remove() );
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle('Название счёта');
    this.lastOptions = null;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    const title = this.element.querySelector( '.content-title' );
    title.textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
    let dateOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }

    date = new Date( date ).toLocaleString( 'ru-RU', dateOptions );
    return date;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){
    return `
      <div class="transaction transaction_${item.type} row">
        <div class="col-md-7 transaction__details">
          <div class="transaction__icon">
            <span class="fa fa-money fa-2x"></span>
          </div>
          <div class="transaction__info">
              <h4 class="transaction__title">${item.name}</h4>
              <div class="transaction__date">${this.formatDate(item.created_at)}</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="transaction__summ">
            ${item.sum} <span class="currency">₽</span>
          </div>
        </div>
        <div class="col-md-2 transaction__controls">
          <button class="btn btn-danger transaction__remove" data-id=${item.id}>
            <i class="fa fa-trash"></i>  
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
    if ( data.length === 0 ) {
      this.content.innerHTML = '';
      return;
    }

    data.forEach(transaction => {
      let transactionEl = this.getTransactionHTML( transaction );
      this.content.insertAdjacentHTML( 'beforeend', transactionEl );
    });
    
    this.registerEvents();
  }
}