<template>
  <div class="grid grid-cols-12 gap-4 p-3">
    <div class="col-span-12">
      <span class="font-bold text-xl">Привязка ролей систем к типу ОЗ {{ route.query.name }}</span>
    </div>
  </div>
  <div class="rounded-xl">
    <form @submit.prevent="isEdit ? edit() :save()" class="grid grid-cols-12 gap-4 p-2">

      <div v-for="(item, index) in project" class="box col-span-12 lg:col-span-6 p-3 rounded-xl">
        <div class="grid grid-cols-12 gap-3">
          <div class="col-span-3">
            <img
              v-if="String(item.projectImage).includes('.jpeg') || String(item.projectImage).includes('.jpg') || String(item.projectImage).includes('.png')"
              class="w-24"
              :style="!item.selected ? 'filter: grayscale(100%);-webkit-filter: grayscale(100%);' : ''"
              :src="'https://dev.med.kg/imed-back/uploads/'+item.projectImage" alt="logo">
          </div>
          <div class="col-span-9 flex items-stretch">
            <div class="grid grid-cols-12 gap-2 content-between w-full">
              <div class="col-span-12 flex w-full">
                <p class="font-bold w-full">{{ item.projectName }}</p>
                <input v-model="item.selected" @change="getProjectRoles(item.projectId, index, item.selected)" type="checkbox"
                       class="form-check-input self-end justify-self-end">
              </div>
              <div class="col-span-12 content-center">
                <Select2 v-model="item.selectedRoles" :disabled="!item.selected" :options="item.roles"
                         :settings="select2SettingsMulti"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-span-12 justify-end">
        <button type="submit" class="btn btn-primary">Сохранить</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import {useRoute, useRouter} from "vue-router";
import {onMounted, reactive, ref} from "vue";
import {ProjectService, TypeOrganizationService} from "@/services";
import Select2 from "vue3-select2-component";
import {select2SettingsMulti} from "@/helpers/select2Settings";
import {createToast} from "mosha-vue-toastify";

const route = useRoute()
const router = useRouter()

const project = reactive([])
const loading = ref(false)
const isEdit = ref(false)

function getProjects() {
  ProjectService.getListWithoutPage().then(response => {
    response.data.result.forEach(item => {
      project.push({
        projectId: item.id,
        projectName: item.name,
        projectImage: item.base64PNG,
        selected: false,
        roles: [],
        selectedRoles: []
      })
    })


    getRolesFromDb()
  })
}

function getProjectRoles(id, index, selected) {
  if (selected && project.at(index).roles.length == 0) {
    ProjectService.getRolesByProjectId(id).then(response => {
      response.data.forEach(item => {
        project.at(index).roles.push({
          id: item.id,
          text: item.roleName
        })
      })
    })
  } else {
    project.at(index).selectedRoles = []
  }
}

const save = () => {
  loading.value = true
  let roles = []
  project.forEach(item => {
    if (item.selected) {
      roles.push(...item.selectedRoles)
    }
  })
  if (roles.length == 0){
    createToast({
      title: 'Выберите роли для систем!',
    }, {
      type: 'danger',
      position: 'top-right',
      showIcon: true,
      timeout: 2000
    })
  } else {
    TypeOrganizationService.setRoles({typeOrganisationId: route.query.id, projectRoles: roles}).then(response => {
      loading.value = false
      createToast({
        title: 'Запись успешно сохранена!'
      }, {
        type: 'success',
        position: 'top-right',
        showIcon: true,
        timeout: 2000
      })
      router.push({name: 'TypeOrganization'})
    }).catch(() => {
      loading.value = false
      createToast({
        title: 'Произошла ошибка при сохранении!',
      }, {
        type: 'danger',
        position: 'top-right',
        showIcon: true,
        timeout: 2000
      })
    })
  }

}
const edit = () => {
  loading.value = true
  let roles = []
  project.forEach(item => {
    if (item.selected) {
      roles.push(...item.selectedRoles)
    }
  })
  if (roles.length == 0){
    createToast({
      title: 'Выберите роли для систем!',
    }, {
      type: 'danger',
      position: 'top-right',
      showIcon: true,
      timeout: 2000
    })
  } else {
    TypeOrganizationService.updateRoles({typeOrganisationId: route.query.id, projectRoles: roles}).then(response => {
      loading.value = false
      createToast({
        title: 'Запись успешно сохранена!'
      }, {
        type: 'success',
        position: 'top-right',
        showIcon: true,
        timeout: 2000
      })
      router.push({name: 'TypeOrganization'})
    }).catch(() => {
      loading.value = false
      createToast({
        title: 'Произошла ошибка при сохранении!',
      }, {
        type: 'danger',
        position: 'top-right',
        showIcon: true,
        timeout: 2000
      })
    })
  }

}
function getRolesFromDb(){
  TypeOrganizationService.getRoles(route.query.id).then(response => {
    if(response.data != null && response.data.length >0){
      isEdit.value = true
    }
    project.forEach((item, index) => {
      response.data.forEach(it => {
        if(item.projectId == it.projectId){
          item.selected = true
          getProjectRoles(item.projectId, index, true)
          item.selectedRoles = it.projectRoles
        }
      })
    })
  })
}
onMounted(() => {
  getProjects()
})
</script>

<style scoped>

</style>
