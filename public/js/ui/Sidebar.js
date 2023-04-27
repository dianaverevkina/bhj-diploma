/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    const bodyElement = document.querySelector('body');
    const sidebarToggle = bodyElement.querySelector('.sidebar-toggle');

    function openSidebar() {
      if (bodyElement.classList.contains('sidebar-open')) {
        bodyElement.classList.remove('sidebar-open', 'sidebar-collapse');
        return;
      }

      bodyElement.classList.add('sidebar-open', 'sidebar-collapse');
    }

    sidebarToggle.addEventListener('click', openSidebar);
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регистрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    const sidebarMenu = document.querySelector('.sidebar-menu');
    const menuItems = sidebarMenu.querySelectorAll('.menu-item');

    function openAuthModal() {
      if (this.classList.contains('menu-item_login')) {
        App.getModal('login').open();
      }  
      
      if (this.classList.contains('menu-item_register')) {
        App.getModal('register').open();
      }
      
      if (this.classList.contains('menu-item_logout')) {
        User.logout(response => {
          if (response.success) {
            App.setState('init');
          }
        })
      }
    }
    
    menuItems.forEach(menuItem => {
      menuItem.addEventListener('click', openAuthModal);
    })
  }
}