import {createRouter, createWebHistory} from 'vue-router'
import store from '@/store'
import Vue from 'vue'
import checkArray from '@/libs/checkArray'
import isUndefined from "v-calendar";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/layouts/top-menu/Main')
  },
  {
    path: '/workspace',
    name: 'Workspace',
    component: () => import('@/layouts/side-menu/Main'),
    children: [
      {
        path: 'userRole',
        name: 'UserRole',
        permission: ['ADMIN'],
        component: () => import('@/views/Users/userRole/Main')
      },
      {
        path: 'CodeProduct',
        name: 'CodeProduct',
        permission: ['USER'],
        component: () => import('@/views/Dictionaries/codeProduct/Main')
      },
      {
        path: 'CodeTnVed',
        name: 'СodeTnVed',
        permission: ['USER'],
        component: () => import('@/views/Dictionaries/codeTnVed/Main')
      },//
      {
        path: 'duration',
        name: 'Duration',
        permission: ['USER'],
        component: () => import('@/views/Dictionaries/duration/Main')
      },
      {
        path: 'typeFirm',
        name: 'typeFirm',
        permission: ['USER'],
        component: () => import('@/views/Dictionaries/typeFirm/Main')
      },
      {
        path: 'positionWork',
        name: 'positionWork',
        permission: ['USER'],
        component: () => import('@/views/Dictionaries/positionWork/Main')
      },
      {
        path: 'countries',
        name: 'Сountries',
        permission: ['USER'],
        component: () => import('@/views/Goate/Main')
      },
      {
        path: 'VidTovara',
        name: 'VidTovara',
        permission: ['USER'],
        component: () => import('@/views/Dictionaries/vidTovara/Main')
      },
      {
        path: 'organization',
        name: 'organization',
        permission: ['USER'],
        component: () => import('@/views/Dictionaries/organization/Main')
      },
      {
        path: 'department',
        name: 'department',
        permission: ['USER'],
        component: () => import('@/views/Dictionaries/department/Main')
      },
      {
        path: 'users',
        name: 'Users',
        permission: ['ADMIN'],
        component: () => import('@/views/Users/users/Main.vue')
      },
      {
        path: 'nationalRegister',
        name: 'NationalRegister',
        permission: ['USER'],
        component: () => import('@/views/nationalRegister/listForm/Main.vue'),
      },
      {
        path: 'nationalRegisterObject/',
        name: 'nationalRegisterObject',
        permission: ['USER'],
        component: () => import('@/views/nationalRegister/objectForm/Main.vue'),
        props: route => ({ id: route.query.id })
      }
      ,
      {
        path: 'Proposal',
        name: 'Proposal',
        permission: ['USER'],
        component: () => import('@/views/Proposal/Main'),
        props: route => ({ id: route.query.id })
      }
    ]
  },
  {
    path: '/sign-in',
    name: 'SignIn',
    component: () => import('@/views/Auths/SignIn')
  },
  {
    path: '/sign-out',
    name: 'SignOut',
    component: {
      beforeRouteEnter(to, from, next) {
        const destination = {
          path: '/',
          query: from.query,
          params: from.params
        }
        store.dispatch('auth/signOut')
        next(destination)
      }
    }
  },
  {
    path: '/404',
    name: 'ErrorPage',
    component: () => import('@/views/error-page/Main')
  },
  {
    path: '/403',
    name: 'ErrorPage403',
    component: () => import('@/views/error-page/Main403')
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/error-page/Main')
  }

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || {left: 0, top: 0}
  }
})

router.beforeEach((to, from, next) => {
  const publicPages = ['/', '/workspace', '/sign-in', '/404', '/sign-out', '/403', '/sickLeaveCertificate', '/citizen', '/foreigner', '/enlisted-population', '/check-talon']

  const path = to.path
  let pathNew = to.path
  const authRequired = !publicPages.includes(path)
  // const authRequired = false
  const loggedIn = store.state.auth.user
  // const loggedIn = true
  pathNew = pathNew.substr(1)
  let perm = null

  let tmp = pathNew.split('/')
  tmp.pop()
  let ed = ''
  tmp.forEach(item => {
    ed += item + '/';
  })
  ed += ':id'

  if (ed === 'cetificate/validate/:id') {
    next()
  }

  routes[1].children.forEach(item => {
    if ("workspace/" + item.path === pathNew) {
      perm = item.permission
    } else {
      let tempPath = pathNew.split('/')
      tempPath.pop()
      let edited = ''
      tempPath.forEach(item => {
        edited += item + '/';
      })
      edited += ':id'

      if ("workspace/" + item.path === edited) {
        perm = item.permission
      }
    }
  })

  if (authRequired && !loggedIn) {
    next('/sign-in')
  } else if (publicPages.includes(path)) {
    if (path === '/workspace' && !loggedIn) {
      next('/sign-in')
    } else {
      next()
    }
  } else {
    if (loggedIn && store.state.auth.user.permissions != null) {
      if (path === '/') {
        next('/workspace')
      }

      if (checkArray(perm)) {
        next()
      } else {
        next({
          name: 'ErrorPage403'
        })
      }
    } else {
      next({
        name: 'ErrorPage403'
      })
    }
  }
})

localStorage.setItem('my-router', JSON.stringify(router))

export default router
