<template>
  <q-page class="flex flex-center">
    <q-card>
      <q-card-section>
        <div
          class="text-h6"
          style="text-align: center;"
        >
          <!-- Show different text based on login status -->
          <div v-if="isLoggedIn">
            Oh you are still here?
          </div>
          <div v-else>
            Please Login
          </div>
        </div>
        <q-form
          class="q-gutter-md"
          @submit.prevent="onSubmit"
        >
          <div class="row justify-center q-mt-md">
            <!-- Show logout button if logged in, else show login -->
            <q-btn
              v-if="isLoggedIn"
              label="Logout"
              @click="logout"
              color="negative"
            />
            <q-btn
              v-else
              label="Login"
              type="submit"
              color="primary"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue"
import { useSessionStore } from "../stores/sessionStore"

export default defineComponent({
  name: "StartPage",
  setup() {
    const sessionStore = useSessionStore()

    // Use a computed property to ensure reactivity
    const isLoggedIn = computed(() => sessionStore.isLoggedIn)

    const onSubmit = async() => {
      if (!isLoggedIn.value) {
        try {
          await sessionStore.login()
        } catch (error) {
          console.error("Login error:", error)
        }
      }
    }

    const logout = async() => {
      try {
        await sessionStore.logout()
      } catch (error) {
        console.error("Logout error:", error)
      }
    }

    return {
      isLoggedIn,
      onSubmit,
      logout
    }
  }
})
</script>

<style scoped>
.q-card {
  width: 400px;
  max-width: 90%;
}
</style>
