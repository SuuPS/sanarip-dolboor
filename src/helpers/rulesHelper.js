import {helpers, maxLength, minLength, required} from "@vuelidate/validators";

export const rulesForLogin = {
  login: {
    required: helpers.withMessage('Введите логин!', required),
    minLength: helpers.withMessage('Логин должен состоять из 14 символов!', minLength(14)),
    maxLength: helpers.withMessage('Логин должен состоять из 14 символов!', maxLength(14))
  },
  password: {
    required: helpers.withMessage('Введите пароль!', required),
  }
}
