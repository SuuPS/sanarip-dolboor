<template>
  <div class="grid grid-cols-12 gap-4 p-3">
    <div class="col-span-12">
      <span class="font-bold text-xl">Проекты</span>
    </div>
    <!-- ФИЛЬТР-->
    <div class="col-span-12" v-if="AdminService.hasAccess(['PROJECT_CREATE'])">
      <a class="btn btn-primary" @click="showModalCreate()">Добавить</a>
    </div>
  </div>
  <div class="box p-3 rounded-xl">
    <div class="grid grid-cols-12 gap-4 p-2">
      <div class="col-span-12 lg:col-span-3 md:col-span-4">
        <span class="font-medium">Кол-во сервисов:</span> {{ paginationParams.totalItems }}
      </div>
    </div>
    <div class="preview">
      <div class="overflow-x-auto">
        <table class="table">
          <thead class="rounded-full sticky">
          <tr class="bg-gray-200 text-gray-700">
            <th class="border-b-2 text-center dark:border-dark-5" style="width: 10%">Лого</th>
            <th class="border-b-2 text-center dark:border-dark-5 width-60">Название</th>
            <th class="border-b-2 text-center dark:border-dark-5 width-60">URL</th>
            <th class="border-b-2 text-center dark:border-dark-5 width-60">Пути для обновления данных</th>
            <th class="border-b-2 text-center dark:border-dark-5 width-60">Действия</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in paginationParams.result" v-bind:key="item">
            <td class="border text-center">
              <img
                v-if="String(item.base64PNG).includes('.jpeg') || String(item.base64PNG).includes('.jpg') || String(item.base64PNG).includes('.png')"
                :src="'https://dev.med.kg/imed-back/uploads/'+item.base64PNG" alt="logo">
            </td>
            <td class="border text-center">
              {{ item.name }}
            </td>
            <td class="border text-center">
              <a :href="item.baseUrl" target="_blank" class="link">{{ item.baseUrl }}</a>
            </td>
            <td class="border text-center">
              <div><span class="font-bold">Перенеправление:</span> {{item.redirectURL}}</div>
              <div><span class="font-bold">Обновление ОЗ:</span> {{item.organizationUrl}}</div>
              <div><span class="font-bold">Роли системы:</span> {{item.userRoleUrl}}</div>
              <div><span class="font-bold">Обновление пользователей:</span> {{item.userUrl}}</div>
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
                      Редактировать
                    </button>
                    <a v-if="AdminService.hasAccess(['PROJECT_DELETE'])"
                       class="flex items-center block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"
                       href="javascript:;"
                       data-toggle="modal"
                       data-target="#delete-confirmation-modal"
                       @click="showModalDelete(item)"
                    >
                      <Trash2Icon class="w-4 h-4 mr-1"/>
                      Удалить
                    </a>
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
        style="background-color: antiquewhite;"
      >

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
    style="z-index: 999!important;"
  >
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
              <img class="w-1/3 rounded-xl shadow" v-if="modalParams.datas.preview != null"
                   :src="modalParams.datas.preview" alt="">
              <img class="w-1/4 rounded-xl shadow" v-else-if="modalParams.datas.base64PNG != null"
                   :src="'https://dev.med.kg/imed-back/uploads/'+modalParams.datas.base64PNG" alt="">
              <img class="w-1/4 rounded-xl shadow" v-else src="@/assets/images/image-logo.png" alt="">
              <input @change="handleFileUpload($event)" type="file" class="dz-file-preview">
            </div>
            <div class="col-span-12">
              <label class="form-label">Наименование <span style="color: red">*</span></label>
              <input
                required
                v-model.trim="formV$.name.$model"
                type="text"
                placeholder="Введите наименование ..."
                :class="{ 'border-theme-21' : formV$.name.$error }"
                class="form-control"
              />
              <p
                v-for="(error, index) in formV$.name.$errors"
                :key="index"
                class="pt-2 pl-2 text-theme-21"
              >
                {{ error.$message }}
              </p>
            </div>
            <div class="col-span-12">
              <label class="form-label">URL <span style="color: red">*</span></label>
              <input
                required
                v-model.trim="formV$.baseUrl.$model"
                type="url"
                placeholder="Введите url ..."
                class="form-control"
                :class="{ 'border-theme-21' : formV$.baseUrl.$error }"
              />
              <p
                v-for="(error, index) in formV$.baseUrl.$errors"
                :key="index"
                class="pt-2 pl-2 text-theme-21"
              >
                {{ error.$message }}
              </p>
            </div>
            <div class="col-span-6">
              <label class="form-label">Путь для перенапавления (redirect)<span style="color: red">*</span></label>
              <div class="input-group">
                <div id="input-group-redirectUrl" class="input-group-text">{{ modalParams.datas.baseUrl }}</div>
                <input
                  required
                  v-model.trim="formV$.redirectURL.$model"
                  type="text"
                  placeholder="Введите url ..."
                  class="form-control"
                  :class="{ 'border-theme-21' : formV$.redirectURL.$error }"
                  aria-describedby="input-group-redirectUrl"
                />
              </div>
              <div class="form-help">
                Введите только путь без хоста. Например: /sign-in
              </div>
              <p
                v-for="(error, index) in formV$.redirectURL.$errors"
                :key="index"
                class="pt-2 pl-2 text-theme-21"
              >
                {{ error.$message }}
              </p>
            </div>
            <div class="col-span-6">
              <label class="form-label">Путь для перенапавления для ESIA (redirectEsia)<span style="color: red">*</span></label>
              <div class="input-group">
                <div id="input-group-redirectUrlEsia" class="input-group-text">{{ modalParams.datas.baseUrl }}</div>
                <input
                  required
                  v-model.trim="formV$.redirectURLEsia.$model"
                  type="text"
                  placeholder="Введите url ..."
                  class="form-control"
                  :class="{ 'border-theme-21' : formV$.redirectURLEsia.$error }"
                  aria-describedby="input-group-redirectUrlEsia"
                />
              </div>
              <div class="form-help">
                Введите только путь без хоста. Например: /sign-oidc
              </div>
              <p
                v-for="(error, index) in formV$.redirectURLEsia.$errors"
                :key="index"
                class="pt-2 pl-2 text-theme-21"
              >
                {{ error.$message }}
              </p>
            </div>
            <div class="col-span-6">
              <label class="form-label">Путь для обновления ОЗ<span style="color: red">*</span></label>
              <div class="input-group">
                <div id="input-group-organisationUrl" class="input-group-text">{{ modalParams.datas.baseUrl }}</div>
                <input
                  required
                  v-model.trim="formV$.organisationUrl.$model"
                  type="text"
                  placeholder="Введите url ..."
                  class="form-control"
                  :class="{ 'border-theme-21' : formV$.organisationUrl.$error }"
                  aria-describedby="input-group-organisationUrl"
                />
              </div>
              <div class="form-help">
                Введите только путь без хоста. Например: /organizations
              </div>
              <p
                v-for="(error, index) in formV$.organisationUrl.$errors"
                :key="index"
                class="pt-2 pl-2 text-theme-21"
              >
                {{ error.$message }}
              </p>
            </div>
            <div class="col-span-6">
              <label class="form-label">Путь для получение ролей<span style="color: red">*</span></label>
              <div class="input-group">
                <div id="input-group-userRoleUrl" class="input-group-text">{{ modalParams.datas.baseUrl }}</div>
                <input
                  required
                  v-model.trim="formV$.userRoleUrl.$model"
                  type="text"
                  placeholder="Введите url ..."
                  class="form-control"
                  :class="{ 'border-theme-21' : formV$.userRoleUrl.$error }"
                  aria-describedby="input-group-userRoleUrl"
                />
              </div>
              <div class="form-help">
                Введите только путь без хоста. Например: /userRoles
              </div>
              <p
                v-for="(error, index) in formV$.userRoleUrl.$errors"
                :key="index"
                class="pt-2 pl-2 text-theme-21"
              >
                {{ error.$message }}
              </p>
            </div>
            <div class="col-span-6">
              <label class="form-label">Путь для обновления пользователей<span style="color: red">*</span></label>
              <div class="input-group">
                <div id="input-group-userUrl" class="input-group-text">{{ modalParams.datas.baseUrl }}</div>
                <input
                  required
                  v-model.trim="formV$.userUrl.$model"
                  type="text"
                  placeholder="Введите url ..."
                  class="form-control"
                  :class="{ 'border-theme-21' : formV$.userUrl.$error }"
                  aria-describedby="input-group-userUrl"
                />
              </div>
              <div class="form-help">
                Введите только путь без хоста. Например: /users
              </div>
              <p
                v-for="(error, index) in formV$.userUrl.$errors"
                :key="index"
                class="pt-2 pl-2 text-theme-21"
              >
                {{ error.$message }}
              </p>
            </div>
            <div class="col-span-12">
              <label class="form-label">Описание <span style="color: red">*</span></label>
              <textarea
                v-model.trim="formV$.description.$model"
                placeholder="Введите описание ..."
                :class="{ 'border-theme-21' : formV$.description.$error }"
                class="form-control"
              />
              <p
                v-for="(error, index) in formV$.description.$errors"
                :key="index"
                class="pt-2 pl-2 text-theme-21"
              >
                {{ error.$message }}
              </p>
            </div>
          </div>
          <!-- END: Modal Body -->
          <!-- BEGIN: Modal Footer -->
          <div class="modal-footer text-right">
            <button
              type="button"
              @click="resetData"
              id="close"
              class="btn btn-outline-secondary mr-1"
            >
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
    aria-hidden="true"
  >
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
              class="btn btn-outline-secondary w-24 mr-1"
            >
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
import {onMounted, reactive, ref} from "vue";
import {AdminService, ProjectService, ServicesService} from "@/services";
import Spinner from "@/app-components/UIComponents/Spinner.vue";
import {createToast} from "mosha-vue-toastify";
import {useRouter} from "vue-router";
import {helpers, required, url} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

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
    id: null,
    name: '',
    baseUrl: null,
    redirectURL: null,
    redirectURLEsia: null,
    base64PNG: null,
    formBase64PNG: null,
    organisationUrl: null,
    userRoleUrl: null,
    userUrl: null,
    description: null,
    privateKey: null,
    preview: null
  },
  rules: {
    name: {
      required: helpers.withMessage('Объзательно для заполнения!', required)
    },
    baseUrl: {
      required: helpers.withMessage('Объзательно для заполнения!', required),
      url: helpers.withMessage('Введите в формате https://example.kg!', url)
    },
    redirectURL: {
      required: helpers.withMessage('Объзательно для заполнения!', required)
    },
    redirectURLEsia: {
      required: helpers.withMessage('Объзательно для заполнения!', required)
    },
    formBase64PNG: {
      required: helpers.withMessage('Объзательно для заполнения!', required)
    },
    organisationUrl: {
      required: helpers.withMessage('Объзательно для заполнения!', required)
    },
    userRoleUrl: {
      required: helpers.withMessage('Объзательно для заполнения!', required)
    },
    userUrl: {
      required: helpers.withMessage('Объзательно для заполнения!', required)
    },
    description: {
      required: false
    }
  }
})

const formV$ = useVuelidate(modalParams.rules, modalParams.datas)

const filter = reactive({
  nameProject: '',
  dateStartGraphik: '',
  dateEndGraphik: '',
  dateStartPogash: '',
  dateEndPogash: '',
  statusProjectPlan: '',
  finansEnum: ''
})

function resetFilter() {
  filter.nameProject = ''
  filter.dateStartGraphik = ''
  filter.dateEndGraphik = ''
  filter.dateStartPogash = ''
  filter.dateEndPogash = ''
  filter.statusProjectPlan = ''
  filter.finansEnum = ''


  getByPagination(1)
}

const filterShow = ref(false)
const itemForDelete = ref(null)

function getByPagination(pageNumber) {
  paginationParams.loading = true
  ProjectService.getList(pageNumber, paginationParams.pageSize).then(response => {
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
  modalParams.datas.id = item.id
  modalParams.datas.name = item.name
  modalParams.datas.baseUrl = item.baseUrl
  modalParams.datas.redirectURL = item.redirectURL
  modalParams.datas.redirectURLEsia = item.redirectURLEsia
  modalParams.datas.organisationUrl = item.organisationUrl
  modalParams.datas.userRoleUrl = item.userRoleUrl
  modalParams.datas.userUrl = item.userUrl
  modalParams.datas.description = item.description
  modalParams.datas.formBase64PNG = item.formBase64PNG
  modalParams.datas.base64PNG = item.base64PNG
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
  ProjectService.edit(modalParams.datas).then(response => {

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

function handleFileUpload(event) {
  modalParams.datas.preview = URL.createObjectURL(event.target.files[0])
  modalParams.datas.formBase64PNG = event.target.files[0];
}

const hide = () => {
  cash('.dropdown-menu').dropdown('hide')
}
onMounted(() => {
  getByPagination(1)
})
</script>
