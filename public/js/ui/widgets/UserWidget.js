/**
 * Класс UserWidget отвечает за
 * отображение информации о имени пользователя
 * после авторизации или его выхода из системы
 * */

class UserWidget {
  /**
   * Устанавливает полученный элемент
   * в свойство element.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element){
    this.element = element ? element : this.showError();
  }

  showError() {
    let error = new Error('Такого элемента не существует');
    throw error;
  }

  /**
   * Получает информацию о текущем пользователе
   * с помощью User.current()
   * Если пользователь авторизован,
   * в элемент .user-name устанавливает имя
   * авторизованного пользователя
   * */
  update(){
    const mainSidebar = document.querySelector('.main-sidebar');
    const userName = mainSidebar.querySelector('.user-name');

    let currentUser = User.current();
    userName.textContent = currentUser.name;
  }
}
