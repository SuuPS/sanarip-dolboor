
export default {

  state: {
    message: ''
  },

  mutations: {
    updateMessage(state, newMessage) {
      state.message = newMessage
      console.log(state.message + '== jus')
    }
  }
}
