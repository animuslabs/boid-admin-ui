<template>
  <q-page class="flex flex-center">
    <q-card>
      <q-card-section class="text-center">
        <div
          v-if="username"
          class="text-h5 q-mb-md"
        >
          Captain {{ username }}, welcome back to the command deck! 🚀
          <p class="q-mb-md">
            Ready to save the day again? The BoidVerse awaits your mighty powers!
          </p>
        </div>
        <div
          v-else
          class="text-h5 q-mb-md"
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
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue"
import { useSessionStore } from "../stores/sessionStore"

export default defineComponent({
  name: "StartPage",
  setup() {
    const store = useSessionStore()
    const username = computed(() => store.username)
    console.log("username", username)
    return { username }
  }
})
</script>

<style scoped>
.q-card {
  width: 600px;
  max-width: 90%;
}
</style>
