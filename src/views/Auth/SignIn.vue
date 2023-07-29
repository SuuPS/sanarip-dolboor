<template>
  <section class="bg-gray-50 dark:bg-gray-900 p-2">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 p-5">
      <a href="#" class="flex items-center mb-6 text-2xl font-semibold text-gray-100 dark:text-white">
        <img class="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo">
        IMed
      </a>
      <div
        class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 class="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Вход в систему
          </h1>
          <form class="space-y-4 md:space-y-6" @submit.prevent="submit">
            <div>
              <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Логин</label>
              <input v-model.trim="v$.login.$model" type="text" name="email" id="email"
                     class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                     placeholder="Логин" required=""
                     :class="{ 'border-theme-21' : v$.login.$error }">
              <p
                v-for="(error, index) in v$.login.$errors"
                :key="index"
                class="pt-2 pl-2 text-theme-21"
              >
                {{ error.$message }}
              </p>

            </div>
            <div>
              <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Пароль</label>
              <div class="input-group mt-4">
                <input :type="isShowPsw ? 'text' : 'password'"
                       class="form-control py-3 px-4 border-gray-300 block"
                       aria-describedby="input-group-price"
                       v-model="v$.password.$model"
                       type="password"
                       placeholder="Введите пароль"
                       :class="{ 'border-theme-21': v$.password.$error }"
                />
                <button type="button" id="input-group-price" @click="showPsw" class="input-group-text">
                  <svg v-if="!isShowPsw" xmlns="http://www.w3.org/2000/svg" width="22px" height="22px"
                       viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                       stroke-linejoin="round" class="feather feather-eye-off block mx-auto block mx-auto">
                    <path
                      d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                  <svg v-if="isShowPsw" xmlns="http://www.w3.org/2000/svg" width="22px" height="22px"
                       viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                       stroke-linejoin="round" class="feather feather-eye block mx-auto block mx-auto">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
              </div>
              <p
                v-for="(error, index) in v$.password.$errors"
                :key="index"
                class="pt-2 pl-2 text-theme-21"
              >
                {{ error.$message }}
              </p>
            </div>
            <div class="flex items-center justify-between">
              <a href="#" class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Забыли
                пароль?</a>
            </div>
            <div class="grid grid-cols-12 gap-2">
              <div class="col-span-12">
                <button type="submit"
                        :disabled="loading"
                        class="btn bg-primary-10 w-full text-white h-10">
                  <LoadingIcon v-if="loading" icon="oval" color="white" class="w-18 h-18 mr-2" />
                  <LogInIcon class="w-4 h-4 mr-2" />
                  Войти
                </button>
              </div>
              <div class="col-span-12 flex justify-center">
                <button type="button"
                        disabled
                        class="w-full btn bg-primary-10 text-white h-10">
                  <img src="@/assets/icons/tunduk.png" alt="tunduk" class="w-4 h-4 mr-2" style="filter: brightness(6.5)">
                  Войти через ЕСИА
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import {onMounted, reactive, ref, toRefs} from 'vue'
import {useRouter} from 'vue-router'
import {useStore} from 'vuex'
import useVuelidate from '@vuelidate/core'
import {helpers, required} from '@vuelidate/validators'
import DarkModeSwitcher from '@/components/dark-mode-switcher/Main.vue'
import Spinner from '@/app-components/UIComponents/Spinner.vue'
import {createToast} from "mosha-vue-toastify";
import mixins from "@/helpers/mixins";

const {invalidCredentials} = mixins()
const store = useStore()
const router = useRouter()

const loginForm = reactive({
  login: '',
  password: ''
})

let isShowPsw = ref(false)
let loading = ref(false)

const rules = reactive({
  login: {
    required: helpers.withMessage('Введите логин!', required)
  },
  password: {
    required: helpers.withMessage('Введите пароль!', required)
  }
})


const v$ = useVuelidate(rules, toRefs(loginForm))

function showPsw() {
  isShowPsw.value = !isShowPsw.value
}

async function submit() {
  v$.value.$touch()
  if (v$.value.$invalid) {
    createToast({
      title: 'Ошибка!',
      description: 'Обязательно заполните все поля.',
    }, {
      type: 'danger',
      position: 'top-right',
      showIcon: true,
    })
  } else {
    loading.value = true
    await store.dispatch('auth/signIn', loginForm).then(response => {
      if (response.status === 200) {
        loading.value = false
        router.push({name: 'Workspace'})
      } else {
        loading.value = false
        invalidCredentials(response.error, response.status)
        // createToast({
        //   title: 'Ошибка!',
        //   description: '' + error,
        // }, {
        //   type: 'danger',
        //   position: 'top-right',
        //   showIcon: true,
        // })
        console.log(response.error)
      }
    })

  }
}

onMounted(() => {
  cash('body')
    .removeClass('main')
    .removeClass('error-page')
  // .addClass('login')
})

</script>


