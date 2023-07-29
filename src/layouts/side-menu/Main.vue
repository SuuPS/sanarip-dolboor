<template>
  <div>
    <MobileMenu :dashboard-layout="dashboardLayout" layout="side-menu" />
    <div class="flex overflow-hidden">
      <!-- BEGIN: Side Menu -->
      <nav class="side-nav">
        <router-link
          class="intro-x flex items-center pl-5 pt-4 mt-3"
          to="/workspace">
          <h1 class="text-white">IMed</h1>
<!--          <img-->
<!--            alt="Tinker Tailwind HTML Admin Template"-->
<!--            class="w-10"-->
<!--            src="@/assets/icons/logo_sm.svg"-->
<!--          />-->
<!--          <img-->
<!--            style="margin-left: 20px;"-->
<!--            alt="Tinker Tailwind HTML Admin Template"-->
<!--            class="h-10"-->
<!--            src="@/assets/icons/logo_lg.svg"-->
<!--          />-->
        </router-link>
        <div class="side-nav__devider my-6"></div>
        <ul>
          <!-- BEGIN: First Child -->
          <template v-for="(menu, menuKey) in formattedMenu">
            <li
              v-if="menu == 'devider'"
              :key="menu + menuKey"
              class="side-nav__devider my-6"
            ></li>
            <li v-else :key="menu + menuKey">
              <SideMenuTooltip
                v-if='checkMainMenu(menu)'
                tag="a"
                :content="menu.title"
                :href="
                  menu.subMenu
                    ? 'javascript:;'
                    : router.resolve({ name: menu.pageName }).path
                "
                class="side-menu"
                :class="{
                  'side-menu--active': menu.active,
                  'side-menu--open': menu.activeDropdown
                }"
                @click="linkTo(menu, router, $event)"
              >
                <div class="side-menu__icon">
                  <component :is="menu.icon" />
                </div>
                <div class="side-menu__title">
                  {{ menu.title }}
                  <div
                    v-if="menu.subMenu"
                    class="side-menu__sub-icon"
                    :class="{ 'transform rotate-180': menu.activeDropdown }"
                  >
                    <ChevronDownIcon />
                  </div>
                </div>
              </SideMenuTooltip>
              <!-- BEGIN: Second Child -->
              <transition @enter="enter" @leave="leave">
                <ul v-if="menu.subMenu && menu.activeDropdown">
                  <li
                    v-for="(subMenu, subMenuKey) in menu.subMenu"
                    :key="subMenuKey"
                  >
                    <SideMenuTooltip
                      v-if='checkMainMenu(subMenu)'
                      tag="a"
                      :content="subMenu.title"
                      :href="
                        subMenu.subMenu
                          ? 'javascript:;'
                          : router.resolve({ name: subMenu.pageName }).path
                      "
                      class="side-menu"
                      :class="{ 'side-menu--active': subMenu.active }"
                      @click="linkTo(subMenu, router, $event)"
                    >
                      <div class="side-menu__icon">
                        <component :is="subMenu.icon" />
                        <!-- <ActivityIcon /> -->
                      </div>
                      <div class="side-menu__title">
                        {{ subMenu.title }}
                        <div
                          v-if="subMenu.subMenu"
                          class="side-menu__sub-icon"
                          :class="{
                            'transform rotate-180': subMenu.activeDropdown
                          }"
                        >
                          <ChevronDownIcon />
                        </div>
                      </div>
                    </SideMenuTooltip>
                    <!-- BEGIN: Third Child -->
                    <transition @enter="enter" @leave="leave">
                      <ul v-if="subMenu.subMenu && subMenu.activeDropdown">
                        <li
                          v-for="(lastSubMenu,
                          lastSubMenuKey) in subMenu.subMenu"
                          :key="lastSubMenuKey"
                        >
                          <SideMenuTooltip
                            v-if='lastSubMenu.subMenu ? true : checkAccess(lastSubMenu.permission)'
                            tag="a"
                            :content="lastSubMenu.title"
                            :href="
                              lastSubMenu.subMenu
                                ? 'javascript:;'
                                : router.resolve({
                                    name: lastSubMenu.pageName
                                  }).path
                            "
                            class="side-menu"
                            :class="{
                              'side-menu--active': lastSubMenu.active
                            }"
                            @click="linkTo(lastSubMenu, router, $event)"
                          >
                            <div class="side-menu__icon">
                              <ZapIcon />
                            </div>
                            <div class="side-menu__title">
                              {{ lastSubMenu.title }}
                            </div>
                          </SideMenuTooltip>
                        </li>
                      </ul>
                    </transition>
                    <!-- END: Third Child -->
                  </li>
                </ul>
              </transition>
              <!-- END: Second Child -->
            </li>
          </template>
          <!-- END: First Child -->
        </ul>
      </nav>
      <!-- END: Side Menu -->
      <!-- BEGIN: Content -->
      <div :class="{ 'content--dashboard': dashboardLayout }" class="content">
        <TopBar />
        <router-view/>
      </div>
      <!-- END: Content -->
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, provide, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from '@/store'
import { helper as $h } from '@/utils/helper'
import TopBar from '@/components/top-bar/Main.vue'
import MobileMenu from '@/components/mobile-menu/Main.vue'
import DarkModeSwitcher from '@/components/dark-mode-switcher/Main.vue'
import SideMenuTooltip from '@/components/side-menu-tooltip/Main.vue'
import { linkTo, nestedMenu, enter, leave } from './index'
import store from "@/store";
import HomePage from '@/views/public/Main.vue'

export default defineComponent({
  components: {
    TopBar,
    MobileMenu,
    DarkModeSwitcher,
    SideMenuTooltip,
    HomePage
  },
  setup() {
    const dashboardLayout = ref(false)
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const formattedMenu = ref([])
    const sideMenu = computed(() =>
      nestedMenu(store.state.sideMenu.menu, route)
    )

    const currentPath = computed(()=>{
      if(route.path == '/workspace/' || route.path == '/workspace'){
        return true
      }
      else {
        return false
      }
    });

    provide('setDashboardLayout', newVal => {
      dashboardLayout.value = newVal
    })

    watch(
      computed(() => route.path),
      () => {
        formattedMenu.value = $h.toRaw(sideMenu.value)
        dashboardLayout.value = false
      }
    )

    onMounted(() => {
      cash('body')
        .removeClass('error-page')
        .removeClass('login')
        .addClass('main')
      formattedMenu.value = $h.toRaw(sideMenu.value)
    })

    return {
      dashboardLayout,
      formattedMenu,
      router,
      linkTo,
      enter,
      leave,
      currentPath
    }
  },
  methods:{
    checkMainMenu(menu) {
      const parsedMenu = JSON.parse(JSON.stringify(menu))
      let flag = true
      // if (!parsedMenu.subMenu){
      //   return this.checkAccess(parsedMenu.permission)
      // }else {
      //   for(let i = 0; i < parsedMenu.subMenu.length; i++){
      //     if(!parsedMenu.subMenu[i].subMenu){
      //       if(this.checkAccess(parsedMenu.subMenu[i].permission)){
      //         flag = true
      //       }
      //     }else{
      //       for(let x = 0; x < parsedMenu.subMenu[i].subMenu.length; x++){
      //         if(!parsedMenu.subMenu[i].subMenu[x].subMenu){
      //           if(this.checkAccess(parsedMenu.subMenu[i].subMenu[x].permission)){
      //             flag = true
      //           }
      //         }else{
      //           for(let z = 0; z < parsedMenu.subMenu[i].subMenu[x].subMenu.length; z++){
      //             if(this.checkAccess(parsedMenu.subMenu[i].subMenu[x].subMenu[z].permission)){
      //               flag = true
      //             }
      //           }
      //         }
      //       }
      //     }
      //   }
      // }
      return flag
    },
    checkAccess(permission) {
      const allowedRoutes = []
      const userPermissions = JSON.parse(
        JSON.stringify(store.state.auth.user.privileges)
      )
      return this.checkArray(userPermissions, permission)
    },
    checkArray(userPermissions, permission) {
      let flagShow = true
      // if (permission != null || permission != undefined) {
      //   userPermissions.forEach(item => {
      //     permission.forEach(item2 => {
      //       if (item === item2 || item === 'SUPER_ADMIN') {
      //         flagShow = true
      //       }
      //     })
      //   })
      // }
      return flagShow
    }
  }
})
</script>
