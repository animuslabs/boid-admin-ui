<template>
  <q-page class="container" padding>
    <div>
      <q-tabs v-model="tab" class="text-weight-bold text-white" active-color="primary">
        <q-tab name="config" label="Config" />
        <q-tab name="boosters" label="Boosters" />
        <q-tab name="offers" label="Offers" />
      </q-tabs>

      <div>
        <ConfigGlobal v-if="tab === 'config'" />
        <ConfigBoosters v-if="tab === 'boosters'" />
        <ConfigOffers v-if="tab === 'offers'" />
      </div>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import ConfigGlobal from "src/components/ConfigGlobal.vue"
import ConfigBoosters from "src/components/ConfigBoosters.vue"
import ConfigOffers from "src/components/ConfigOffers.vue"
import { useRoute } from "vue-router"


const tab = ref("config") // Default tab
const route = useRoute()
onMounted(() => {
  if (route.query.tab) {
    tab.value = route.query.tab as string
  }
})

</script>
<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
}
/* Ensures inactive tabs are white */
.q-tabs__content {
  color: white;
}

/* Ensures active tab is bold and white */
.q-tab--active .q-tab__label {
  font-weight: bold;
  /* color: white; */
}
</style>
