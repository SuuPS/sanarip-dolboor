<template>
  <div>
    <MobileMenu :dashboard-layout="dashboardLayout" layout="top-menu"/>
    <!-- BEGIN: Top Bar -->
    <div
      id="top-bar"
      :class="{
        'bg-white shadow-md': scrolled,
      }"
      :style="{ transition: 'background-color 1s' }"
      class="fixed w-full px-4 md:px-6 top-0 z-50">
      <div class="h-full flex items-center container">
        <nav class=" mr-auto p-0">
          <ul class="flex items-center">
            <!-- BEGIN: First Child -->
            <li>
              <router-link to="/">
                <img style="max-width: 200px"
                     :src="require('@/assets/images/logo_ru.png')"
                     class="py-1"/>
              </router-link>
            </li>
            <li v-for="(menu, menuKey) in formattedMenu" :key="menuKey">
              <a :href="menu.subMenu? 'javascript:;': router.resolve({ name: menu.pageName }).path"
                 class="top-menu"
                 :class="{'top-menu--active': menu.active}"
                 @click="linkTo(menu, router, $event)">
                <div class="top-menu__icon">
                  <component :is="menu.icon"/>
                </div>
                <div class="top-menu__title" style="margin-left: 0 !important; margin-right: 0 !important;">
                  {{ menu.title }}
                  <ChevronDownIcon v-if="menu.subMenu" class="top-menu__sub-icon"/>
                </div>
              </a>
              <!-- BEGIN: Second Child -->
              <ul v-if="menu.subMenu">
                <li v-for="(subMenu, subMenuKey) in menu.subMenu" :key="subMenuKey">
                  <a
                    :href="
                  subMenu.subMenu
                    ? 'javascript:;'
                    : router.resolve({ name: subMenu.pageName }).path
                "
                    class="top-menu"
                    @click="linkTo(subMenu, router, $event)"
                  >
                    <div class="top-menu__icon">
                      <ActivityIcon/>
                    </div>
                    <div class="top-menu__title">
                      {{ subMenu.title }}
                      <ChevronDownIcon
                        v-if="subMenu.subMenu"
                        class="top-menu__sub-icon"
                      />
                    </div>
                  </a>
                  <!-- BEGIN: Third Child -->
                  <ul v-if="subMenu.subMenu">
                    <li
                      v-for="(lastSubMenu, lastSubMenuKey) in subMenu.subMenu"
                      :key="lastSubMenuKey"
                    >
                      <a
                        :href="
                      lastSubMenu.subMenu
                        ? 'javascript:;'
                        : router.resolve({
                            name: lastSubMenu.pageName
                          }).path
                    "
                        class="top-menu"
                        @click="linkTo(lastSubMenu, router, $event)"
                      >
                        <div class="top-menu__icon">
                          <component :is="'zap-icon'"/>
                        </div>
                        <div class="top-menu__title">
                          {{ lastSubMenu.title }}
                        </div>
                      </a>
                    </li>
                  </ul>
                  <!-- END: Third Child -->
                </li>
              </ul>
              <!-- END: Second Child -->
            </li>
            <!-- END: First Child -->
          </ul>
        </nav>
        <!-- END: Top Menu -->
        <!-- BEGIN: Account Menu -->
        <div class="flex justify-between gap-3">
          <div class="btn border-0 flex items-center" style="border: none">
            <span class="fi mr-1" :class="flag.thisFlag.osm"></span>
            {{flag.thisFlag.name}}
            <div class="dropdown ml-auto">
              <a class="dropdown-toggle w-5 h-5 block" href="javascript:;"
                 aria-expanded="false">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                     class="feather feather-chevron-down w-4 h-4 ml-2 w-4 h-4 ml-2">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </a>
              <div class="dropdown-menu w-40">
                <div class="dropdown-menu__content box dark:bg-dark-1 p-2">
                  <button
                    @click="thisFlagChange(item)"
                    v-for="item in flag.flags" :key="item"
                    class="flex items-center block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md">
                    <span class="fi mr-1" :class="item.osm"></span>
                    {{item.name}}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!--          <div class="intro-x btn border-none bg-[#e4ecfd] text-[#0d4cd3] flex justify-center font-normal">-->
          <!--            <router-link class="" to="/workspace">-->
          <!--              помощь-->
          <!--            </router-link>-->
          <!--          </div>-->
          <div class="intro-x btn border-none bg-[#e4ecfd] text-[#0d4cd3] flex justify-center font-normal">
            <router-link class="" to="/workspace">
              {{ $t('message.PersonalAccount') }}
            </router-link>
          </div>
        </div>
        <!-- END: Account Menu -->
      </div>
    </div>
    <!-- END: Top Bar -->

    <!-- BEGIN: Content -->
    <div
      :class="{ 'content--dashboard': dashboardLayout }"
      class="pt-[70px]" style="background-color: white">
      <router-view/>
    </div>
    <!-- END: Content -->
  </div>
</template>

<script setup>
import {provide, watch, computed, onMounted, ref, reactive, onBeforeUnmount} from "vue";
import { useRoute, useRouter } from 'vue-router'
import { useStore } from '@/store'
import { helper as $h } from '@/utils/helper'
import TopBar from '@/components/top-bar/Main.vue'
import MobileMenu from '@/components/mobile-menu/MobileMenuForMain.vue'
import DarkModeSwitcher from '@/components/dark-mode-switcher/Main.vue'
import { nestedMenu, linkTo } from '@/layouts/side-menu'
import '/node_modules/flag-icons/css/flag-icons.min.css'
import { useI18n } from 'vue-i18n';

const { t, locale, setLocale } = useI18n();

const scrolled = ref(false)

// функция, которая будет вызвана при скроллинге
const handleScroll = () => {
  scrolled.value = window.pageYOffset > 0
}

// добавляем обработчик события "scroll" при монтировании компонента
window.addEventListener('scroll', handleScroll)

// удаляем обработчик события "scroll" при уничтожении компонента
// это необходимо для предотвращения утечек памяти
const cleanup = () => {
  window.removeEventListener('scroll', handleScroll)
}

const flag = reactive({
  thisFlag: {name: 'KG', osm: 'fi-kg'},
  flags: [
    {name: 'RU', osm: 'fi-ru'},
    {name: 'KG', osm: 'fi-kg'},
    {name: 'EN', osm: 'fi-us'}
  ]
})

const dashboardLayout = ref(false)
const route = useRoute()
const router = useRouter()
const store = useStore()
const formattedMenu = ref([])

const thisFlagChange = (item) => {
  flag.thisFlag.name = item.name
  flag.thisFlag.osm  = item.osm

  locale.value = item.name.toLowerCase();
}

provide('setDashboardLayout', (newVal) => {
  dashboardLayout.value = newVal
})

watch(
  computed(() => route.path),
  () => {
    formattedMenu.value = $h.toRaw(topMenu.value)
    dashboardLayout.value = false
  }
)

onMounted(() => {
  window.addEventListener('scroll', handleScroll)

  cash('body')
    .removeClass('error-page')
    .removeClass('login')
    .addClass('main')
  formattedMenu.value = $h.toRaw(topMenu.value)
})

onBeforeUnmount(() => {
  cleanup()
})

const topMenu = computed(() => nestedMenu(store.state.topMenu.menu, route))

</script>
