import { AuthService } from '@/services'

// eslint-disable-next-line camelcase
import Jwt_decode from 'jwt-decode'
const userFromLS = JSON.parse(localStorage.getItem('user'))
const decodedJWTExpDate = userFromLS != null ? new Date(Jwt_decode(userFromLS.jwtToken).exp * 1000) : 0
const user = decodedJWTExpDate > new Date() ? userFromLS : null
const initialState = user
  ? { status: { loggedIn: true }, user }
  : { status: { loggedIn: false }, user: null }

export default {
  namespaced: true,
  state: initialState,
  actions: {
    async signIn({ commit }, payload) {
      const response = await AuthService.singIn(payload)
      if (response.status === 201) {
          localStorage.setItem('user', JSON.stringify(response.user))
          commit('loginSuccess', response.user)
      } else {
        commit('loginFailure');
      }

      return response
    },

    async signOut({ commit }) {
      localStorage.removeItem('user')
      commit('clearUser')
    }
  },
  mutations: {
    loginSuccess(state, user) {
      state.status.loggedIn = true;
      state.user = user;
    },
    loginFailure(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    clearUser(state) {
      state.status.loggedIn = false;
      state.user = null
    }
  }
}
