<template>
  <q-page class="flex flex-center">
    <q-card>
      <q-card-section>
        Teams List
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue"
import { useTeamStore } from "../stores/teamsStore"

export default defineComponent({
  name: "TeamsPage",
  setup() {
    const store = useTeamStore()

    onMounted(async() => {
      // Call the function from the store
      await store.fetchAccTableData()
    })

    return {}
  }
})
</script>

<style scoped>
.q-card {
  width: 400px;
  max-width: 90%;
}
</style>
