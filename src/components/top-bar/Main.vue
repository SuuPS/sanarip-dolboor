<template>
  <!-- BEGIN: Top Bar -->
  <div class="top-bar -mx-4 px-4 md:mx-0 md:px-0">
    <!-- BEGIN: Breadcrumb -->
    <div class="-intro-x breadcrumb mr-auto hidden sm:flex">
      <!--      <a href="">Application</a>-->
      <!--      <ChevronRightIcon class="breadcrumb__icon" />-->
      <!--      <a href="" class="breadcrumb&#45;&#45;active">Dashboard</a>-->
    </div>

    <div class="intro-x dropdown w-8 h-8">
      <div
        class="dropdown-toggle w-8 h-8 rounded-full overflow-hidden shadow-lg image-fit zoom-in"
        role="button"
        aria-expanded="false"
      >
        <img
          alt="Tinker Tailwind HTML Admin Template"
          :src="require(`@/assets/images/user_logo.png`)"
        />
      </div>
      <div class="dropdown-menu w-56" id="profile-dropdown">
        <div class="dropdown-menu__content box dark:bg-dark-6">
          <div class="p-4 border-b border-black border-opacity-5 dark:border-dark-3">

            <div class="font-medium">
              {{ user != null && user.organization != null ? user.organization.ozShortName : '' }}</div>

            <div class="font-medium">
              {{ user != null && user.name != null && user.surname != null && user.patronymic != null ? user.surname + ' ' + user.name + ' ' + user.patronymic : '' }}</div>

            <div class="text-xs text-gray-600 mt-0.5 dark:text-gray-600">
              {{ user != null && user.pin != null ?  user.pin : '' }}
            </div>
          </div>
          <div class="p-2">
            <router-link to="/profile" class="flex items-center block p-2 transition duration-300 ease-in-out hover:bg-gray-200 dark:hover:bg-dark-3 rounded-md"> <UserIcon class="w-4 h-4 mr-2" /> Профиль</router-link>
          </div>
          <div
            class="p-2 border-t border-black border-opacity-5 dark:border-dark-3"
          >
            <a href="#"
              @click="logout"
              class="flex items-center block p-2 transition duration-300 ease-in-out hover:bg-gray-200 dark:hover:bg-dark-3 rounded-md"
            >
              <ToggleRightIcon class="w-4 h-4 mr-2" /> Выйти
            </a>
          </div>
        </div>
      </div>
    </div>
    <!-- END: Account Menu -->
  </div>
  <!-- END: Top Bar -->
</template>

<script>
import { defineComponent, ref } from 'vue'
import store from '@/store'

export default defineComponent({
  data() {
    return {
      user: store.state.auth.user.user
    }
  },
  setup() {
    const searchDropdown = ref(false)

    const showSearchDropdown = () => {
      searchDropdown.value = true
    }

    const hideSearchDropdown = () => {
      searchDropdown.value = false
    }

    return {
      searchDropdown,
      showSearchDropdown,
      hideSearchDropdown
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('auth/signOut').then(
        () => {
          this.$router.push('/sign-in')
          cash('#profile-dropdown').dropdown('hide')
        },
        (error) => {
          this.loading = false
          this.message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        })
      this.$store.user = null
    }
  },
})

</script>
