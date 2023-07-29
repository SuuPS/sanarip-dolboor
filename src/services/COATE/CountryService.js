import $api from '@/http'

async function getCountryList() {
  return await $api.get('/country/Collection');
}

async function getCountryWithPagination({page, size}) {
  return await $api.get('/country/all', {
    params: {
      filterByDeleted: true,
      page: page,
      size: size
    }
  })
}

async function createCountry({name, id, code, codeISO}) {
  return await $api.post('/country/save', {
    name,
    id,
    code,
    codeISO
  })
}

async function editCountry({name, id, code, codeISO}) {
  return await $api.put(`/country/update`,{
    name,
    id,
    code,
    codeISO
  })
}

async function deleteCountry({id}) {
  return await $api.delete(`/country/${id}`)
}


export default {
  getCountryWithPagination,
  getCountryList,
  createCountry,
  editCountry,
  deleteCountry
}
