import $api from '@/http'

async function getOrganizations() {
  return await $api.get('/organization/list', {});
}

async function getOrganizationWithPagination({page, size}) {
  return await $api.get('/organization/all', {
    params: {
      filterByDeleted: true,
      page: page,
      size: size
    }
  })
}

async function createOrganization({id, ozCode, ozFullName, ozShortName, country}) {
  return await $api.post('/organization/save', {
    id,
    ozCode,
    ozFullName,
    ozShortName,
    country,
    department: []
  })
}



async function editOrganization({id, ozCode, ozFullName, ozShortName, country, count}) {
  return await $api.put(`/organization/update`,{
    id,
    count,
    ozCode,
    ozFullName,
    ozShortName,
    country
  })
}

async function deleteOrganization({id}) {
  return await $api.delete(`/organization/${id}`)
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
  getOrganizations,
  getOrganizationWithPagination,
  createOrganization,
  editOrganization,
  deleteOrganization
}
