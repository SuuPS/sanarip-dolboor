import $api from '@/http'

async function getTypeFirm(){
  return await $api.get('/typefirm/Collection');
}

async function getTypeFirmWithPagination({page, size}) {
  return await $api.get('/typefirm/all', {
    params: {
      filterByDeleted: true,
      page: page,
      size: size
    }
  })
}

async function createTypeFirm({name, id, code}) {
  return await $api.post('/typefirm/save', {
    name,
    id,
    code,
  })
}

async function editTypeFirm({name, id, code}) {
  return await $api.put(`/typefirm/update`,{
    name,
    id,
    code
  })
}

async function deleteTypeFirm({id}) {
  return await $api.delete(`/typefirm/${id}`)
}

export default {
  getTypeFirmWithPagination,
  getTypeFirm,
  createTypeFirm,
  editTypeFirm,
  deleteTypeFirm
}
