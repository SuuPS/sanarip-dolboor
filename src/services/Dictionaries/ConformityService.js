import $api from '@/http'

async function getConformity() {
  return await $api.get('/sanitarnieTrebovaniya/Collection');
}

export default {
  getConformity,
}
