<template>
  <q-layout view="hhh lpR fff">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          Boid Admin
        </q-toolbar-title>
        <div class="q-gutter-md">
          <q-btn
            flat
            dense
            round
            @click="$router.push('/boid-users')"
          >
            Users
          </q-btn>
          <q-btn
            flat
            dense
            round
            @click="$router.push('/teams')"
          >
            Teams
          </q-btn>
          <q-btn
            flat
            dense
            round
            @click="$router.push('/')"
          >
            Home
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
import { defineComponent, ref } from "vue"

export default defineComponent({
  name: "MainLayout",

  components: {

  },

  setup() {
    const leftDrawerOpen = ref(false)

    return {

    }
  }
})
</script>
