import {createRouter, createWebHistory} from 'vue-router'
import store from '@/store'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/layouts/top-menu/Main'),
    children: [
      // {
      //   path: '/',
      //   name: 'Main',
      //   permission: [''],
      //   component: () => import('@/views/public/Main.vue')
      // },
    ]
  },
  {
    path: '/workspace',
    name: 'Workspace',
    component: () => import('@/layouts/side-menu/Main'),
    children: [
      {
        path: 'userRole',
        name: 'UserRole',
        permission: ['SUPER_ADMIN'],
        component: () => import('@/views/Users/userRole/Main')
      },
      {
        path: 'users',
        name: 'Users',
        permission: ['SUPER_ADMIN'],
        component: () => import('@/views/Users/users/Main.vue')
      },
      {
        path: 'services',
        name: 'Services',
        permission: ['SERVICE_READ'],
        component: () => import('@/views/administration/Service/MainList.vue')
      },
      {
        path: 'projects',
        name: 'Projects',
        permission: ['PROJECT_READ'],
        component: () => import('@/views/administration/Project/Project.vue')
      },
      {
        path: 'typeOrganization',
        name: 'TypeOrganization',
        permission: ['TYPEOZ_READ'],
        component: () => import('@/views/administration/TypeOrganization/TypeOrganization.vue')
      },
      {
        path: 'typeOrganization-setRoles',
        name: 'TypeOrganizationSetRoles',
        permission: ['TYPEOZ_EDIT'],
        component: () => import('@/views/administration/TypeOrganization/SetRoles.vue')
      },
      {
        path: 'organizations',
        name: 'Organizations',
        permission: ['OZ_READ'],
        component: () => import('@/views/administration/Organization/Organization.vue')
      },
    ]
  },

  {
    path: '/sign-in',
    name: 'SignIn',
    component: () => import('@/views/Auth/SignIn')
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
  const publicPages = ['/workspace', '/sign-in', '/404', '/sign-out', '/403', '/']

  const path = to.path
  let pathNew = to.path
  const authRequired = !publicPages.includes(path)
  const loggedIn = store.state.auth.user
  pathNew = pathNew.substr(1)
  let perm = null

  let tmp = pathNew.split('/')
  tmp.pop()
  let ed = ''
  tmp.forEach(item => {
    ed += item + '/';
  })
  ed += ':id'


  routes[0].children.forEach(item => {
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
    if (loggedIn && store.state.auth.user.privileges != null) {
      if (path === '/') {
        next('/workspace')
      }
      const userPermissions = JSON.parse(
        JSON.stringify(store.state.auth.user.privileges)
      )
      if (checkArray(userPermissions, perm)) {
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
const checkArray = function (userPermissions, permission) {
  let isAccess = true
  // if (permission != null || permission != undefined) {
  //   userPermissions.forEach(item => {
  //     permission.forEach(item2 => {
  //       if (item === item2 || item === 'SUPER_ADMIN') {
  //         isAccess = true
  //       }
  //     })
  //   })
  // }
  return isAccess
}


export default router
