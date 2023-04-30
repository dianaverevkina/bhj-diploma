/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    this.element = element ? element : this.showError();

    this.registerEvents();
    this.update();
  }

  showError() {
    let error = new Error( 'Такого элемента не существует' );
    throw error;
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    const createAccountBtn = this.element.querySelector( '.create-account' );

    createAccountBtn.addEventListener('click', () => {
      App.getModal( 'newAccount' ).open();
    });

    this.getAccounts().forEach(account => {
      account.addEventListener( 'click', () => this.onSelectAccount(account) );
    })
  }


  //Получает список счетов
  getAccounts() {
    return this.element.querySelectorAll( '.account' );
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    let currentUser = User.current();
    if ( !currentUser ) return;

    Account.list( currentUser.id, ( response ) => {
      if ( response.success ) {
        this.clear();
        response.data.forEach( account => this.renderItem(account) );
      } else {
        console.log( response.error );
      }
    })
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    this.getAccounts().forEach( account => account.remove() );
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount( element ) {
    debugger;
    this.getAccounts().forEach( account => account.classList.remove( 'active' ) );
    element.classList.add( 'active' );

    App.showPage( 'transactions', { account_id: element.dataset.id } )
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item){
    let account = document.createElement( 'li' );
    account.className = 'active account';
    account.dataset.id = item.id;
    account.innerHTML = `
      <a href="#">
        <span>${item.name}</span> 
        <span>${item.sum} ₽</span>
      </a>
    `;

    return account;
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data){
    let accountElement = this.getAccountHTML( data );
    this.element.append( accountElement );

    accountElement.addEventListener( 'click', () => this.onSelectAccount(accountElement) );
  }
}
