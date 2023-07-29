import $api from '@/http'

async function getDepartments(id) {
  return await $api.get(`/department/list/${id}`)
}

async function getDepartmentWithPagination({page, size, filterByOrganizationId}) {
  return await $api.get('/department/all', {
    params: {
      filterByDeleted: true,
      filterByOrganizationId: filterByOrganizationId,
      page: page,
      size: size
    }
  })
}

async function createDepartment({name, code, organization}) {
  return await $api.post('/department/save', {
    name,
    code,
    organization
  })
}



async function editDepartment({name, id, code, organization}) {
  return await $api.put(`/department/update`,{
    name,
    id,
    code,
    organization
  })
}

async function deleteDepartment({id}) {
  return await $api.delete(`/department/${id}`)
}


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
  getDepartments,
  getDepartmentWithPagination,
  createDepartment,
  editDepartment,
  deleteDepartment
}
