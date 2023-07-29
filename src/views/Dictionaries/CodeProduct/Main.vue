<template>
  <div class="grid grid-cols-12 gap-4 mt-5">
    <div class="col-span-full"><h1 class="text-xl font-bold">Коды продуктов</h1></div>
    <div class="col-span-12 border rounded-xl p-3 bg-theme-4 shadow">
      <button
        v-if="checkArray('ADMIN')"
        type="button"
        @click="showCreateModal()"
        class="btn btn-primary">
        <PlusIcon class="w-4 h-4 mr-2"/>
        Добавить
      </button>
      <div class="overflow-auto lg:overflow-visible mt-8 sm:mt-0">
        <table class="table sm:mt-2 bg-white rounded-xl">
          <thead>
          <tr class="bg-gray-200 text-gray-700">
            <th>Название</th>
            <th>Код</th>
            <th v-if="checkArray('ADMIN')" class="text-center whitespace-nowrap">Действия</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="codeitem in genResult.content" :key="codeitem" class="hover:bg-gray-200">
            <td class="border-b dark:border-dark-5">{{ codeitem.name.substr(0, 50) }}</td>
            <td class="border-b dark:border-dark-5">{{ codeitem.code.substr(0, 50) }}</td>
            <td v-if="checkArray('ADMIN')" class="table-report__action border-b dark:border-dark-5">
              <div class="flex justify-center items-center">
                <a class="flex items-center mr-3" href="javascript:;"
                @click="showEditModal(codeitem)">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                     class="feather feather-check-square w-4 h-4 mr-1 w-4 h-4 mr-1">
                  <polyline points="9 11 12 14 22 4"></polyline>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                </svg>

                Редактировать </a>
                <a class="flex items-center text-theme-6"
                   href="javascript:;"
                   @click="showModalDelete(codeitem)"
                   data-toggle="modal"
                   data-target="#delete-confirmation-modal">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                     class="feather feather-trash-2 w-4 h-4 mr-1 w-4 h-4 mr-1">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
                Удалить</a>
              </div>
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

            <!-- Название-->
            <div class="col-span-12">
              <label class="form-label">Название <span style="color: red">*</span></label>
              <input
                maxlength="255"
                v-model="modalParams.datas.name"
                required
                type="text"
                placeholder="Введите название..."
                class="form-control"
              />
            </div>
            <!-- Code -->
            <div class="col-span-12">
              <label class="form-label">Введите код <span style="color: red">*</span></label>
              <input
                maxlength="255"
                v-model="modalParams.datas.code"
                required
                type="text"
                placeholder="Введите код"
                class="form-control"
              />
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
            <button @click="confirmDelete()" data-dismiss="modal" type="button" class="btn btn-danger w-24">Удалить
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- END: Modal Content -->
</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import {createToast} from "mosha-vue-toastify";
import {CodeProductService, ProductService} from "@/services";
import checkArray from '@/libs/checkArray'
import store from "@/store";

const loading = ref(false)
const genResult = reactive({
  number: null,
  size: null,
  totalPages: null,
  totalElements: null,
  content: [],
  pagenumbersStart: null,
  pagenumbersEnd: null
})
const modalParams = reactive({
  show: false,
  isEditModal: false,
  datas: {
    id: null,
    name: null,
    code: null,
  }
})
const idCode = ref(null)

async function getByPagination(page) {
  try {
    await (async () => {
      CodeProductService.getCodeProductsWithPagination({page: page, size: 15}).then(response => {
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
  modalParams.datas.id = item.id
  modalParams.datas.code = item.code
  modalParams.datas.name = item.name
}

function confirmDelete() {
  CodeProductService.deleteCodeProduct({id: idCode.value}).then(response => {
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
  CodeProductService.editCodeProduct(modalParams.datas).then(response => {
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
  CodeProductService.createCodeProducts(modalParams.datas).then(
    (response) => {
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
    },
    (error) => {
      if(error.response.status == 409){
        loading.value = false,
          createToast({
            title: 'Запись с таким кодом уже существует',
          }, {
            type: 'danger',
            position: 'top-right',
            showIcon: true
          })
      }
      else{
        loading.value = false
        createToast({
          title: 'Произошла ошибка!',
        }, {
          type: 'danger',
          position: 'top-right',
          showIcon: true
        })
      }
    }
  )
}

function resetData() {
  modalParams.show = false
  modalParams.datas.id = null
  modalParams.datas.code = null
  modalParams.datas.name = null
}

onMounted(async () => {
  await getByPagination(genResult.number)
})
</script>
