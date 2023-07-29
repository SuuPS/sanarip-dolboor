<template>
  <div>
    <div class="container sm:px-10">
      <div class="block xl:grid grid-cols-2 gap-4">
        <!-- BEGIN: Login Info -->
        <div class="hidden xl:flex flex-col min-h-screen">
          <div class="my-auto">
            <div
              class="-intro-x text-white font-medium text-2xl leading-tight mt-10"
            >
<!--              <img src="@/assets/icons/login-icon.svg" height="30" alt="Sanarip clinic"/> -->
              <br/>
              СГР<br/>
            </div>
          </div>
        </div>
        <!-- END: Login Info -->
        <!-- BEGIN: Login Form -->
        <div class="h-screen xl:h-auto flex py-5 xl:py-0 my-10 xl:my-0">
          <div
            class="my-auto mx-auto xl:ml-20 bg-white dark:bg-dark-1 xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto"
          >
            <h2
              class="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left"
            >
              Вход в систему
            </h2>
            <form @submit.prevent="submit">
              <div class="intro-x mt-8">
                <input class="intro-x login__input form-control py-3 px-4 border-gray-300 block"
                       v-model.trim="v$.pin.$model"
                       type="text"
                       :class="{ 'border-theme-21' : v$.pin.$error }"
                       placeholder="Введите логин"
                />
                <div v-if="v$.pin.$error">
                  <p
                    v-for="(error, index) in v$.pin.$errors"
                    :key="index"
                    class="pt-2 pl-2 text-theme-21"
                  >
                    {{ error.$message }}
                  </p>
                </div>
                <div class="input-group mt-4">
                  <input :type="isShowPsw ? 'text' : 'password'"
                         class="intro-x form-control py-3 px-4 border-gray-300 block"
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
                <div v-if="v$.password.$error">
                  <p
                    v-for="(error, index) in v$.password.$errors"
                    :key="index"
                    class="pt-2 pl-2 text-theme-21"
                  >
                    {{ error.$message }}
                  </p>
                </div>
              </div>
              <div
                class="intro-x flex text-gray-700 dark:text-gray-600 text-xs sm:text-sm mt-4"
              >
              </div>
              <div class="intro-x mt-5 xl:mt-8 text-center xl:text-left">
                <a href="/" class="btn btn-secondary py-3 px-4 w-full xl:w-48 xl:mr-3 align-top">
                  Вернуться на главную
                </a>
                <button type="submit" :disabled="loading"
                        class="btn btn-primary py-3 px-4 w-full xl:w-48 xl:mr-3 align-top">
                  <Spinner v-if="loading" style="height: 20px; width: 41px;"/>
                  <div v-else> Войти</div>
                </button>
              </div>
            </form>
          </div>
        </div>
        <!-- END: Login Form -->
      </div>
    </div>
  </div>

</template>

<script setup>
import {onMounted, reactive, ref, toRefs} from 'vue'
import {useRouter} from 'vue-router'
import {useStore} from 'vuex'
import useVuelidate from '@vuelidate/core'
import {helpers, required} from '@vuelidate/validators'
import Spinner from '@/app-components/UIComponents/Spinner.vue'
import {createToast} from "mosha-vue-toastify";
import mixins from "@/helpers/mixins";

const {invalidCredentials} = mixins()
const store = useStore()
const router = useRouter()

const loginForm = reactive({
  pin: '',
  password: ''
})

let isShowPsw = ref(false)
let loading = ref(false)

const rules = reactive({
  pin: {
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
      if (response.status === 201) {
        loading.value = false
        router.push({name: 'Workspace'})
      }
      else {
        store.dispatch('auth/signOut').then(
          () => {
            loading.value = false
            router.push({name: 'Workspace'})
          },
          (error) => {
            this.loading = false
            this.message =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString()

            loading.value = false
            invalidCredentials(response.error, response.status)
            createToast({
              title: 'Ошибка!',
              description: '' + error,
            }, {
              type: 'danger',
              position: 'top-right',
              showIcon: true,
            })
            console.log(response)
          })
        store.user = null
      }
    })

  }
}

onMounted(() => {
  cash('body')
    .removeClass('main')
    .removeClass('error-page')
    .addClass('login')
})

</script>


