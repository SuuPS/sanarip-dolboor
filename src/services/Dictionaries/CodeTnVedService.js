import $api from '@/http'

async function getVedlist() {
  return await $api.get('/codetnved/Collection');
}

async function getCodeProductsWithPagination({page, size}) {
  return await $api.get('/codetnved/all', {
    params: {
      filterByDeleted: true,
      page: page,
      size: size
    }
  })
}

async function createVed({name, id, code}) {
  return await $api.post('/codetnved/save', {
    name,
    id,
    code,
  })
}

async function editVed({name, id, code}) {
  return await $api.put(`/codetnved/update`,{
    name,
    id,
    code
  })
}

async function deleteVed({id}) {
  return await $api.delete(`/codetnved/${id}`)
}

export default {
  getCodeProductsWithPagination,
  getVedlist,
  createVed,
  editVed,
  deleteVed
}
