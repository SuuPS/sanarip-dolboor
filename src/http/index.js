import axios from 'axios'
import { getItem } from '@/helpers/persistanceStorage'

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL
})

api.interceptors.request.use(
  config => {
    const token = getItem('user')
    if (token) {
      const jwtToken = token ? `Bearer_${token.jwtToken}` : ''
      config.headers.Authorization = jwtToken
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

export default api
