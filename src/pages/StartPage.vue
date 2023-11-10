<template>
  <q-page class="flex flex-center">
    <q-card>
      <q-card-section>
        Oh, It's you again...
        <p /> I guess you should probably login or something.
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
  name: "StartPage",
  setup() {
    return {

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
