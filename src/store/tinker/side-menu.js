const state = () => {
  return {
    menu: [
      {
        icon: 'LayersIcon',
        pageName: 'side-menu-dashboard',
        title: 'Справочники',
        subMenu: [
          {
            pageName: 'Services',
            title: 'Сервисы',
            permission: ['SERVICE_READ'],
          },
          {
            pageName: 'Projects',
            title: 'Проекты',
            permission: ['PROJECT_READ'],
          },
          {
            pageName: 'TypeOrganization',
            title: 'Тип организации',
            permission: ['TYPEOZ_READ'],
          },
          {
            pageName: 'Organizations',
            title: 'Организации',
            permission: ['OZ_READ'],
          }
        ]
      },
      {
        icon: 'SettingsIcon',
        pageName: 'side-menu-dashboard',
        title: 'Администрирование',
        subMenu: [
          {
            pageName: 'UserRole',
            title: 'Роли',
            permission: ['SUPER_ADMIN']
          },
          {
            pageName: 'Users',
            title: 'Пользователи',
            permission: ['SUPER_ADMIN']
          }
        ]
      }
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
