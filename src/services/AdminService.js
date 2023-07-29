import $api from "@/http";
import store from "@/store";

async function getRoles() {
  return await $api.get('/RoleControllers')
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
async function getUsers(page, size) {
  return await $api.get('/UserControllers', {
    params: {
      page: page,
      size: size
    }
  })
}

function createUser({email, password, identityRoleId, fio, phone, pin}){
  return $api.post('/UserControllers', {
    email: email,
    password: password,
    identityRoleId: identityRoleId,
    fio: fio,
    phone: phone,
    pin: pin
  })
}
function editUser({id, email, password, identityRoleId, fio, phone, pin}){
  return $api.put('/UserControllers/' + id, {
    email: email,
    password: password,
    identityRoleId: identityRoleId,
    fio: fio,
    phone: phone,
    pin: pin
  })
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
  getRoles,
  getRolesWithPage,
  getPermissionCategories,
  getPermissionsByRoleId,
  editRolePermissions,
  hasAccess,
  createRole,
  getUsers,
  createUser,
  editUser
}
