import $api from '@/http'
import moment from "moment";

async function getSpecialists(orgId) {
  return await $api.get('/UserControllers/ListUsersForOrganisation/' + orgId)
}

async function getSpecialistByPin(pin) {
  return await $api.post('/UserControllers/GetByPIN/' + pin)
}

async function getRoles() {
  return await $api.get('/RoleControllers')
}

async function getSpecialistById(id) {
  return await $api.get('/UserControllers/GetForOrganisation/' + id)
}

async function createSpecialist({organizationId, firstName, surname, patronymic, phone, pin, etaj, cabinet, typeDoctor, doljnostId, password, identityRoleId}){
  return await $api.post('/UserControllers/CreateForOrganisation', {
    organizationId,
    firstName,
    surname,
    patronymic,
    phone,
    pin,
    etaj,
    cabinet,
    typeDoctor,
    doljnostId,
    password,
    identityRoleId
  })
}

async function editSpecialist({id, organizationId, firstName, surname, patronymic, phone, pin, etaj, cabinet, typeDoctor, doljnostId, password, identityRoleId}){
  return await $api.put('/UserControllers/EditForOrganisation/' + id, {
    organizationId,
    firstName,
    surname,
    patronymic,
    phone,
    pin,
    etaj,
    cabinet,
    typeDoctor,
    doljnostId,
    password,
    identityRoleId
  })
}

async function createWorkTime({ organisationAndApplicationUserId, startWorkTime, endWorkTime, dayOfWeek }){
  startWorkTime = moment('2022-01-01 ' + startWorkTime)
  endWorkTime = moment('2022-01-01 ' + endWorkTime)
  dayOfWeek = parseInt(dayOfWeek)

  return await $api.post('/WorkTimeUser/PostWorkTimeUser', {
    organisationAndApplicationUserId,
    startWorkTime,
    endWorkTime,
    dayOfWeek
  })
}

async function editWorkTime({ id, organisationAndApplicationUserId, startWorkTime, endWorkTime, dayOfWeek }){
  const params = new URLSearchParams()
  params.append('id', id)
  startWorkTime = moment('2022-01-01 ' + startWorkTime)
  endWorkTime = moment('2022-01-01 ' + endWorkTime)
  dayOfWeek = parseInt(dayOfWeek)

  return await $api.put('/WorkTimeUser/PutWorkTimeUser', {
    id,
    organisationAndApplicationUserId,
    startWorkTime,
    endWorkTime,
    dayOfWeek
  }, {
    params: params
  })
}

async function getUserSchedule(userId) {
  const params = new URLSearchParams()
  params.append('userId', userId)

  return await $api.get('/WorkTimeUser/GetWorkTimeUser', {
    params: params
  })
}

async function deleteWorkTime(id) {
  const params = new URLSearchParams()
  params.append('id', id)

  return await $api.delete('/WorkTimeUser/DeleteWorkTimeUser', {
    params: params
  })
}

export default {
  getSpecialists,
  getSpecialistByPin,
  getRoles,
  createSpecialist,
  editSpecialist,
  getSpecialistById,
  getUserSchedule,
  createWorkTime,
  editWorkTime,
  deleteWorkTime
}
