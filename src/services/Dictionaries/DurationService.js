import $api from '@/http'

async function getDurationList() {
  return await $api.get('/srokdeisvia/Collection', );
}

async function getDurationById(id) {
  return await $api.get(`/srokdeisvia/${id}`);
}

async function getDurationWithPagination({page, size}) {
  return await $api.get('/srokdeisvia/all', {
    params: {
      filterByDeleted: true,
      page: page,
      size: size
    }
  })
}

async function createDuration({name, id, code}) {
  return await $api.post('/srokdeisvia/save', {
    name,
    id,
    code,
  })
}

async function editDuration({name, id, code}) {
  return await $api.put(`/srokdeisvia/update`,{
    name,
    id,
    code
  })
}

async function deleteDuration({id}) {
  return await $api.delete(`/srokdeisvia/${id}`)
}

export default {
  getDurationById,
  getDurationWithPagination,
  getDurationList,
  createDuration,
  editDuration,
  deleteDuration
}
