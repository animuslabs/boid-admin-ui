<template>
  <q-layout view="hhh lpR fff">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          Boid Admin Portal
        </q-toolbar-title>
        <div class="q-gutter-md">
          <q-btn
            flat
            dense
            @click="$router.push('/')"
          >
            Home
          </q-btn>
          <q-btn
            flat
            dense
            @click="$router.push('/boid-users')"
          >
            Users
          </q-btn>
          <q-btn
            flat
            dense
            @click="$router.push('/teams')"
          >
            Teams
          </q-btn>
          <q-btn
            flat
            dense
            @click="$router.push('/')"
          >
            DAO
          </q-btn>
          <q-btn
            flat
            dense
            @click="isLoggedIn ? logout() : login()"
          >
            {{ isLoggedIn ? 'Logout' : 'Login' }}
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer
      elevated
      class="bg-grey-8 text-white"
    >
      <q-toolbar>
        <q-toolbar-title />
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from "vue"
import { useSessionStore } from "../stores/sessionStore"

export default defineComponent({
  name: "MainLayout",

  components: {

  },

  setup() {
    const sessionStore = useSessionStore()
    const isLoggedIn = computed(() => sessionStore.isLoggedIn)
    const login = async() => {
      await sessionStore.login()
    }
    const logout = async() => {
      await sessionStore.logout()
    }
    onMounted(async() => {
      await sessionStore.renew()
    })
    return {
      isLoggedIn,
      login,
      logout
    }
  }
})
</script>
