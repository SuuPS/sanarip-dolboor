import $api from '@/http'
import moment from "moment";

async function getCategories() {
  return await $api.get('/Categorys')
}

async function getCategoriesWithPagination({ page, size }) {
  return await $api.get('/Categorys', {
    params: {
      page,
      size
    }
  })
}

async function getCategoriesById(id) {
  return await $api.get('/Categorys/' + id)
}

async function createCategories({ name, parentId }) {
  return await $api.post('/Categorys', {
    name,
    parentId
  })
}

async function editCategories({ id, name, parentId }) {
  return await $api.put('/Categorys/' + id, {
    id,
    name,
    parentId
  })
}

async function deleteCategories({ id }) {
  return await $api.delete('/Categorys/' + id)
}

export default {
  getCategories,
  getCategoriesWithPagination,
  getCategoriesById,
  createCategories,
  editCategories,
  deleteCategories
}
