<template>
  <q-page class="flex flex-center">
    <q-card>
      <q-card-section class="text-center">
        <div
          v-if="username"
          class="text-weight-bold q-mb-md"
        >
          Captain {{ username }}, welcome back to the command deck! 🚀
          <p class="q-mb-md">
            Ready to save the day again? The BoidVerse awaits your mighty powers!
          </p>
        </div>
        <div
          v-else
          class="text-weight-bold q-mb-md"
        >
          Oh, It's you...
          <p class="q-mb-md">
            I guess you should probably login or something. 🤔
          </p>
          Some options may or may not be available to you. 🤷‍♂️
          <p class="q-ma-md">
            Remember, with great power comes great responsibility. Use your powers wisely! 🦸‍♂️
          </p>
        </div>
      </q-card-section>
      <q-card-section class="text-center">
        <q-btn color="primary" @click="goToEditSettings">
          Choose your Chain
        </q-btn>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts" setup>
import { computed } from "vue"
import { useSessionStore } from "src/stores/sessionStore"
import { useRouter } from "vue-router"

const store = useSessionStore()
const username = computed(() => store.username)
console.log("username", username)
const router = useRouter()
const goToEditSettings = async() => {
  try {
    await router.push("settings")
  } catch (err) {
    // Handle the navigation error
    console.error("Navigation failed:", err)
  }
}

</script>

<style scoped lang="scss">
.q-card {
  min-width: 600px;
  max-width: 90%;
  max-height: fit-content;
}
.selected-row {
  background-color: $secondary;
}
</style>
