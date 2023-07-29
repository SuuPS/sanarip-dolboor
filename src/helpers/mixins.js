import { ref } from 'vue'
import store from '@/store'
import router from '@/router'
import { createToast } from 'mosha-vue-toastify'
import $ from 'jquery'

export default function mixins() {
  function checkJwtExp() {
    const loggedIn = store.state.auth.user
    const decodedJWTExpDate =
      loggedIn != null
        ? new Date(Jwt_decode(loggedIn.jwtToken).exp * 1000)
        : 0
    if (decodedJWTExpDate <= new Date()) {
      router.push('/logout')
      store.user = null

      createToast({
        title: 'Ошибка!',
        description: 'У вас закончилась сессия!',
      }, {
        type: 'danger',
        position: 'top-right',
        showIcon: true,
      })
    }
  }

  function checkResponseError(error) {
    checkJwtExp()
    if (error.toString() === 'Error: Network Error') {
      createToast({
        title: 'Внутренняя ошибка сервера!',
        description: 'Попробуйте позже',
      }, {
        type: 'danger',
        position: 'top-right',
        showIcon: true,
      })
      return true
    }
    const statusCode = error.response ? error.response.status : null
    if (statusCode != null && statusCode === 400) {
      createToast({
        title: 'Вы ввели не корректные данные!',
        description: 'Пожалуйста проверьте правильность данных!',
      }, {
        type: 'danger',
        position: 'top-right',
        showIcon: true,
      })
      return true
    }
    if (statusCode != null && statusCode === 401) {
      createToast({
        title: 'Вы не авторизованы!',
        description: 'Пожалуйста авторизуйтесь!',
      }, {
        type: 'danger',
        position: 'top-right',
        showIcon: true,
      })
      $('#close').click()
      router.push('/sign-out')
    }
    if (statusCode != null && statusCode === 403) {
      createToast({
        title: 'У вас нет прав!',
        description: 'Обратитесь администратору системы!',
      }, {
        type: 'danger',
        position: 'top-right',
        showIcon: true,
      })
      return true
    }
    if (statusCode != null && statusCode === 500) {
      createToast({
        title: 'Внутренняя ошибка сервера!',
        description: 'Попробуйте позже',
      }, {
        type: 'danger',
        position: 'top-right',
        showIcon: true,
      })
      return true
    }
    if (statusCode != null && statusCode === 406) {
      createToast({
        title: error.response.data,
        description: 'Попробуйте позже',
      }, {
        type: 'danger',
        position: 'top-right',
        showIcon: true,
      })
      return true
    }
  }

  function successResponse(response) {
    checkJwtExp()
    if (
      response.status === 200 ||
      response.status === 201 ||
      response.status === 204
    ) {
      let text = 'Запись успешно сохранена!!!'
      if (response.data.length > 0 && typeof response.data == 'string') {
        text = response.data
      }
      createToast({
        title: text,
      }, {
        type: 'success',
        position: 'top-right',
        showIcon: true,
      })
      return true
    }
  }

  function deleteResponse(response) {
    checkJwtExp()
    if (response.status === 200) {
      createToast({
        title: 'Запись успешно удалена!',
      }, {
        type: 'info',
        position: 'top-right',
        showIcon: true,
      })
      return true
    }
    if (response.status === 404) {
      createToast({
        title: 'Запись не найдена!',
      }, {
        type: 'warning',
        position: 'top-right',
        showIcon: true,
      })
      return false
    }
  }

  function invalidCredentials(error, status) {
    if (status != null && (status === 404 || status === 500 || status === 204)) {
      createToast({
        title: 'Неправильный логин или пароль!',
        description: 'Пожалуйста проверьте правильность данных!',
      }, {
        type: 'danger',
        position: 'top-right',
        showIcon: true,
      })
      return true
    }
  }

  function successAlert(title, description) {
    createToast({
      title,
      description,
    }, {
      type: 'success',
      position: 'top-right',
      showIcon: true,
    })
  }

  function failureAlert(title, description) {
    createToast({
      title,
      description,
    }, {
      type: 'warning',
      position: 'top-right',
      showIcon: true,
    })
  }

  return {
    checkJwtExp,
    checkResponseError,
    successResponse,
    deleteResponse,
    invalidCredentials,
    successAlert,
    failureAlert
  }
}
