/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor( element ) {
    super( element );
    this.accountSelect = this.element.querySelector( '.accounts-select' );

    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    let currentUser = User.current();
    Account.list(currentUser, ( response ) => {
      if (response.success) {
        this.removeAccountsList();
        response.data.forEach( account => this.renderAccount(account) );
      } else {
        console.log( response.error );
      }
    })
  }

  removeAccountsList() {
    let options = this.accountSelect.querySelectorAll( 'option' );
    options.forEach( option => option.remove() );
  }

  renderAccount(element) {
    this.accountSelect.insertAdjacentHTML('beforeend', `
        <option value="${element.id}">${element.name}</option>
    `);
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, ( response ) => {
      if ( response.success ) {
        this.element.reset();
        App.getModal(this.modalId).close();
        App.update();
      }
    })
  }
}