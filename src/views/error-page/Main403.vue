<template>
  <div>
    <div class="container">
      <!-- BEGIN: Error Page -->
      <div
        class="error-page flex flex-col lg:flex-row items-center justify-center h-screen text-center lg:text-left"
      >
        <div class="-intro-x lg:mr-20">
          <img
            alt="Icewall Tailwind HTML Admin Template"
            class="h-48 lg:h-auto"
            :src="require('@/assets/images/error-illustration.svg')"
          />
        </div>
        <div class="text-white mt-10 lg:mt-0">
          <div class="intro-x text-8xl font-medium">403</div>
          <div class="intro-x text-xl lg:text-3xl font-medium mt-5">
            Отказано в доступе
          </div>
          <div class="intro-x text-lg mt-3">
            Вы запросили страницу, доступ к которой ограничен администратором системы.
          </div>
          <a href="/" class="intro-x btn py-3 px-4 text-white border-white dark:border-dark-5 dark:text-gray-300 mt-10">  Перейти на главную</a>
        </div>
      </div>
      <!-- END: Error Page -->
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted } from 'vue'

export default defineComponent({
  setup() {
    onMounted(() => {
      cash('body')
        .removeClass('main')
        .removeClass('login')
        .addClass('error-page')
    })
  }
})
</script>
