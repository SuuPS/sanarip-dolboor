<template>
  <div class="grid grid-cols-12 gap-4 mt-5">
    <div class="col-span-full">
      <h1 class="text-xl font-bold">Список пользователей</h1>
    </div>
    <!--table-->
    <div class="col-span-12 border rounded-xl p-3 bg-theme-4 shadow">
      <a
        @click="showCreateModal()"
        class="btn btn-primary">
        <PlusIcon class="w-4 h-4 mr-2"/>
        Добавить</a>
      <div class="overflow-auto lg:overflow-visible mt-8 sm:mt-0">
        <table class="table sm:mt-2 bg-white rounded-xl">
          <thead>
          <tr class="bg-gray-200 text-gray-700">
            <th>ПИН</th>
            <th>ФИО</th>
            <th>Телефон</th>
            <th>E-Mail</th>
            <th class="text-center whitespace-nowrap">Действия</th>
          </tr>
          </thead>
          <tbody>
          <tr
            v-for="item in genResult.result"
            :key="item"
            class="hover:bg-gray-200"
          >
            <td class="border-b dark:border-dark-5">
              {{ item.pin != null ? item.pin : '(отсутствует)' }}
            </td>
            <td class="border-b dark:border-dark-5">
              {{ item.fio != null ? item.fio : '(отсутствует)' }}
            </td>
            <td class="border-b dark:border-dark-5">
              {{ item.phone != null ? item.phone : '(отсутствует)' }}
            </td>
            <td class="border-b dark:border-dark-5">
              {{ item.email != null ? item.email : '(отсутствует)' }}
            </td>
            <td class="table-report__action border-b dark:border-dark-5">
              <div class="flex justify-center items-center">
                <a class="flex items-center mr-3"
                   href="javascript:;"
                   @click="showEditModal(item)">
                  <CheckSquareIcon class="w-4 h-4 mr-1"/>
                  Редактировать
                </a>
              </div>
            </td>
          </tr>
          <tr v-if="genResult.result.length==0">
            <td class="text-center" colspan="3">
              (нет записей)
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <!--      Paggination-->
      <div
        class="intro-y flex flex-wrap sm:flex-row sm:flex-nowrap items-center mt-3"
      >

        <ul class="pagination">
          <li v-if="5 < genResult.currentPage">
            <a class="pagination__link " @click="getByPagination(1)">
              <ChevronsLeftIcon class="w-4 h-4"/>
            </a>
          </li>
          <li v-if="genResult.currentPage > 1">
            <a class="pagination__link"
               @click="getByPagination(genResult.currentPage - 1)">
              <ChevronLeftIcon class="w-4 h-4"/>
            </a>
          </li>
          <template v-for="page in genResult.pagenumbersEnd" v-bind:key='page'>
            <li v-if="genResult.pagenumbersStart <= page || page >= genResult.pagenumbersEnd">
              <a class="pagination__link"
                 v-bind:class="{ 'pagination__link pagination__link--active' : page === genResult.currentPage}"
                 @click="getByPagination(page)">
                <p class="" v-bind:class="{ 'text-black' : page === genResult.currentPage}">
                  {{ page }}
                </p>
              </a>
            </li>
          </template>
          <li v-if="genResult.currentPage !== genResult.totalPages">
            <a class="pagination__link "
               @click="getByPagination(genResult.currentPage + 1)">
              <ChevronRightIcon class="w-4 h-4"/>
            </a>
          </li>
          <li v-if="genResult.currentPage < genResult.totalPages - 5">
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
    style="z-index: 999!important;"
  >
    <div class="modal-dialog">
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
            <div class="col-span-12">
              <label class="form-label">ПИН <span style="color: red">*</span></label>
              <input
                v-model="modalParams.datas.pin"
                required
                type="text"
                placeholder="Введите ПИН"
                class="form-control"
              />
            </div>
            <!-- Пароль-->
            <div class="col-span-12">
              <label class="form-label">Пароль <span style="color: red">*</span></label>
              <input
                v-model="modalParams.datas.password"
                required
                type="password"
                placeholder="Введите пароль"
                class="form-control"
              />
            </div>
            <!-- ФИО-->
            <div class="col-span-12">
              <label class="form-label">ФИО</label>
              <input
                v-model="modalParams.datas.fio"
                type="text"
                placeholder="Введите ФИО"
                class="form-control"
              />
            </div>
            <!-- E-Mail-->
            <div class="col-span-12">
              <label class="form-label">E-Mail</label>
              <input
                v-model="modalParams.datas.email"
                type="email"
                placeholder="Введите E-Mail"
                class="form-control"
              />
            </div>
            <!-- Телефон-->
            <div class="col-span-12">
              <label class="form-label">Телефон</label>
              <input
                v-model="modalParams.datas.phone"
                type="text"
                placeholder="Введите телефон"
                class="form-control"
              />
            </div>
            <!-- Роль-->
            <div class="col-span-12">
              <label class="form-label">Роль</label>
              <Select2 v-model="modalParams.datas.identityRoleId" :options="dictionaries.userRoles"
                       :settings="select2Settings"/>
            </div>
          </div>
          <!-- END: Modal Body -->
          <!-- BEGIN: Modal Footer -->
          <div class="modal-footer text-right">
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
            <button v-if="!loading" type="submit" class="btn btn-primary">
              Сохранить
            </button>
          </div>
        </form>
        <!-- END: Modal Footer -->
      </div>
    </div>
  </div>
  <!-- END: Modal Content -->
</template>

<script setup>
import Select2 from "vue3-select2-component";
import {onMounted, reactive, ref} from "vue";
import {createToast} from "mosha-vue-toastify";
import $api from "@/http";
import {select2Settings} from "@/helpers/select2Settings";
import {AdminService} from "@/services";

const loading = ref(false)
const genResult = reactive({
  currentPage: null,
  pageSize: null,
  totalPages: null,
  totalItems: null,
  result: [],
  pagenumbersStart: null,
  pagenumbersEnd: null
})
const dictionaries = reactive({
  userRoles: []
})
const modalParams = reactive({
  show: false,
  isEditModal: false,
  datas: {
    id: null,
    email: null,
    password: null,
    identityRoleId: null,
    fio: null,
    phone: null,
    pin: null
  }
})
const objectForDelete = ref({
  type: Object
})

onMounted(async () => {
  await getByPagination(1)
  getDictionaries()
})

async function getByPagination(page) {
  try {
    await (async () => {
      await $api.get('/UserControllers',
        {
          params: {
            page: page,
            size: 10
          }
        }
      ).then(response => {
        genResult.result = response.data.result
        genResult.currentPage = response.data.currentPage
        genResult.pageSize = response.data.pageSize
        genResult.totalPages = response.data.totalPages
        genResult.totalItems = response.data.totalItems
        genResult.pagenumbersStart = genResult.currentPage - 1 > 1 ? genResult.currentPage - 1 : 1
        genResult.pagenumbersEnd = genResult.currentPage + 5 < genResult.totalPages ? genResult.currentPage + 5 : genResult.totalPages
        return genResult
      })
    })()
  } catch (e) {
    console.log(e)
  }
}

function showCreateModal() {
  modalParams.show = true
  modalParams.isEditModal = false
}

function showEditModal(item) {
  console.log(item)
  modalParams.show = true
  modalParams.isEditModal = true
  modalParams.datas.id = item.id
  modalParams.datas.email = item.email
  modalParams.datas.password = item.password
  modalParams.datas.identityRoleId = item.identityRoleId
  modalParams.datas.fio = item.fio
  modalParams.datas.phone = item.phone
  modalParams.datas.pin = item.pin
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
    getByPagination(1)
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
    getByPagination(1)
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
  modalParams.datas.id = null
  modalParams.datas.email = null
  modalParams.datas.password = null
  modalParams.datas.identityRoleId = null
  modalParams.datas.fio = null
  modalParams.datas.phone = null
  modalParams.datas.pin = null
}

function getDictionaries() {
  AdminService.getRoles().then(response => {
    dictionaries.userRoles = []
    response.data.result.forEach(item => {
      dictionaries.userRoles.push({id: item.id, text: item.name})
    })
  })
}
</script>
