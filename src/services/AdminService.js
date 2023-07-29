import $api from "@/http";
import store from "@/store";

async function getRoles() {
  return await $api.get('/roles/Collection')
}

async function getRolesWithPage(page, size) {
  return await $api.get('/RoleControllers', {
    params: {
      page: page,
      size: size
    }
  })
}

async function getPermissionCategories() {
  return await $api.get('/ActionCategoryForUsers')
}
async function getPermissionsByRoleId(roleId) {
  return await $api.get('/RoleControllers/'+roleId)
}
function editRolePermissions(role, checkedPermissions){
  return $api.post('/RoleControllers/' + role,  checkedPermissions )
}
function createRole({name, nameRu}){
  return $api.post('/RoleControllers', {
    name: name,
    nameRu: nameRu
  })
}

//USER METHODS
async function getUsers() {
  return await $api.get('/users/Collection', )
}

async function getUsersWithPagination({page, size}) {
  return await $api.get('/users/all', {
    params: {
      filterByDeleted: true,
      page: page,
      size: size
    }
  })
}

async function getUsersByNisur(pin) {
  return await $api.get('/nisur/persons/nisurPin/'+pin)
}

async function createUser(datas){
  return $api.post('/users/save', {
    country: datas.country,
    department: datas.department,
    email: datas.email,
    id: datas.id,
    isActive: datas.isActive,
    isNesur: datas.isNesur,
    name: datas.name,
    organization: datas.organization,
    password: datas.password,
    patronymic: datas.patronymic,
    phone: datas.phone,
    pin: datas.pin,
    surname: datas.surname,
    roles: datas.roles,
  })
}

async function editUser(datas){
  return $api.put(`/users/user/${datas.id}`, {
    country: datas.country,
    department: datas.department,
    email: datas.email,
    id: datas.id,
    isActive: datas.isActive,
    isNesur: datas.isNesur,
    name: datas.name,
    organization: datas.organization,
    password: datas.password,
    patronymic: datas.patronymic,
    phone: datas.phone,
    pin: datas.pin,
    surname: datas.surname,
    roles: datas.roles
  })
}

async function deletUser({id}) {
  return await $api.delete(`/users/user/${id}`)
}

function hasAccess(permissions) {
  const userPermissions = store.state.auth.user != null ? store.state.auth.user.privileges : null
  let isAccess = false
  userPermissions.forEach(item => {
    permissions.forEach(item2 => {
      if (item === item2 || item === 'SUPER_ADMIN') {
        isAccess = true
      }
    })
  })
  return isAccess
}

export default {
  getUsersWithPagination,
  getRoles,
  getRolesWithPage,
  getPermissionCategories,
  getPermissionsByRoleId,
  editRolePermissions,
  hasAccess,
  createRole,
  getUsers,
  createUser,
  deletUser,
  editUser,
  getUsersByNisur
}
