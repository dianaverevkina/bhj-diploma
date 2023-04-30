/**
 * Класс CreateAccountForm управляет формой
 * создания нового счёта
 * */
class CreateAccountForm extends AsyncForm {
  /**
   * Создаёт счёт с помощью Account.create и закрывает
   * окно в случае успеха, а также вызывает App.update()
   * и сбрасывает форму
   * */
  onSubmit( data ) {
    Account.create(data, ( response ) => {
      if ( response.success ) {
        App.getModal( this.modalId ).close();
        this.element.reset();
        App.update();
      } else {
        console.log(response.error);
      }
    })
  }
}