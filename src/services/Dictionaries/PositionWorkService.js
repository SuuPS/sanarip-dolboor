import $api from '@/http'

async function getPositionWork() {
  return await $api.get('/doljnost/Collection');
}

async function getPositionWorById(id) {
  return await $api.get(`/doljnost/${id}`)
}

async function getPositionWorkWithPagination({page, size}) {
  return await $api.get('/doljnost/all', {
    params: {
      filterByDeleted: true,
      page: page,
      size: size
    }
  })
}

async function createPositionWork({name, id, code}) {
  return await $api.post('/doljnost/save', {
    name,
    id,
    code,
  })
}

async function editPositionWork({name, id, code}) {
  return await $api.put(`/doljnost/update`,{
    name,
    id,
    code
  })
}

async function deletePositionWork({id}) {
  return await $api.delete(`/doljnost/${id}`)
}

export default {
  getPositionWorById,
  getPositionWorkWithPagination,
  getPositionWork,
  createPositionWork,
  editPositionWork,
  deletePositionWork
}
