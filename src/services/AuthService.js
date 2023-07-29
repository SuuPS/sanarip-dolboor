import $api from '@/http'

function singIn(payload) {
  return $api.post('/Account/Login', payload)
}

export default {
  singIn
}
