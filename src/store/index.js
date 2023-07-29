import { createStore } from 'vuex'
import main from '@/store/tinker/main'
import sideMenu from '@/store/tinker/side-menu'
import simpleMenu from '@/store/tinker/simple-menu'
import topMenu from '@/store/tinker/top-menu'
import changeablePage from "@/store/tinker/changeable-page";

import auth from '@/store/modules/auth'

import products from "@/store/modules/products";

const store = createStore({
  modules: {
    main,
    sideMenu,
    simpleMenu,
    topMenu,
    auth,
    changeablePage,
    products
  }
})

export function useStore() {
  return store
}

export default store
