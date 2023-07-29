<template>
  <div class="grid grid-cols-12 gap-4 mt-5">
    <div class="col-span-full"><h1 class="text-xl font-bold">Роли</h1></div>
    <div class="col-span-12 border rounded-xl p-3 bg-theme-4 shadow">
      <div class="overflow-auto lg:overflow-visible mt-8 sm:mt-0">
        <table class="table sm:mt-2 bg-white rounded-xl">
          <thead>
          <tr class="bg-gray-200 text-gray-700">
            <th>Системное название</th>
            <th>Название</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="role in roles" :key="role" class="hover:bg-gray-200">
            <td class="border-b dark:border-dark-5">{{ role.name }}</td>
            <td class="border-b dark:border-dark-5">{{ role.nameRu }}</td>
          </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import { AdminService } from "@/services";

const roles = ref([])

async function getDictionaries() {

  AdminService.getRoles().then(
    (response) => {
      if (response.status == 200) {
        console.log(response.data)
        roles.value = response.data
      } else {
        console.log("error")
      }
    }
  )
}

onMounted(async () => {
  // await getByPagination(1)
  await getDictionaries()
})
</script>
