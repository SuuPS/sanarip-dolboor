
export default {
  state: {
    myValue: null
  },
  mutations: {
    SET_MY_VALUE(state, value) {
      state.myValue = value
    }
  },
  actions: {
    setMyValue({ commit }, value) {
      commit('SET_MY_VALUE', value)
    }
  },
  getters: {
    getMyValue(state) {
      return state.myValue
    }
  }
}
