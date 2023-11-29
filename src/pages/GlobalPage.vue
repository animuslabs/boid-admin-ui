<template>
  <q-page class="container" padding>
    <div>
      <q-tabs v-model="tab" class="text-grey" active-color="primary">
        <q-tab name="global" label="Global" />
        <q-tab name="boosters" label="Boosters" />
        <q-tab name="offers" label="Offers" />
      </q-tabs>

      <div>
        <ConfigGlobal v-if="tab === 'global'" />
        <ConfigBoosters v-if="tab === 'boosters'" />
        <ConfigOffers v-if="tab === 'offers'" />
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"
import ConfigGlobal from "src/components/ConfigGlobal.vue"
import ConfigBoosters from "src/components/ConfigBoosters.vue"
import ConfigOffers from "src/components/ConfigOffers.vue"

export default defineComponent({
  name: "GlobalPage",
  components: {
    ConfigGlobal,
    ConfigBoosters,
    ConfigOffers
  },
  setup() {
    const tab = ref("global") // Default selected tab

    return {
      tab
    }
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
</style>
