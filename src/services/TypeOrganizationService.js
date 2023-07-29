import $api from '@/http'
import moment from "moment";

async function getList(page, size) {
  return await $api.get('/TypeOrganisations', {
    params: {
      page, size
    }
  })
}async function getListWithoutPage() {
  return await $api.get('/TypeOrganisations')
}
function create({name}) {
  return $api.post('/TypeOrganisations', {
    name
  })
}
function setRoles(data) {
  return $api.post('/TypeOrgAndRoleProjects', data)
}
function updateRoles(data) {
  return $api.put('/TypeOrgAndRoleProjects', data)
}
function getRoles(id) {
  return $api.get('/TypeOrgAndRoleProjects/typeOrgId/'+ id)
}
function edit(datas) {
  return $api.put('/TypeOrganisations/'+datas.id, datas)
}
async function remove(id) {
  return await $api.delete('/TypeOrganisations/'+id)
}

export default {
  getList,
  getListWithoutPage,
  create,
  edit,
  remove,
  setRoles,
  getRoles,
  updateRoles
}
