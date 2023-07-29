import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import globalComponents from '@/global-components'
import appComponents from '@/app-components/index'
import utils from '@/utils'
import '@/libs'

import 'mosha-vue-toastify/dist/style.css'

import $ from 'jquery'
import './assets/css/main.css'
// SASS Theme
import './assets/sass/app.scss'

const app = createApp(App)
  .use(store)
  .use(router)

appComponents.forEach(c => {
  app.component(c.name, c.component)
})

globalComponents(app)
utils(app)

app.mount('#app')
