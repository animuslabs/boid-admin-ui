<template>
  <div class="row q-pa-sm">
    <div class="column items-center">
      <div class="col avatar-badge-container">
        <q-badge
          v-if="whatChain"
          color="primary"
          :label="whatChain"
        />
      </div>
      <div class="col">
        <q-avatar>
          <img v-if="chainLogo" style="height: 50px; width: 50px" :src="chainLogo.toString()" class="avatar-image">
          <img v-else src="/logo-boid-dots.png" class="avatar-image">
        </q-avatar>
      </div>

      <div class="col text-subtitle1 q-mt-lg q-mb-xs q-mr-xs">
        {{ loggedAccount }}
      </div>

      <!-- Updated q-btn for login/logout -->
      <q-btn
        :color="isLoggedIn ? 'negative' : 'primary'"
        :label="isLoggedIn ? 'Logout' : 'Login'"
        push
        size="sm"
        v-close-popup
        @click="isLoggedIn ? logout() : login()"
      />
      <!-- Removed the previous q-item for login/logout -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue"
import { useSessionStore } from "src/stores/sessionStore"

const sessionStore = useSessionStore()

const isLoggedIn = ref(sessionStore.isLoggedIn)
const chainLogo = ref(sessionStore.chainLogo || "")
const whatChain = ref(sessionStore.whatChain)
const loggedAccount = ref(sessionStore.session?.actor)

watch(() => sessionStore.isLoggedIn, (newVal) => {
  isLoggedIn.value = newVal
})

watch(() => sessionStore.chainLogo, (newVal) => {
  chainLogo.value = newVal
})

watch(() => sessionStore.whatChain, (newVal) => {
  whatChain.value = newVal
})

watch(() => sessionStore.session?.actor, (newVal) => {
  loggedAccount.value = newVal
})

const login = async() => {
  await sessionStore.login()
}

const logout = async() => {
  await sessionStore.logout()
}

</script>

<style scoped>
  .avatar-badge-container {
  display: relative;
  align-items: center; /* Vertically center */
  justify-content: center; /* Horizontally center */
  position: center;
}

.avatar-image {
  height: 100%;
  width: 50px;
}
</style>
