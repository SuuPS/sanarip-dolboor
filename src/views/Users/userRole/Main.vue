<template>
  <div class="grid grid-cols-12 gap-6">
    <div class="col-span-12">
      <h2 class="text-lg font-medium mt-10">Роли</h2>
      <div class="grid grid-cols-12 gap-6 mt-5">
        <div
          class="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2"
        >
          <a
            href="javascript:;"
            data-toggle="modal"
            data-target="#create-modal"
            class="btn btn-primary shadow-md mr-2"
            @click="showModalCreate"
          >Добавить роль</a
          >
        </div>

        <div class="col-span-12 preview box p-3">
          <div class="overflow-x-auto">
            <table class="table">
              <thead class="rounded-full sticky">
              <tr class="bg-gray-200 text-gray-700">
                <th class="border-b-2 text-center dark:border-dark-5 width-60">Название</th>
                <th class="border-b-2 text-center dark:border-dark-5 width-60">Системное название</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in userroles" v-bind:key="item" class="hover:bg-gray-200">
                <td class="border text-center">{{ item.nameRu }}</td>
                <td class="border text-center">{{ item.name }}</td>
              </tr>
              <tr v-if="userroles.length===0 && !loading">
                <td colspan="10" class="text-center border">(нет записей)</td>
              </tr>
              <tr v-if="loading">
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
                <a class="pagination__link " @click="refreshData(1)">
                  <ChevronsLeftIcon class="w-4 h-4"/>
                </a>
              </li>
              <li v-if="paginationParams.currentPage > 1">
                <a class="pagination__link"
                   @click="refreshData(paginationParams.currentPage - 1)">
                  <ChevronLeftIcon class="w-4 h-4"/>
                </a>
              </li>
              <template v-for="page in paginationParams.pagenumbersEnd" v-bind:key='page'>
                <li v-if="paginationParams.pagenumbersStart <= page || page >= paginationParams.pagenumbersEnd">
                  <a class="pagination__link"
                     v-bind:class="{ 'pagination__link pagination__link--active' : page === paginationParams.currentPage}"
                     @click="refreshData(page)">
                    <p class="" v-bind:class="{ 'text-black' : page === paginationParams.currentPage}">
                      {{ page }}
                    </p>
                  </a>
                </li>
              </template>
              <li v-if="paginationParams.currentPage !== paginationParams.totalPages">
                <a class="pagination__link "
                   @click="refreshData(paginationParams.currentPage + 1)">
                  <ChevronRightIcon class="w-4 h-4"/>
                </a>
              </li>
              <li v-if="paginationParams.currentPage < paginationParams.totalPages - 3">
                <a class="pagination__link"
                   @click="refreshData(paginationParams.totalPages)">
                  <ChevronsRightIcon class="w-4 h-4"/>
                </a>
              </li>
            </ul>

            <select v-model.number="paginationParams.pageSize" @change="refreshData(1)"
                    class="w-20 form-select mt-3 sm:mt-0">
              <option value="10">10</option>
              <option value="25">25</option>
              <option>35</option>
              <option>50</option>
            </select>
          </div>
        </div>
      </div>
      <!-- BEGIN: Create Oblast Modal -->
      <div
        id="create-modal"
        class="modal"
        tabindex="-1"
        aria-hidden="true"
        data-backdrop="static"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-body p-0">
              <div class="p-5 text-center">
                <div class="text-3xl mt-5">{{ nameForModal }}</div>
              </div>
              <form v-on:submit.prevent="isEditingModal ? edit() : create()">
                <div class="p-5">
                  <label class="form-label left-0">Название</label>
                  <input
                    v-model="userrole.nameRu"
                    type="text"
                    required
                    class="intro-x login__input form-control py-3 px-4 border-gray-300 block mb-4"
                  />
                  <label class="form-label left-0">Название для системы</label>
                  <input
                    v-model="userrole.name"
                    type="text"
                    required
                    class="intro-x login__input form-control py-3 px-4 border-gray-300 block mb-4"
                  />
                  <button
                    type="submit"
                    class="btn btn-primary py-3 px-4 mt-5 w-full xl:w-32 xl:mr-3 align-top"
                  >
                    {{ nameOfButtonForModal }}
                  </button>
                  <button
                    type="button"
                    id="close"
                    data-dismiss="modal"
                    @click="resetData"
                    class="btn btn-light py-3 px-4 mt-5 w-full xl:w-32 xl:mr-3 align-top"
                  >
                    Отмена
                  </button>
                </div>
              </form>
              <div
                class="intro-x flex text-gray-700 dark:text-gray-600 text-xs sm:text-sm mt-4"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <!-- END: Create Oblast Modal -->
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import {defineComponent, reactive} from 'vue'
import $ from 'jquery'
import {AdminService} from "@/services";
import {createToast} from "mosha-vue-toastify";

export default defineComponent({
  data() {
    return {
      loading: false,
      nameForModal: '',
      nameOfButtonForModal: '',
      isEditingModal: false,
      totalItems: Number,
      pageSizes: [10, 25, 35, 50, 100],
      userroles: {
        type: Array
      },
      userrole: {
        id: '',
        name: '',
        nameRu: ''
      },
      paginationParams: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        pageSize: 10,
        pagenumbersStart: 1,
        pagenumbersEnd: 0,
      }
    }
  },
  mounted() {
    this.refreshData(1)
  },
  methods: {
    resetData() {
      Object.assign(this.$data.userrole, this.$options.data().userrole)
    },
    onPageClick(pageNumber) {
      this.pagination.currentPage = pageNumber
      this.refreshData()
    },
    refreshData(page) {
      this.loading = true
      AdminService.getRolesWithPage(page, this.paginationParams.pageSize).then(response => {
        this.loading = false
        this.userroles = response.data.result
        this.paginationParams.currentPage = response.data.currentPage
        this.paginationParams.totalPages = response.data.totalPages
        this.paginationParams.totalItems = response.data.totalItems
        this.paginationParams.pagenumbersStart = this.paginationParams.currentPage - 1 > 1 ? this.paginationParams.currentPage - 1 : 1
        this.paginationParams.pagenumbersEnd = this.paginationParams.currentPage + 5 < this.paginationParams.totalPages ? this.paginationParams.currentPage + 5 : this.paginationParams.totalPages
      }).catch(error => {
        this.loading = false
        createToast({
          title: 'Произошла ошибка!',
        }, {
          type: 'danger',
          position: 'top-right',
          showIcon: true
        })
      })
    },

    showModalCreate() {
      this.nameForModal = 'Добавление роли'
      this.nameOfButtonForModal = 'Добавить'
      this.isEditingModal = false
    },
    create() {
      AdminService.createRole(this.userrole).then(response => {
        createToast({
          title: 'Запись успешно сохранена!',
        }, {
          type: 'success',
          position: 'top-right',
          showIcon: true
        })
        this.resetData()
        $('#close').click()
        this.refreshData()
      })
        .catch(error => {
          createToast({
            title: 'Произошла ошибка!',
          }, {
            type: 'danger',
            position: 'top-right',
            showIcon: true
          })
        })
    },
    showModalEdit(item) {
      this.userrole.id = item.id
      this.userrole.name = item.name
      this.isEditingModal = true
      this.nameForModal = 'Редактирование роли'
      this.nameOfButtonForModal = 'Изменить'
    }
  }
})
</script>
