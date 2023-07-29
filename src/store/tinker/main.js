import * as types from './mutation-types'

const pageIdFromLS = JSON.parse(localStorage.getItem('pageId'))

const state = () => {
  return {
    darkMode: false,
    pageId: pageIdFromLS ? pageIdFromLS : null
  }
}

// getters
const getters = {
  darkMode: state => state.darkMode,
  pageId: state => state.pageId
}

// actions
const actions = {
  setDarkMode({ commit }, darkMode) {
    commit(types.SET_DARK_MODE, { darkMode })
  },

  setPageId({commit}, pageId) {
    commit(types.SET_PAGE_ID, { pageId })
    localStorage.setItem('pageId', pageId)
  },

  removePageId({commit}) {
    commit(types.REMOVE_PAGE_ID)
    localStorage.removeItem('pageId')
  }
}

// mutations
const mutations = {
  [types.SET_DARK_MODE](state, { darkMode }) {
    state.darkMode = darkMode
  },
  [types.SET_PAGE_ID](state, { pageId }) {
    state.pageId = pageId
  },
  [types.REMOVE_PAGE_ID](state) {
    state.pageId = null
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
