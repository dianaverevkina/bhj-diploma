/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
  let formData = new FormData();

  if (options.data) {
    for (const [key, value] of Object.entries(options.data)) {
      formData.append(key, value);
    }
  }

  fetch(options.url, {
    method: options.method,
    body: options.method === 'GET' ? null : formData,
  })
  .then(response => response.json())
  .then((result) => {
    console.log(result);
    options.callback(result);
  })
  .catch(e => {
    console.error("Произошла ошибка: ", e);
  })
};
