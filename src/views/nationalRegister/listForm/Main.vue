<script setup>
import $api from '@/http'
import {onMounted, reactive, ref, onUnmounted, computed, watch, watchEffect} from "vue";
import {StatusAll, ProductService} from "@/services";
import {createToast} from "mosha-vue-toastify";
import {useRoute} from "vue-router";

const loading = ref(false)

const statusSystemList = ref([])
const statusDocList = ref([])

const filter = reactive({
  filter: false,
  filterByNomerBlanka: null,
  filterByStatusSystem: null,
  filterByStatusDoc: null
})

const genResult = reactive({
  number: null,
  size: null,
  totalPages: null,
  totalElements: null,
  content: [],
  pagenumbersStart: null,
  pagenumbersEnd: null
})

const router = useRoute();

function resetFilter() {
  filter.filterByNomerBlanka = null
  filter.filterByStatusSystem = null
  filter.filterByStatusDoc = null
  getByPagination(genResult.number)
}

const cause = reactive({
  idProduct: null,
  name: null,
  modal: false,
  method: null,
})

function showCreateModal(id, method) {
  cause.modal = true
  cause.idProduct = id
  cause.method = method
}

async function getByPagination(page) {
  try {
    await (async () => {
      ProductService.getProductList({

        page: page,
        size: 15,
        filter,

      }).then(response => {
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

async function restoreProduct(id, name) {

  ProductService.restoreProduct(id, name).then(response => {
    createToast({
      title: 'Продукт приостановлен!'
    }, {
      type: 'success',
      position: 'top-right',
      showIcon: true,
    })
    getByPagination(genResult.number)
    resetData()
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

async function suspendProduct(id, name) {

  ProductService.suspendProduct(id, name).then(response => {
    createToast({
      title: 'Продукт приостановлен!'
    }, {
      type: 'success',
      position: 'top-right',
      showIcon: true,
    })
    getByPagination(genResult.number)
    resetData()
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

function causePost() {
  if (cause.name != null && cause.name != '') {
    if (cause.method == 'SUSPEND') {
      suspendProduct(cause.idProduct, cause.name)
    } else (
      restoreProduct(cause.idProduct, cause.name)
    )
  }
}

async function getDictionaries() {

  StatusAll.getStatusSystems().then(
    (response) => {
      if (response.status == 200) {
        statusSystemList.value = response.data
      }
    },
    (error) => {
      console.log(error)
    }
  )
  StatusAll.getStatusDocs().then(
    (response) => {
      if (response.status == 200) {
        statusDocList.value = response.data
      }
    },
    (error) => {
      console.log(error)
    }
  )

}

onUnmounted(() => {
  getByPagination(genResult.number)
  getDictionaries()
});

const updateTab = () => {
  getByPagination(genResult.number)
  getDictionaries()
};

function resetData() {
  cause.name = null
  cause.idProduct = null
  cause.modal = false
  cause.method = null
}

onMounted(() => {
  getByPagination(genResult.number)
  getDictionaries()
});

</script>

<template>
  <div class="flex items-center mt-8">
    <h2 class="intro-y text-lg font-medium mr-auto">
      Национальный реестр
    </h2>
  </div>
  <div class="flex justify-start">
    <router-link
      target="_blank"
      class="btn btn-primary w-36 h-10 mt-5 text-base"
      :to="{ name: 'nationalRegisterObject', query: { id: null }  }">Добавить
    </router-link>
  </div>

  <div class="intro-y box mt-4">
    <div class="p-5 border-b border-gray-200 dark:border-dark-5">
      <div class="grid grid-cols-12 gap-2">
        <div class="col-span-12 lg:col-span-3">
          <label for="form_42" class="form-label font-medium text-base">
            Номер бланка (БСО)
          </label>
          <input
            v-model="filter.filterByNomerBlanka"
            maxlength="255"
            id="form_42"
            type="text"
            class="form-control">
        </div>
        <div class="col-span-12 lg:col-span-3">
          <label for="form_42" class="form-label font-medium text-base">
            Статус системы
          </label>
          <select v-model="filter.filterByStatusSystem" id="input-wizard-6" class="form-select">
            <option selected :value="null">Все варианты</option>
            <option v-for="item in statusSystemList" :value="item.code">{{ item.name }}</option>
          </select>
        </div>
        <div class="col-span-12 lg:col-span-3">
          <label for="form_42" class="form-label font-medium text-base">
            Статус документа
          </label>
          <select v-model="filter.filterByStatusDoc" id="input-wizard-6" class="form-select">
            <option selected :value="null">Все варианты</option>
            <option v-for="item in statusDocList" :value="item.code">{{ item.name }}</option>
          </select>
        </div>
      </div>
      <div class="mt-3 flex">
        <button @click="getByPagination(genResult.number)"
                class="btn btn-outline-primary">Обновить
          <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
               class="feather feather-refresh-ccw block ml-2">
            <polyline points="1 4 1 10 7 10"></polyline>
            <polyline points="23 20 23 14 17 14"></polyline>
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
          </svg>
        </button>
        <button
          @click="resetFilter"
          class="btn btn-outline-primary ml-2">Сбросить фильтры
          <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
               class="feather feather-x-circle block ml-2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </button>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-12 gap-4 mt-5">
    <div class="col-span-12 border rounded-xl p-3 bg-theme-4 shadow">
      <div class="overflow-auto lg:overflow-visible mt-8 sm:mt-0">
        <div class="overflow-x-scroll">
          <table class="table sm:mt-2 bg-white rounded-xl">
            <thead>
            <tr class="bg-gray-200 text-gray-700">
              <th class="border-r border-black whitespace-nowrap text-center">
                Действие
              </th>
              <th class="border-r border-black whitespace-nowrap text-center">
                Статус в системе
              </th>
              <th class="border-r border-black whitespace-nowrap text-center">
                Статус документа
              </th>
              <th class="border-r border-black whitespace-nowrap text-center">
                Номер документа
              </th>
              <th class="border-r border-black whitespace-nowrap text-center">
                Дата документа
              </th>
              <th class="border-r border-black whitespace-nowrap text-center">
                Номер бланка
              </th>
              <th class="border-r border-black whitespace-nowrap text-center">
                Причина изменения
              </th>
              <th class="border-r border-black whitespace-nowrap text-center">
                Продукция
              </th>
              <th class="border-r border-black whitespace-nowrap text-center">
                Изготовитель
              </th>
              <th class="border-r border-black whitespace-nowrap text-center">
                Заявитель
              </th>
              <th class="border-r border-black whitespace-nowrap text-center">
                Действие до
              </th>
              <th class="whitespace-nowrap">
                Кто подписал
              </th>
            </tr>
            </thead>
            <tbody>
            <tr
              class="hover:bg-gray-200"
              v-for="(item, index) in genResult.content">
              <td class="border-r border-black text-center">
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
                      <router-link
                        target="_blank"
                        class="flex justify-between block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"
                        :to="{ name: 'nationalRegisterObject', query: { id: item.id, method: 'OPEN' }  }">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24"
                             fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                             stroke-linejoin="round" class="feather feather-search block">
                          <circle cx="11" cy="11" r="8"></circle>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <div>
                          Посмотреть
                        </div>
                      </router-link>
                      <router-link
                        target="_blank"
                        class="flex justify-between block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"
                        :to="{ name: 'nationalRegisterObject', query: { id: item.id, method: 'COPY' }  }">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24"
                             fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                             stroke-linejoin="round" class="feather feather-copy block">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        <div>
                          Скопировать
                        </div>
                      </router-link>
                      <router-link
                        target="_blank"
                        v-if="item.statusDoc?.code != 'suspended' && item.statusDoc?.code != 'canceled'"
                        class="flex justify-between block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"
                        :to="{ name: 'nationalRegisterObject', query: { id: item.id, method: 'EDIT' }  }">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24"
                             fill="none"
                             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                             class="feather feather-edit-2 w-4 h-4 w-4 h-4 mr-2">
                          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                        </svg>
                        <div>
                          {{ item.statusSystem.id == 2 ? 'Переоформить' : 'Редактировать' }}
                        </div>
                      </router-link>
                      <button
                        v-if="item.statusDoc?.code != 'suspended' && item.statusSystem?.code != 'draft' && item.statusDoc?.code != 'canceled'"
                        @click="showCreateModal(item.id, 'SUSPEND')"
                        type="button"
                        class="flex items-center block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24"
                             fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                             stroke-linejoin="round" class="feather feather-pause-circle block mx-auto block mx-auto">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="10" y1="15" x2="10" y2="9"></line>
                          <line x1="14" y1="15" x2="14" y2="9"></line>
                        </svg>
                        Приостановить
                      </button>
                      <button
                        v-if="item.statusDoc?.code === 'suspended' && item.statusDoc?.code != 'canceled'"
                        @click="showCreateModal(item.id, 'RESTORE')"
                        class="flex items-center block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24"
                             fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                             stroke-linejoin="round" class="feather feather-rotate-ccw block mx-auto block mx-auto">
                          <polyline points="1 4 1 10 7 10"></polyline>
                          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                        </svg>
                        Возобновить
                      </button>
                    </div>
                  </div>
                </div>
              </td>
              <td class="border-r border-black text-center">{{ item.statusSystem.name }}</td>
              <td class="border-r border-black text-center">{{ item.statusDoc ? item.statusDoc.name : '' }}</td>
              <td class="border-r border-black text-center">{{ item.registrasionyiNomerSgr }}</td>
              <td class="border-r border-black text-center">{{ item.dataRegistrasii }}</td>
              <td class="border-r border-black text-center">{{ item.nomerBlanka }}</td>
              <td class="border-r border-black text-center">
                {{ item.cause.length > 0 ? item.cause[item.cause.length - 1].name : '' }}
              </td>
              <td class="border-r border-black text-center">{{ item.name.substr(0, 50) }}</td>
              <td class="border-r border-black text-center">{{
                  item.naimenovanieIAddressIzgotovitelya.substr(0, 50)
                }}
              </td>
              <td class="border-r border-black text-center">{{ item.naimenovanieIAdressZaiavitela.substr(0, 50) }}</td>
              <td class="border-r border-black text-center">{{ item.srokDistvia ? item.srokDistvia.name : '' }}</td>
              <td class="border-r border-black text-center">{{ item.doljnost ? item.doljnost.name : '' }}</td>
            </tr>
            </tbody>
          </table>
        </div>
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
    v-if="cause.modal"
    id="education-modal"
    class="modal overflow-y-auto show custom-modal"
    aria-hidden="true"
    data-backdrop='static'
    style="z-index: 999!important;"
  >
    <div class="modal-dialog">
      <form class="modal-content">
        <!-- BEGIN: Modal Body -->
        <div class="modal-body grid grid-cols-12 gap-4 gap-y-3">
          <div class="col-span-12">
            <label class="form-label">Причина смены статуса<span style="color: red">*</span></label>
            <textarea
              required
              rows="2"
              maxlength="255"
              type="text"
              class="form-control"
              v-model="cause.name"
              style="border-top-right-radius: 0px; border-bottom-right-radius: 0px; resize: none; ">
            </textarea>
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
          <button
            @click="causePost()"
            v-if="!loading"
            type="button"
            class="btn btn-primary">
            Сохранить
          </button>
        </div>
        <!-- END: Modal Footer -->
      </form>
    </div>
  </div>

</template>

