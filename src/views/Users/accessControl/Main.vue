<template>
  <div class="grid grid-cols-12 gap-6">
    <div class="col-span-12">
      <h2 class="intro-y text-lg font-medium mt-10">
        Настройка доступа к системе
      </h2>
      <div class="grid grid-cols-12 gap-6 mt-5">
        <div class="col-span-6">
          <Select2
            v-model="role"
            @select="checkRole($event)"
            :options="userRoles"
            :settings="{ containerCssClass: 'm-1.5' }"
          />
        </div>
        <div class="col-span-6">
          <button
            v-show="role != null"
            data-dismiss="modal"
            @click="edit"
            class="btn btn-primary align-top"
          >
            Обновить доступы
          </button>
        </div>
        <div class="col-span-12">
          <div class="intro-y">
            <div class="overflow-x-auto sm:overflow-x-visible">
              <template
                v-for="permissionCategory in permissions"
                v-bind:key="permissionCategory"
              >
                <div class="rounded rounded-xl mb-2">
                  <div
                    @click="permissionCategory.show = !permissionCategory.show"
                    class="px-5 py-3 rounded rounded-full"
                    style="background-color: rgb(204, 229, 255);"
                  >
                  <span class="font-bold" style="cursor: pointer">
                    {{ permissionCategory.nameRu }}
                  </span>
                  <span class="ml-4">
                    <ChevronUpIcon v-if="permissionCategory.show" />
                    <ChevronDownIcon v-else />
                  </span>
                  </div>
                  <div v-if="permissionCategory.show"
                       class="grid grid-cols-12 gap-1 text-gray-700 dark:text-gray-500 bg-gray-100 dark:bg-dark-1 border-b border-gray-200 dark:border-dark-1"
                  >
                    <div class="col-span-6 pl-4 p-2">
                      <table class="table table--sm">
                        <tbody>
                        <tr v-for="permission in permissionCategory.actionForUsers"
                            v-bind:key="permission"
                            class="hover:bg-theme-18"
                        >
                          <td>
                            <div>{{ permission.nameRu }}</div>
                            <div class="text-xs text-gray-500">({{ permission.name }})</div>
                          </td>
                          <td>
                            <input
                              v-model="checkedPermissions"
                              :disabled="role === null"
                              :value="permission.id"
                              class="form-check-input"
                              style="width: 30px; height: 30px; color: white"
                              type="checkbox"
                            />
                          </td>
                        </tr>
                        </tbody>
                      </table>
                      <label></label>

                      <!--                    <div class="px-5 py-3">-->
                      <!--                      <div class="grid grid-cols-2 justify-items-center">-->
                      <!--                        <div class="col-span-12">-->
                      <!--                         -->
                      <!--                        </div>-->
                      <!--                        <div class="col-span-12">-->
                      <!--                          <label>{{ permission.name }}</label>-->
                      <!--                        </div>-->
                      <!--                      </div>-->
                      <!--                    </div>-->
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import {defineComponent} from 'vue'
import Select2 from 'vue3-select2-component'
import {AdminService} from "@/services";
import {createToast} from "mosha-vue-toastify";

export default defineComponent({
  components: {
    Select2
  },
  data() {
    return {
      role: null,
      userRoles: [],
      permissions: [],
      rolePermissions: [],
      actionId: '',
      checkedPermissions: []
    }
  },
  mounted() {
    this.refreshData()
  },
  methods: {
    refreshData() {
      AdminService.getRoles().then(response => {
        this.userRoles = []
        response.data.result.forEach(item => {
          this.userRoles.push({id: item.id, text: item.name})
        })
      })
      AdminService.getPermissionCategories().then(response => {
        this.permissions = []
        response.data.result.forEach(item => {
          this.permissions.push({
            id: item.id,
            name: item.name,
            nameRu: item.nameRu,
            actionForUsers: item.actionForUsers,
            orderByField: item.orderByField,
            show: false
          })
        })
        this.permissions.sort((a, b) => {
          if ( a.orderByField < b.orderByField ){
            return -1;
          }
          if ( a.orderByField > b.orderByField ){
            return 1;
          }
          return 0;
        })
      })
      if (this.role != null) {
        AdminService.getPermissionsByRoleId(this.role).then(response => {
          this.rolePermissions = response.data.permissions
          this.rolePermissions.forEach(item => {
            this.checkedPermissions.push(item.id)
          })
        })
      }
    },
    checkRole() {
      this.checkedPermissions = []
      if (this.role != null) {
        AdminService.getPermissionsByRoleId(this.role).then(response => {
          this.rolePermissions = response.data.permissions
          this.rolePermissions.forEach(item => {
            this.checkedPermissions.push(item.id)
          })
        })
      }
    },
    edit() {
      if (this.role != null) {
        AdminService.editRolePermissions(this.role, this.checkedPermissions).then(response => {
          createToast({
            title: 'Доступы успешно обновлены!',
          }, {
            type: 'success',
            position: 'top-right',
            showIcon: true
          })
          this.refreshData()
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
    }
  }
})
</script>
