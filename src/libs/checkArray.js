import store from "@/store";

export default function checkArray(permission) {
  let permissionTrue = false

  const userPermissions = store.state.auth.user.permissions.map(permission => permission.name)

  for(let i = 0; i < userPermissions.length; i++){
    if(userPermissions[i] == permission){
      permissionTrue = true
      break
    }
  }

  return permissionTrue
}
