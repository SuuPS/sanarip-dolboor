import { createStore } from 'vuex'
import main from '@/store/tinker/main'
import sideMenu from '@/store/tinker/side-menu'
import simpleMenu from '@/store/tinker/simple-menu'
import topMenu from '@/store/tinker/top-menu'

import auth from '@/store/modules/auth'

const store = createStore({
  modules: {
    main,
    sideMenu,
    simpleMenu,
    topMenu,
    auth
  }
})

export function useStore() {
  return store
}

export default store
