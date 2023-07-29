import $api from '@/http'

async function singIn(payload) {
  try {
    // debugger
    const response = await $api.post('/authenticate', payload)
    return { user: response.data, status: response.status }
  } catch (e) {
    return { error: e.response.data, status: e.response.status }
  }
}

export default {
  singIn
}
