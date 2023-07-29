
<script setup>
import {onMounted, reactive, ref, computed} from "vue";
import {createToast} from "mosha-vue-toastify";
import Select2 from "vue3-select2-component";
import {select2Settings, select2SettingsMulti} from "@/helpers/select2Settings";
import {AdminService, CodeProductService, CountryService, DepartmentService, OrganisationService} from "@/services";
import {helpers, required} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core/dist/index.esm";

const listOrganization = ref([])
const listDepartament = ref([])
const listCountry = ref([])

const loading = ref(false)

const roles = ref([])

function rolesWithId(){
  modalParams.datas.roles = roles.value.map(role => {
    return {  id: role  }
  })
}

const modalParams = reactive({
  show: false,
  isEditModal: false,
  datas: {
    country: {
      id: null
    },
    department: {
      id: null
    },
    email: null,
    id: null,
    isActive: true,
    isNesur: false,
    name: null,
    organization: {
      id: null
    },
    password: null,
    patronymic: null,
    phone: null,
    pin: null,
    surname: null,
  }
})

const idCode = ref(null)

const users = ref([])

const userRoles = ref([])

const genResult = reactive({
  number: null,
  size: null,
  totalPages: null,
  totalElements: null,
  content: [],
  pagenumbersStart: null,
  pagenumbersEnd: null
})

async function getByPagination(page) {
  try {
    await (async () => {
      AdminService.getUsersWithPagination({page: page, size: 15}).then(response => {
        genResult.content = response.data.content
        genResult.number = response.data.number
        genResult.size = response.data.size
        genResult.totalPages = response.data.totalPages
        genResult.totalElements = response.data.totalElements
        genResult.pagenumbersStart = genResult.number - 1 > 1 ? genResult.number - 1 : 1
        genResult.pagenumbersEnd = genResult.number + 5 < genResult.totalPages ? genResult.number + 5 : genResult.totalPages
        return genResult
      })
    })()
  } catch (e) {
    console.log(e)
  }
}

async function getDictionaries() {

  AdminService.getRoles().then(
    (response) => {
      userRoles.value = []

      if (response.status == 200) {
        response.data.forEach(item => {
          userRoles.value.push({id: item.id, text: item.name, name: item.name})
        })
      }
    },
    (error) => {
      console.log(error)
    }
  )

  CountryService.getCountryList().then(
    (response) => {
      if (response.status == 200) {
        response.data.forEach(item => {
          listCountry.value.push({id: item.id, text: item.name})
        })
      }
    },
    (error) => {
      console.log(error)
    }
  )

  OrganisationService.getOrganizations().then(
    (response) => {
      if (response.status == 200) {
        listOrganization.value = []

        response.data.forEach(item => {
          listOrganization.value.push({id: item.id, text: item.ozFullName})
        })
      }
    },
    (error) => {
      console.log(error)
    }
  )

}

function showCreateModal() {
  modalParams.show = true
  modalParams.isEditModal = false
}

function showModalDelete(item){
  idCode.value = item.id
}

function showEditModal(item) {
  modalParams.show = true
  modalParams.isEditModal = true

  console.log(item)
  modalParams.datas.country.id = item.country.id
  modalParams.datas.email = item.email
  modalParams.datas.id = item.id
  modalParams.datas.isNesur = item.isNesur
  modalParams.datas.isActive = item.isActive
  modalParams.datas.name = item.name
  modalParams.datas.department.id = item.department.id
  // modalParams.datas.password = item.password
  modalParams.datas.patronymic = item.patronymic
  modalParams.datas.phone = item.phone
  modalParams.datas.pin = item.pin
  modalParams.datas.surname = item.surname
  modalParams.datas.roleName = item.roleName
  modalParams.datas.organization.id = item.organization.id
  modalParams.datas.roles = item.roles.map(role => {
    return {  id: role.id  }
  })

  getDepartments()
}

function completeByNisur(datasByNisur){
      modalParams.datas.isNesur = true
      modalParams.datas.name = datasByNisur.name,
      modalParams.datas.patronymic = datasByNisur.patronymic,
      modalParams.datas.surname = datasByNisur.surname,
      modalParams.datas.pin = datasByNisur.pin
}

function clearByNisur(){
    modalParams.datas.isNesur = false
    modalParams.datas.name = null,
    modalParams.datas.patronymic = null,
    modalParams.datas.surname = null,
    modalParams.datas.pin = null
}

function searchByNisur(){
  if (modalParams.datas.isNesur == false){
    loading.value = true
    AdminService.getUsersByNisur(modalParams.datas.pin).then(
      (response) => {
        loading.value = false
        if (response.status == 200) {
          createToast({
            title: 'Пользователь найден!'
          }, {
            type: 'success',
            position: 'top-right',
            showIcon: true,
          })
          completeByNisur(response.data)
        }
      },
      (error) => {
        loading.value = false
        createToast({
          title: 'Произошла ошибка!',
        }, {
          type: 'danger',
          position: 'top-right',
          showIcon: true
        })
      }
    )
  }
  else {
    clearByNisur()
  }
}

function onChangeOraganizations(){
  getDepartments()
}

function getDepartments(){
  DepartmentService.getDepartments(modalParams.datas.organization.id).then(
    (response) => {
      listDepartament.value = []
      if(modalParams.isEditModal == false){
        modalParams.datas.departmentId = null
      }

      if (response.status == 200) {
        response.data.forEach(item => {
          listDepartament.value.push({id: item.id, text: item.name})
        })
      }
    },
    (error) => {
      console.log(error)
    }
  )
}

function confirmDelete() {
  AdminService.deletUser({id: idCode.value}).then(response => {
    createToast({
      title: 'Запись успешно удалена!'
    }, {
      type: 'success',
      position: 'top-right',
      showIcon: true,
    })
    getByPagination(genResult.number)
  }).catch(error => {
    createToast({
      title: 'Произошла ошибка!',
    }, {
      type: 'danger',
      position: 'top-right',
      showIcon: true
    })
  })
}

function edit() {
  loading.value = true
  AdminService.editUser(modalParams.datas).then(response => {
    loading.value = false
    createToast({
      title: 'Запись успешно изменена!'
    }, {
      type: 'success',
      position: 'top-right',
      showIcon: true,
    })
    resetData()
    getByPagination(genResult.number)
  }).catch(error => {
    loading.value = false
    createToast({
      title: 'Произошла ошибка!',
    }, {
      type: 'danger',
      position: 'top-right',
      showIcon: true
    })
  })
}

function create() {

  loading.value = true

  AdminService.createUser(modalParams.datas).then(response => {
    loading.value = false
    createToast({
      title: 'Запись успешно сохранена!'
    }, {
      type: 'success',
      position: 'top-right',
      showIcon: true,
    })
    getByPagination(genResult.number)
    resetData()
  }).catch(error => {
    loading.value = false
    createToast({
      title: 'Произошла ошибка!',
    }, {
      type: 'danger',
      position: 'top-right',
      showIcon: true
    })
  })
}

function resetData() {
  modalParams.show = false
  modalParams.datas.isNesur = false
  modalParams.datas.country.id = null
  modalParams.datas.department.id = null
  modalParams.datas.email = null
  modalParams.datas.id = null
  modalParams.datas.isActive = true
  modalParams.datas.name = null
  modalParams.datas.organization.id = null
  modalParams.datas.password = null
  modalParams.datas.patronymic = null
  modalParams.datas.phone = null
  modalParams.datas.pin = null
  modalParams.datas.surname = null
  modalParams.datas.roles = []
}

onMounted(async () => {
  await getDictionaries()
  await getByPagination(genResult.number)
})
</script>


<template>
  <div class="grid grid-cols-12 gap-4 mt-5">

    <div class="col-span-full">
      <h1 class="text-xl font-bold">Список пользователей</h1>
    </div>

    <div class="col-span-12 border rounded-xl p-3 bg-theme-4 shadow">
      <button
        type="button"
        @click="showCreateModal()"
        class="btn btn-primary">
        <PlusIcon class="w-4 h-4 mr-2"/>
        Добавить
      </button>

      <div class="overflow-auto mt-8 sm:mt-0">
        <table class="table sm:mt-2 bg-white rounded-xl">
          <thead>
          <tr class="bg-gray-200 text-gray-700">
            <th class="text-center whitespace-nowrap">Действия</th>
            <th>ПИН</th>
            <th>Фамилия</th>
            <th>Имя</th>
            <th>Отчество</th>
            <th>Организация</th>
            <th>Отдел</th>
            <th>Номер телефона</th>
            <th>Электронная почта</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in genResult.content" :key="item" class="hover:bg-gray-200">
            <td class="border-b dark:border-dark-5 text-center">
              <div class="dropdown" style="position: relative;">
                <button class="dropdown-toggle btn btn-primary" aria-expanded="false"> Действие
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                       class="feather feather-chevron-down w-4 h-4 ml-2 w-4 h-4 ml-2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                <div class="dropdown-menu" id="_weds19y4z"
                     style="position: absolute; inset: 0px 0px auto auto; margin: 0px; transform: translate3d(0px, 37.4px, 0px);"
                     data-popper-placement="bottom-end">
                  <div class="dropdown-menu__content box dark:bg-dark-1 p-2">
                    <a
                      href="javascript:;"
                      @click="showEditModal(item)"
                      class="flex items-center block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none"
                           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                           class="feather feather-edit-2 w-4 h-4 mr-2 w-4 h-4 mr-2">
                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                      </svg>
                      Редактировать </a>
                    <a
                      data-toggle="modal"
                      data-target="#delete-confirmation-modal"
                      @click="showModalDelete(item)"
                      class="flex items-center block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none"
                           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                           class="feather feather-trash w-4 h-4 mr-2 w-4 h-4 mr-2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                      Удалить
                    </a>
                  </div>
                </div>
              </div>
            </td>
            <td class="border-b dark:border-dark-5">
              {{ item.pin != '' && item.pin != null ? item.pin : '(отсутствует)' }}
            </td>
            <td class="border-b dark:border-dark-5">
              {{ item.surname != '' && item.surname != null ? item.surname.substr(0, 50) : '(отсутствует)' }}
            </td>
            <td class="border-b dark:border-dark-5">
              {{ item.name != '' && item.name != null ? item.name.substr(0, 50) : '(отсутствует)' }}
            </td>
            <td class="border-b dark:border-dark-5">
              {{ item.patronymic != '' && item.patronymic != null ? item.patronymic.substr(0, 50) : '(отсутствует)' }}
            </td>
            <td class="border-b dark:border-dark-5">
              {{ item.organization != '' && item.organization != null ? item.organization.ozFullName.substr(0, 50) : '(отсутствует)'  }}
            </td>
            <td class="border-b dark:border-dark-5">
              {{item.department != '' && item.department != null ? item.department.name : '(отсутствует)'}}
            </td>
            <td class="border-b dark:border-dark-5">
              {{ item.phone != '' && item.phone != null ? item.phone.substr(0, 50) : '(отсутствует)' }}
            </td>
            <td class="border-b dark:border-dark-5">
              {{ item.email != '' && item.email != null ? item.email.substr(0, 50) : '(отсутствует)' }}
            </td>
          </tr>
          <tr v-if="genResult.content.length==0">
            <td class="text-center" colspan="3">
              (нет записей)
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <div class="intro-y flex flex-wrap sm:flex-row sm:flex-nowrap items-center mt-3">

        <ul class="pagination">
          <li v-if="5 < genResult.number">
            <a class="pagination__link " @click="getByPagination(1)">
              <ChevronsLeftIcon class="w-4 h-4"/>
            </a>
          </li>
          <li v-if="genResult.number > 1">
            <a class="pagination__link"
               @click="getByPagination(genResult.number - 1)">
              <ChevronLeftIcon class="w-4 h-4"/>
            </a>
          </li>
          <template v-for="page in genResult.pagenumbersEnd" v-bind:key='page'>
            <li v-if="genResult.pagenumbersStart <= page || page >= genResult.pagenumbersEnd">
              <a class="pagination__link"
                 v-bind:class="{ 'pagination__link pagination__link--active' : page === genResult.number + 1}"
                 @click="getByPagination(page - 1)">
                <p class="" v-bind:class="{ 'text-black' : page === genResult.number + 1}">
                  {{ page }}
                </p>
              </a>
            </li>
          </template>
          <li v-if="genResult.number !== genResult.totalPages - 1">
            <a class="pagination__link "
               @click="getByPagination(genResult.number + 1)">
              <ChevronRightIcon class="w-4 h-4"/>
            </a>
          </li>
          <li v-if="genResult.number < genResult.totalPages - 5">
            <a class="pagination__link"
               @click="getByPagination(genResult.totalPages)">
              <ChevronsRightIcon class="w-4 h-4"/>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <!-- BEGIN: Modal Content -->
  <div
    v-if="modalParams.show"
    id="education-modal"
    class="modal overflow-y-auto show custom-modal"
    aria-hidden="true"
    data-backdrop='static'
    style="z-index: 999!important;">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <!-- BEGIN: Modal Header -->
        <div class="modal-header">
          <h2 class="font-medium text-base mr-auto">
            <span v-if="!modalParams.isEditModal">Добавление записи</span>
            <span v-if="modalParams.isEditModal">Редактирование записи</span>
          </h2>
        </div>
        <!-- END: Modal Header -->
        <!-- BEGIN: Modal Body -->
        <form v-on:submit.prevent="modalParams.isEditModal ? edit() : create()">
          <div class="modal-body grid grid-cols-12 gap-4 gap-y-3">

            <!-- ПИН-->
            <div class="col-span-12 grid grid-cols-12 gap-3">
              <div class="col-span-12">
                <label class="form-label">ПИН <span style="color: red">*</span></label>
                <div class="flex justify-between w-full">
                  <input
                    :disabled="modalParams.datas.isNesur"
                    maxlength="255"
                    v-model="modalParams.datas.pin"
                    required
                    type="text"
                    placeholder="Введите ПИН"
                    class="form-control"/>
                  <button
                    :disabled="modalParams.datas.isNesur && modalParams.datas.id != null"
                    v-if="!loading"
                    @click="searchByNisur()"
                    class="btn col-span-1 ml-2"
                    :class="modalParams.datas.isNesur ? 'btn-secondary' : 'btn-primary' "
                    type="button">{{ modalParams.datas.isNesur ? 'отменить' : 'найти' }}</button>
                </div>
              </div>
            </div>

            <div class="col-span-12">
              <div class="grid gap-3 grid-cols-4 lg:grid-cols-12">
                <div class="col-span-4">
                  <label class="form-label">Имя<span style="color: red">*</span></label>
                  <input
                    maxlength="255"
                    :disabled="modalParams.datas.isNesur"
                    v-model="modalParams.datas.name"
                    type="text"
                    required
                    placeholder="Введите имя"
                    class="form-control"/>
                </div>
                <div class="col-span-4">
                  <label class="form-label">Фамилия<span style="color: red">*</span></label>
                  <input
                    required
                    maxlength="255"
                    :disabled="modalParams.datas.isNesur"
                    v-model="modalParams.datas.surname"
                    type="text"
                    placeholder="Введите фамилию"
                    class="form-control"
                  />
                </div>
                <div class="col-span-4">
                  <label class="form-label">Отчество<span style="color: red">*</span></label>
                  <input
                    required
                    :disabled="modalParams.datas.isNesur"
                    maxlength="255"
                    v-model="modalParams.datas.patronymic"
                    type="text"
                    placeholder="Введите отчество"
                    class="form-control"
                  />
                </div>
              </div>
            </div>

            <div class="col-span-12 grid gap-3 grid-cols-6 lg:grid-cols-12">
              <div class="col-span-6">
                <label class="form-label">E-Mail</label>
                <input
                  maxlength="255"
                  v-model="modalParams.datas.email"
                  type="email"
                  placeholder="Введите E-Mail"
                  class="form-control"
                />
              </div>

              <div class="col-span-6">
                <label class="form-label">Телефон</label>
                <input
                  maxlength="255"
                  v-model="modalParams.datas.phone"
                  type="text"
                  placeholder="Введите телефон"
                  class="form-control"
                />
              </div>
            </div>
            <div class="col-span-12">
              <label class="form-label">Страна<span style="color: red">*</span></label>
              <Select2
                required
                :options="listCountry"
                :settings="select2Settings"
                v-model="modalParams.datas.country.id"/>
            </div>

            <div class="col-span-12">
              <label class="form-label">Организация<span style="color: red">*</span></label>
              <Select2
                required
                @select="onChangeOraganizations()"
                :options="listOrganization"
                :settings="select2Settings"
                v-model="modalParams.datas.organization.id"/>
            </div>

            <div class="col-span-12">
              <label class="form-label">Отдел<span style="color: red">*</span></label>
              <Select2
                :disabled="modalParams.datas.organization.id == null"
                required
                :options="listDepartament"
                :settings="select2Settings"
                v-model="modalParams.datas.department.id"/>
            </div>

            <div class="col-span-12">
              <label class="form-label">Роль<span style="color: red">*</span></label>
              <TomSelect
                :options="{
                placeholder: 'Выберите роль',
                plugins: {},
                }"
                v-model="roles"
                @change="rolesWithId"
                class="w-full"
                multiple>
                <option v-for="item in userRoles" :key="item.id" :value="item.id">{{ item.name }}</option>
              </TomSelect>
            </div>
            <!-- Пароль-->
            <div class="col-span-12">
              <label class="form-label">Пароль <span style="color: red">*</span></label>
              <input
                maxlength="255"
                v-model="modalParams.datas.password"
                required
                type="text"
                placeholder="Введите пароль"
                class="form-control"
              />
            </div>
          </div>
          <!-- END: Modal Body -->
          <!-- BEGIN: Modal Footer -->
          <div class="modal-footer text-right flex justify-end">
            <button
              v-show="!loading"
              type="button"
              @click="resetData"
              id="close"
              class="btn btn-outline-secondary mr-1"
            >
              Отмена
            </button>
            <div v-if="loading" class="col-span-12 flex flex-col justify-end items-center">
              <LoadingIcon class="w-20 h-20" icon="tail-spin"/>
            </div>
            <button
              v-if="!loading"
              type="submit"
              class="btn btn-primary">
              Сохранить
            </button>
          </div>
        </form>
        <!-- END: Modal Footer -->
      </div>
    </div>
  </div>

  <!-- BEGIN: Delete Confirmation Modal -->
  <div
    id="delete-confirmation-modal"
    class="modal"
    tabindex="-1"
    aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body p-0">
          <div class="p-5 text-center">
            <XCircleIcon class="w-16 h-16 text-theme-6 mx-auto mt-3"/>
            <div class="text-3xl mt-5">Вы уверены?</div>
            <div class="text-gray-600 mt-2">
              Вы уверены что хотите удалить эту запись? <br/>
            </div>
          </div>
          <div class="px-5 pb-8 text-center">
            <button
              type="button"
              data-dismiss="modal"
              class="btn btn-outline-secondary w-24 mr-1">
              Отмена
            </button>
            <button @click="confirmDelete()" data-dismiss="modal" type="button" class="btn btn-danger w-24">Удалить
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- END: Modal Content -->
</template>
