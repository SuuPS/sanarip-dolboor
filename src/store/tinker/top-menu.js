const state = () => {
  return {
    menu: [
      // {
      //   pageName: 'Home',
      //   title: 'Главная',
      // },
      // {
      //   pageName: 'EnlistedPopulation',
      //   title: 'Онлайн приписка',
      // },
      // {
      //   pageName: 'OnlineRecording',
      //   title: 'Онлайн запись',
      // }
    ]
  }
}

// getters
const getters = {
  menu: state => state.menu
}

// actions
const actions = {}

// mutations
const mutations = {}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
