import $api from '@/http'

async function getProposalList({page, size}) {
  return await $api.get('/products/getZayavki', {
    params: {
      filterByDeleted: true,
      page: page - 1,
      size: size,
    }
  })
}

export default {
  getProposalList,
}
