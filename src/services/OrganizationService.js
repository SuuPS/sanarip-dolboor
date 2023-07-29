import $api from '@/http'
import moment from "moment";

async function getList(page, size) {
  return await $api.get('/Organisations', {
    params: {
      page, size
    }
  })
}
async function getDirector(id) {
  return await $api.get('/Organisations/GetDirector', {
    params: {
      id
    }
  })
}

async function getUsersByOzId(id) {
    return await $api.get('/Organisations/GetUsers', {
    params: {
      id
    }
  })
}

async function activate(params){
  return await $api.post('/Organisations/Activate', {
    pin: params.pin,
    organisationId: params.organisationId,
    fio: params.fio,
    email: params.email,
    phone: params.phone,
    typeOrganisation: params.typeOrganisation
  })
}

export default {
  getList,
  getDirector,
  activate,
  getUsersByOzId
}
