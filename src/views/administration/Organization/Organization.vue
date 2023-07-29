<template>
  <div class="grid grid-cols-12 gap-4 p-3">
    <div class="col-span-12">
      <span class="font-bold text-xl">Организации здравоохранения</span>
    </div>

  </div>
  <div class="box p-3 rounded-xl">
    <div class="grid grid-cols-12 gap-4 p-2">
      <div class="col-span-12 lg:col-span-3 md:col-span-4">
        <span class="font-medium">Кол-во ОЗ:</span> {{ paginationParams.totalItems }}
      </div>
    </div>
    <div class="preview">
      <div class="overflow-x-auto">
        <table class="table">
          <thead class="rounded-full sticky">
          <tr class="bg-gray-200 text-gray-700">
            <th class="border-b-2 text-center dark:border-dark-5">Название</th>
            <th class="border-b-2 text-center dark:border-dark-5">Код ЛПУ</th>
            <th class="border-b-2 text-center dark:border-dark-5">Руководитель</th>
            <th class="border-b-2 text-center dark:border-dark-5">Статус</th>
            <th class="border-b-2 text-center dark:border-dark-5">Действия</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in paginationParams.result" v-bind:key="item">
            <td class="border text-center">
              {{ item.name }}
            </td>
            <td class="border text-center">
              {{ item.codeLPU }}
            </td>
            <td class="border text-center">
              {{ item.directorFIO }}
            </td>
            <td class="border text-center">
              <span v-if="item.active" class="bg-primary-4 rounded-2xl p-2">Активный</span>
              <span v-else class="bg-primary-3 rounded-2xl p-2">Не активный</span>
            </td>
            <td class="border text-center">
              <div class="dropdown">
                <button class="dropdown-toggle btn btn-sm btn-secondary" aria-expanded="false">
                  Действия
                  <ChevronDownIcon class="w-4 h-4 ml-2"/>
                </button>
                <div class="dropdown-menu">
                  <div class="dropdown-menu__content box dark:bg-dark-1 p-2">
                    <button v-if="AdminService.hasAccess(['PROJECT_EDIT'])"
                            @click="showModalEdit(item)"
                            class="flex items-center block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md">
                      <Edit2Icon class="w-4 h-4 mr-2"/>
                      Активировать
                    </button>
<!--                    <a v-if="AdminService.hasAccess(['PROJECT_DELETE'])"-->
<!--                       class="flex items-center block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"-->
<!--                       href="javascript:;"-->
<!--                       data-toggle="modal"-->
<!--                       data-target="#delete-confirmation-modal"-->
<!--                       @click="showModalDelete(item)"-->
<!--                    >-->
<!--                      <Trash2Icon class="w-4 h-4 mr-1"/>-->
<!--                      Удалить-->
<!--                    </a>-->
                  </div>
                </div>
              </div>
            </td>
          </tr>
          <tr v-if="paginationParams.result.length===0 && !paginationParams.loading">
            <td colspan="10" class="text-center border">(нет записей)</td>
          </tr>
          <tr v-if="paginationParams.loading">
            <td colspan="10">
              <div class="col-span-12 flex flex-col justify-end items-center">
                <LoadingIcon class="w-20 h-20" icon="puff"/>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!--      Paggination-->
      <div
        class="flex flex-wrap sm:flex-row sm:flex-nowrap items-center mt-3 rounded-xl"
        style="background-color: antiquewhite;">

        <ul class="pagination">
          <li v-if="paginationParams.currentPage > 3">
            <a class="pagination__link " @click="getByPagination(1)">
              <ChevronsLeftIcon class="w-4 h-4"/>
            </a>
          </li>
          <li v-if="paginationParams.currentPage > 1">
            <a class="pagination__link"
               @click="getByPagination(paginationParams.currentPage - 1)">
              <ChevronLeftIcon class="w-4 h-4"/>
            </a>
          </li>
          <template v-for="page in paginationParams.pagenumbersEnd" v-bind:key='page'>
            <li v-if="paginationParams.pagenumbersStart <= page || page >= paginationParams.pagenumbersEnd">
              <a class="pagination__link"
                 v-bind:class="{ 'pagination__link pagination__link--active' : page === paginationParams.currentPage}"
                 @click="getByPagination(page, filterValues)">
                <p class="" v-bind:class="{ 'text-black' : page === paginationParams.currentPage}">
                  {{ page }}
                </p>
              </a>
            </li>
          </template>
          <li v-if="paginationParams.currentPage !== paginationParams.totalPages">
            <a class="pagination__link "
               @click="getByPagination(paginationParams.currentPage + 1)">
              <ChevronRightIcon class="w-4 h-4"/>
            </a>
          </li>
          <li v-if="paginationParams.currentPage < paginationParams.totalPages - 3">
            <a class="pagination__link"
               @click="getByPagination(paginationParams.totalPages, filterValues)">
              <ChevronsRightIcon class="w-4 h-4"/>
            </a>
          </li>
        </ul>

        <select v-model.number="paginationParams.pageSize" @change="getByPagination(1)"
                class="w-20 form-select mt-3 sm:mt-0">
          <option value="10">10</option>
          <option value="25">25</option>
          <option>35</option>
          <option>50</option>
        </select>
      </div>
    </div>
  </div>

  <!--  CREATE MODAL-->
  <div
    v-if="modalParams.show"
    id="user-modal"
    class="modal overflow-y-auto show custom-modal"
    aria-hidden="true"
    data-backdrop='static'
    style="z-index: 999!important;">
    <div class="modal-dialog" style="width: 60%!important;">
      <div class="modal-content">
        <!-- BEGIN: Modal Header -->
        <div class="modal-header">
          <h2 v-if="modalParams.isEdit" class="font-medium text-base mr-auto">
            Редактирование сервиса
          </h2>
          <h2 v-else class="font-medium text-base mr-auto">
            Добавление сервиса
          </h2>
        </div>
        <!-- END: Modal Header -->
        <!-- BEGIN: Modal Body -->
        <form v-on:submit.prevent="modalParams.isEdit ? update() :create()">
          <div class="modal-body grid grid-cols-12 gap-4 gap-y-3">
            <div class="col-span-12">
              <label>Руководитель</label>
              <input
                v-model="formV$.fio.$model"
                disabled
                type="text"
                class="form-control">
            </div>
            <div class="col-span-12">
              <label>Тип организации</label>
              <Select2 v-model="formV$.typeOrganisation.$model" :options="dictionaries.typeOrgs" :settings="select2SettingsMulti"/>
            </div>
          </div>
          <!-- END: Modal Body -->
          <!-- BEGIN: Modal Footer -->
          <div class="modal-footer text-right">
            <button
              type="button"
              @click="resetData"
              id="close"
              class="btn btn-outline-secondary mr-1">
              Отмена
            </button>
            <button class="btn btn-primary" type="submit" :disabled="modalParams.loading">
              <Spinner v-if="modalParams.loading" class="w-5 h-5 mr-2"/>
              Сохранить
            </button>
          </div>
        </form>
        <!-- END: Modal Footer -->
      </div>
    </div>
  </div>

  <!--Delete Confirmation Modal -->
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
            <button @click="confirmDelete" data-dismiss="modal" type="button" class="btn btn-danger w-24">Удалить
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, reactive, ref, watch} from "vue";
import {AdminService, OrganizationService, ProjectService, ServicesService, TypeOrganizationService} from "@/services";
import Spinner from "@/app-components/UIComponents/Spinner.vue";
import {createToast} from "mosha-vue-toastify";
import {useRouter} from "vue-router";
import {helpers, required, url} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import Select2 from "vue3-select2-component";
import {select2Settings, select2SettingsMulti} from "@/helpers/select2Settings";
import EasyDataTable, {Header, ServerOptions, Item} from "vue3-easy-data-table";
import 'vue3-easy-data-table/dist/style.css';

const paginationParams = reactive({
  currentPage: 1,
  totalPages: 0,
  totalItems: 0,
  pageSize: 10,
  pagenumbersStart: 1,
  pagenumbersEnd: 0,
  result: [],
  loading: false
})
const router = useRouter()
const modalParams = reactive({
  show: false,
  loading: false,
  isEdit: false,
  datas: {
    typeOrganisation: [],
    pin: null,
    fio: null,
    email: null,
    phone: null,
    organisationId: null,
    nisurId: null
  },
  rules: {
    typeOrganisation: {
      required: helpers.withMessage('Поле объязательно для заполнения!',required)
    },
    fio: {
      required: helpers.withMessage('Поле объязательно для заполнения!',required)
    }
  }
})

const formV$ = useVuelidate(modalParams.rules, modalParams.datas)

const itemForDelete = ref(null)

const dictionaries = reactive({
  typeOrgs: [],
  users: []
})

function getByPagination(pageNumber) {
  paginationParams.loading = true
  OrganizationService.getList(pageNumber, paginationParams.pageSize).then(response => {
    paginationParams.result = response.data.result
    paginationParams.currentPage = response.data.currentPage
    paginationParams.totalPages = response.data.totalPages
    paginationParams.totalItems = response.data.totalItems
    paginationParams.pagenumbersStart = paginationParams.currentPage - 1 > 1 ? paginationParams.currentPage - 1 : 1
    paginationParams.pagenumbersEnd = paginationParams.currentPage + 5 < paginationParams.totalPages ? paginationParams.currentPage + 5 : paginationParams.totalPages
    paginationParams.loading = false
  }).catch(error => {
    paginationParams.loading = false
  })
}

function showModalCreate() {
  modalParams.show = true
}

function showModalEdit(item) {
  modalParams.show = true
  modalParams.isEdit = true
  modalParams.datas.nisurId = item.nisurId
  modalParams.datas.organisationId = item.id
  getDirectorByOzId(item.nisurId)
}

function create() {
  modalParams.loading = true
  ProjectService.create(modalParams.datas).then(response => {
    createToast({
      title: 'Запись успешно сохранена!'
    }, {
      type: 'success',
      position: 'top-right',
      showIcon: true,
      timeout: 2000
    })
    modalParams.loading = false
    resetData()
    getByPagination(1)
  }).catch(error => {
    modalParams.loading = false
    createToast({
      title: 'Произошла ошибка!',
    }, {
      type: 'danger',
      position: 'top-right',
      showIcon: true,
      timeout: 2000
    })
  })
}

function update() {
  modalParams.loading = true
  OrganizationService.activate(modalParams.datas).then(response => {

    createToast({
      title: 'Запись успешно сохранена!'
    }, {
      type: 'success',
      position: 'top-right',
      showIcon: true,
      timeout: 2000
    })
    modalParams.loading = false
    resetData()
    getByPagination(1)
  }).catch(error => {
    modalParams.loading = false
    createToast({
      title: 'Произошла ошибка!',
    }, {
      type: 'danger',
      position: 'top-right',
      showIcon: true,
      timeout: 2000
    })
  })
}

function resetData() {
  modalParams.show = false
  modalParams.isEdit = false
  modalParams.datas.id = null
  modalParams.datas.name = null
  modalParams.datas.baseUrl = null
  modalParams.datas.redirectURL = null
  modalParams.datas.redirectURLEsia = null
  modalParams.datas.organisationUrl = null
  modalParams.datas.userRoleUrl = null
  modalParams.datas.userUrl = null
  modalParams.datas.description = null
  modalParams.datas.formBase64PNG = null
  modalParams.datas.base64PNG = null
}

function showModalDelete(item) {
  itemForDelete.value = item.id
}

function confirmDelete() {
  ProjectService.remove(itemForDelete.value).then(response => {
    createToast({
      title: 'Запись успешно удалена!'
    }, {
      type: 'warning',
      position: 'top-right',
      showIcon: true,
      timeout: 2000
    })
    getByPagination(1)
  }).catch(error => {
    createToast({
      title: 'Произошла ошибка!',
    }, {
      type: 'danger',
      position: 'top-right',
      showIcon: true,
      timeout: 2000
    })
  })
}

const hide = () => {
  cash('.dropdown-menu').dropdown('hide')
}

function getOrganizationTypes(){
  TypeOrganizationService.getListWithoutPage().then(response => {
    dictionaries.typeOrgs = []
    response.data.result.forEach(item => {
      dictionaries.typeOrgs.push({
        id: item.id,
        text: item.name
      })
    })
  })
}

function getDirectorByOzId(ozId){
  OrganizationService.getDirector(ozId).then(response => {
    completeDirectorDates(response.data)
  })
}

function completeDirectorDates(director){
  modalParams.datas.pin = director.pin
  modalParams.datas.fio = `${director.surname} ${director.name} ${director.patronymic}`
  modalParams.datas.email = director.email
  modalParams.datas.phone = director.mobilePhone
}

onMounted(() => {
  getByPagination(1)
  getOrganizationTypes()
})
</script>
