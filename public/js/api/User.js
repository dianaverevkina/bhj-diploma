/**
 * Класс User управляет авторизацией, выходом и
 * регистрацией пользователя из приложения
 * Имеет свойство URL, равное '/user'.
 * */
class User {

  static URL = '/user';
  /**
   * Устанавливает текущего пользователя в
   * локальном хранилище.
   * */
  static setCurrent(user) {
    localStorage.setItem( 'user', JSON.stringify(user) );
  }

  /**
   * Удаляет информацию об авторизованном
   * пользователе из локального хранилища.
   * */
  static unsetCurrent() {
    localStorage.removeItem( 'user' );
  }

  /**
   * Возвращает текущего авторизованного пользователя
   * из локального хранилища
   * */
  static current() {
    let currentUser = localStorage.getItem( 'user' );

    if ( !currentUser ) {
      return undefined;
    }

    return JSON.parse( currentUser );
  }

  /**
   * Получает информацию о текущем
   * авторизованном пользователе.
   * */
  static fetch(callback) {
    createRequest({
      url: this.URL + '/current',
      method: 'GET',
      callback: ( response ) => {
        if ( !response.user ) {
          this.unsetCurrent();
        } else {
          this.setCurrent( response.user );
        }

        callback();
      },
    })
  }

  /**
   * Производит попытку авторизации.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static login( data, callback ) {
    createRequest({
      url: this.URL + '/login',
      method: 'POST',
      data,
      callback: ( response ) => {

        if ( response && response.user ) {
          this.setCurrent( response.user );
        }

        callback( response );
      }
    });
  }

  /**
   * Производит попытку регистрации пользователя.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static register(data, callback) {
    createRequest({
      url: this.URL + '/register',
      method: 'POST',
      data: data,
      callback: ( response ) => {
        if ( response.success ) {
          this.setCurrent( response.user );
        }

        callback( response );
      }
    });
  }

  /**
   * Производит выход из приложения. После успешного
   * выхода необходимо вызвать метод User.unsetCurrent
   * */
  static logout( callback ) {
    createRequest({
      url: this.URL + '/logout',
      method: 'POST',
      callback: ( response ) => {
        if ( response.success ) {
          this.unsetCurrent();
        }

        callback( response );
      }
    });
  }
}
