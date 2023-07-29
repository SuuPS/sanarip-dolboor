import $api from '@/http'

async function getVidTovara() {
  return await $api.get('/vidTovara/Collection', {});
}

async function getVidTovaraWithPagination({page, size}) {
  return await $api.get('/vidTovara/all', {
    params: {
      filterByDeleted: true,
      page: page,
      size: size
    }
  })
}

async function createVidTovara({name, id, code}) {
  return await $api.post('/vidTovara/save', {
    name,
    id,
    code,
  })
}



async function editVidTovara({name, id, code}) {
  return await $api.put(`/vidTovara/update`,{
    name,
    id,
    code
  })
}

async function deleteVidTovara({id}) {
  return await $api.delete(`/vidTovara/${id}`)
}

/** CodeProducts TYPES END **/

let genResult = {
  currentPage: null,
  pageSize: null,
  totalPages: null,
  totalItems: null,
  result: [],
  pagenumbersStart: null,
  pagenumbersEnd: null
}


export default {
  getVidTovara,
  getVidTovaraWithPagination,
  createVidTovara,
  editVidTovara,
  deleteVidTovara
}
