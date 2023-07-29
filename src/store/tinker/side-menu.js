const state = () => {
  return {
    menu: [
      {
        icon: 'LayersIcon',
        pageName: 'side-menu-dashboard',
        title: 'Справочники',
        subMenu: [
          {
            pageName: 'CodeProduct',
            title: 'Коды продукта',
            permission: ['USER'],
          },
          {
            pageName: 'СodeTnVed',
            title: 'Коды ТН ВЭД',
            permission: ['USER'],
          },
          {
            pageName: 'Duration',
            title: 'Сроки действия',
            permission: ['USER'],
          },
          {
            pageName: 'typeFirm',
            title: 'Типы фирм',
            permission: ['USER'],
          },
          {
            pageName: 'positionWork',
            title: 'Должности',
            permission: ['USER'],
          },
          {
            pageName: 'VidTovara',
            title: 'Виды товара',
            permission: ['USER'],
          },
          {
            pageName: 'organization',
            title: 'Организации',
            permission: ['USER'],
          },
          {
            pageName: 'department',
            title: 'Отделы',
            permission: ['USER'],
          }
        ]
      },
      {
        icon: 'GlobeIcon',
        pageName: 'side-menu-dashboard',
        title: 'COATE',
        subMenu: [
          {
            pageName: 'Сountries',
            title: 'Страны',
            permission: ['USER'],
          }
        ]
      },
      {
        icon: 'LayersIcon',
        pageName: 'NationalRegister',
        title: 'Национальный реестр',
        permission: ['USER'],
      },
      {
        icon: 'ArchiveIcon',
        pageName: 'Proposal',
        title: 'Заявки',
        permission: ['USER'],
      },
      {
        icon: 'SettingsIcon',
        pageName: 'side-menu-dashboard',
        title: 'Администрирование',
        subMenu: [
          {
            pageName: 'UserRole',
            title: 'Роли',
            permission: ['ADMIN']
          },
          {
            pageName: 'Users',
            title: 'Пользователи',
            permission: ['ADMIN']
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
