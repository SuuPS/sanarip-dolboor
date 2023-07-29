import $api from '@/http'
import moment from "moment";

async function getList(page, size) {
  return await $api.get('/ProjectMeds', {
    params: {
      page, size
    }
  })
}
async function getListWithoutPage() {
  return await $api.get('/ProjectMeds')
}

async function create({
                        name,
                        redirectURL,
                        baseUrl,
                        redirectURLEsia,
                        organisationUrl,
                        userRoleUrl,
                        userUrl,
                        description,
                        privateKey,
                        formBase64PNG
                      }) {
  let formData = new FormData()
  formData.append('name', name);
  formData.append('redirectURL', redirectURL);
  formData.append('baseUrl', baseUrl);
  formData.append('redirectURLEsia', redirectURLEsia);
  formData.append('organisationUrl', organisationUrl);
  formData.append('userRoleUrl', userRoleUrl);
  formData.append('userUrl', userUrl);
  formData.append('description', description);
  formData.append('privateKey', privateKey);
  formData.append('formBase64PNG', formBase64PNG);
  return await $api.post('/ProjectMeds', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

async function edit({
                      id, name, redirectURL, baseUrl,
                      redirectURLEsia,
                      organisationUrl,
                      userRoleUrl,
                      userUrl,
                      description,
                      privateKey,
                      formBase64PNG
                    }) {
  let formData = new FormData()
  formData.append('id', id);
  formData.append('name', name);
  formData.append('redirectURL', redirectURL);
  formData.append('baseUrl', baseUrl);
  formData.append('redirectURLEsia', redirectURLEsia);
  formData.append('organisationUrl', organisationUrl);
  formData.append('userRoleUrl', userRoleUrl);
  formData.append('userUrl', userUrl);
  formData.append('description', description);
  formData.append('privateKey', privateKey);
  formData.append('formBase64PNG', formBase64PNG);
  return await $api.put('/ProjectMeds/' + id, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

async function remove(id) {
  return await $api.delete('/ProjectMeds/' + id)
}

async function getRolesByProjectId(id) {
  return await $api.get('/ProjectRoles/byProjectId/'+id)
}
export default {
  getList,
  getListWithoutPage,
  create,
  edit,
  remove,
  getRolesByProjectId
}
