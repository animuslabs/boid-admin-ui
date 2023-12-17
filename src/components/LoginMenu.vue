<template>
  <div class="q-pa-md">
    <div class="row no-wrap q-pa-md">
      <div class="column">
        <div class="text-h6 q-mb-md">
          M-Sign Settings
        </div>
        <q-toggle
          v-model="toggleState"
          color="green"
          label="M-Sign Mode"
          @input="toggleState"
        />
        <q-btn label="Signees" @click="goToEditSigners" />
      </div>

      <q-separator vertical inset class="q-mx-lg" />

      <div class="column items-center">
        <div class="q-mr-sm avatar-badge-container">
          <q-avatar size="72x">
            <img v-if="chainLogo" :src="chainLogo.toString()">
          </q-avatar>

          <!-- Badge with whatChain value -->
          <q-badge
            v-if="whatChain"
            color="primary"
            align="bottom"
            :label="whatChain"
            class="badge-on-avatar"
          />
        </div>

        <div class="text-subtitle1 q-mt-md q-mb-xs q-mr-xs">
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
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue"
import { useSessionStore } from "src/stores/sessionStore"
import { useRouter } from "vue-router"
export default defineComponent({
  name: "LoginMenu",
  setup() {
    const sessionStore = useSessionStore()
    const isLoggedIn = computed(() => sessionStore.isLoggedIn)
    const chainLogo = computed(() => sessionStore.chainLogo || "")
    const whatChain = computed(() => sessionStore.whatChain)
    const loggedAccount = computed(() => sessionStore.session?.actor)
    const toggleState = computed({
      get: () => sessionStore.multiSignToggleState,
      set: (value) => sessionStore.setToggleState(value)
    })
    const login = async() => {
      await sessionStore.login()
    }
    const logout = async() => {
      await sessionStore.logout()
    }
    const router = useRouter()
    const goToEditSigners = async() => {
      try {
        await router.push("config/edit-signers")
      } catch (err) {
        // Handle the navigation error
        console.error("Navigation failed:", err)
      }
    }

    return {
      isLoggedIn,
      login,
      logout,
      chainLogo,
      toggleState,
      loggedAccount,
      whatChain,
      goToEditSigners
    }
  }
})
</script>

<style scoped>
  .login-menu {
    display: flex;
    align-items: center;
    /* Add your styles here */
  }
  .avatar-badge-container {
  position: relative;
  display: inline-block;
}

.badge-on-avatar {
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(50%, -50%);
  /* Adjust these values as necessary */
}
</style>
