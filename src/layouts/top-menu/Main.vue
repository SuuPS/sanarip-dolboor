<template>
  <div>
    <MobileMenu :dashboard-layout="dashboardLayout" layout="top-menu"/>
    <!-- BEGIN: Top Bar -->
    <div
      class="top-bar-boxed px-4 md:px-6"
    >
      <div class="h-full flex items-center">
        <!-- BEGIN: Logo -->
        <!-- END: Logo -->
        <!-- BEGIN: Top Menu -->

        <nav class="top-nav mr-auto">
          <ul>
            <!-- BEGIN: First Child -->
            <li v-for="(menu, menuKey) in formattedMenu" :key="menuKey">
              <a
                :href="
              menu.subMenu
                ? 'javascript:;'
                : router.resolve({ name: menu.pageName }).path
            "
                class="top-menu"
                :class="{
              'top-menu--active': menu.active
            }"
                @click="linkTo(menu, router, $event)"
              >
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
        <div class="intro-x">
          <router-link class="text-white mr-3" to="/workspace">
            Личный кабинет
          </router-link>
        </div>
        <!-- END: Account Menu -->
      </div>
    </div>
    <!-- END: Top Bar -->

    <!-- BEGIN: Content -->
    <div
      :class="{ 'content--dashboard': dashboardLayout }"
      class="content content--top-nav"
    >
      <router-view/>
    </div>
    <!-- END: Content -->
  </div>
</template>

<script>
import {defineComponent, computed, provide, onMounted, ref, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useStore} from '@/store'
import {helper as $h} from '@/utils/helper'
import TopBar from '@/components/top-bar/Main.vue'
import MobileMenu from '@/components/mobile-menu/MobileMenuForMain.vue'
import DarkModeSwitcher from '@/components/dark-mode-switcher/Main.vue'
import {nestedMenu, linkTo} from '@/layouts/side-menu'

export default defineComponent({
  components: {
    TopBar,
    MobileMenu,
    DarkModeSwitcher
  },
  setup() {
    const dashboardLayout = ref(false)
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const formattedMenu = ref([])
    const topMenu = computed(() => nestedMenu(store.state.topMenu.menu, route))

    provide('setDashboardLayout', newVal => {
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
      cash('body')
        .removeClass('error-page')
        .removeClass('login')
        .addClass('main')
      formattedMenu.value = $h.toRaw(topMenu.value)
    })

    return {
      dashboardLayout,
      formattedMenu,
      router,
      linkTo
    }
  }
})
</script>
