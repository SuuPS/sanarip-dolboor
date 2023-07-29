import $api from '@/http'

/** SYSTEMS CodeProducts **/
async function getCodeProducts() {
  return await $api.get('/codeproducts/Collection', {});
}

async function getCodeProductsWithPagination({page, size}) {
  return await $api.get('/codeproducts/all', {
    params: {
      filterByDeleted: true,
      page: page,
      size: size
    }
  })
}

async function createCodeProducts({name, code}) {
  return await $api.post('/codeproducts/save', {
    name,
    code,
  })
}



async function editCodeProduct({name, id, code}) {
  return await $api.put(`/codeproducts/update`,{
    name,
    id,
    code
  })
}

async function deleteCodeProduct({id}) {
  return await $api.delete(`/codeproducts/${id}`)
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
  getCodeProducts,
  getCodeProductsWithPagination,
  createCodeProducts,
  editCodeProduct,
  deleteCodeProduct
}
