import $api from '@/http'
import moment from "moment";

async function getList(page, size) {
  return await $api.get('/OpenServices',{
    params: {
      page, size
    }
  })
}

async function create({name, url, description, formFileLOGO}) {
  let formData = new FormData()
  formData.append('name', name);
  formData.append('url',url );
  formData.append('description', description);
  formData.append('formFileLOGO', formFileLOGO);
  return await $api.post('/OpenServices', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

async function edit({id, name, url, description, formFileLOGO}) {
  let formData = new FormData()
  formData.append('id', id);
  formData.append('name', name);
  formData.append('url',url );
  formData.append('description', description);
  formData.append('formFileLOGO', formFileLOGO);
  return await $api.put('/OpenServices/' + id, formData,{
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

async function remove(id) {
  return await $api.delete('/OpenServices/' + id)
}

export default {
  getList,
  create,
  edit,
  remove
}
