<template>
  <q-page class="flex flex-center">
    <q-card flat bordered class="bg-primary text-white q-pa-md rounded-lg shadow-lg">
      <q-card-section>
        <div v-if="username" class="text-center q-pb-md">
          <h3 class="text-h5 text-weight-bold q-mb-md">
            Captain {{ username }}, welcome back to the command deck! 🚀
          </h3>
          <p class="text-subtitle2 q-mb-md">
            Ready to save the day again? The BoidVerse awaits your mighty powers!
          </p>
        </div>
        <div v-else class="text-center q-pb-md">
          <h3 class="text-h5 text-weight-bold q-mb-md">
            Oh, it's you...
          </h3>
          <p class="text-subtitle2 q-mb-sm">
            I guess you should probably login or something. 🤔
          </p>
          <p class="text-body2 q-mb-md">
            Some options may or may not be available to you. 🤷‍♂️
          </p>
          <p class="text-caption q-mt-sm">
            Remember, with great power comes great responsibility. Use your powers wisely! 🦸‍♂️
          </p>
        </div>
      </q-card-section>

      <q-separator dark />

      <q-card-section class="text-center q-pt-md">
        <h4 class="text-h6 text-weight-bold">Features You Can Explore:</h4>
        <q-list class="q-my-md">
          <q-item v-for="(item, index) in features" :key="index" class="q-py-xs">
            <q-item-section>
              <span class="text-body2">• {{ item }}</span>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts" setup>
import { computed } from "vue"
import { useSessionStore } from "src/stores/sessionStore"

const store = useSessionStore()
const username = computed(() => store.username)
console.log("username", username)
const features = [
  "All users' boid_id's and their graphical charts",
  "Teams list, create new or edit existing",
  "See whole BoidCore global settings and edit them",
  "Create and edit boosters",
  "Create and edit offers",
  "Payroll list, create new or edit existing",
  "Tools like keys generator, staking wallet, gaming rewards management, round calculator, etc.",
];
</script>

<style scoped lang="scss">
.q-card {
  min-width: 600px;
  max-width: 90%;
  max-height: fit-content;
  background: linear-gradient(135deg, #1e3a8a, #2563eb); /* Gradient background */
  border-radius: 1rem;
  color: white;
}
.q-separator {
  margin: 1rem 0;
}

.q-item-section {
  font-size: 1rem;
}
.selected-row {
  background-color: $secondary;
}
</style>
