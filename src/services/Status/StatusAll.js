import $api from '@/http'

async function getStatusSystems() {
  return await $api.get('/statusSystems/getAll', );
}

async function getStatusDocs() {
  return await $api.get('/statusDocs/getAll', );
}

export default {
  getStatusSystems,
  getStatusDocs
}
