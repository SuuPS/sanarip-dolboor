<template>
  <div>
    <!-- BEGIN: Top Bar -->
    <div
      id="top-bar"
      :class="{
        'shadow-md': scrolled,
      }"
      :style="{ transition: 'background-color 1s' }"
      class="fixed w-full bg-white">
      <div class="container">
        <nav>
          <ul class="flex items-center justify-end w-full h-[70px]">
            <!-- BEGIN: First Child -->
            <li>
              <router-link class="intro-x btn border-none bg-[#e4ecfd] text-[#0d4cd3] flex justify-center font-normal"
                           to="/workspace">
                Личный кабинет
              </router-link>
            </li>
            <!-- END: First Child -->
          </ul>
        </nav>
      </div>
    </div>
    <!-- END: Top Bar -->

    <!-- BEGIN: Content -->
    <div
      class="bg-white">
      <router-view/>
    </div>
    <!-- END: Content -->
  </div>
</template>

<script setup>
import { onMounted, ref, onBeforeUnmount} from "vue";
import { useRouter } from 'vue-router'
import { useStore } from '@/store'

const scrolled = ref(false)

// функция, которая будет вызвана при скроллинге
const handleScroll = () => {
  scrolled.value = window.pageYOffset > 0
}

// добавляем обработчик события "scroll" при монтировании компонента
window.addEventListener('scroll', handleScroll)

// удаляем обработчик события "scroll" при уничтожении компонента
// это необходимо для предотвращения утечек памяти
const cleanup = () => {
  window.removeEventListener('scroll', handleScroll)
}

const router = useRouter()
const store = useStore()

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  cleanup()
})

</script>
