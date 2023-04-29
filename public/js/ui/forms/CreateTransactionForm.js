/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element)
    this.accountSelect = this.element.querySelector('.accounts-select');

    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    console.log(this.modalId);
    // debugger;
    let currentUser = User.current();
    Account.list(currentUser, (response) => {
      if (response.success) {
        response.data.forEach(account => this.renderAccount(account));
      } else {
        alert(response.error);
      }
    })
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
    // let modalId = this.element.closest('.modal').dataset.modalId;
    Transaction.create(data, (response) => {
      if (response.success) {
        this.element.reset();
        App.getModal(this.modalId).close();
        App.update();
      }
    })
  }
}