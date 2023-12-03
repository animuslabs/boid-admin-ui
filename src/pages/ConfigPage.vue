<template>
  <q-page class="container" padding>
    <div>
      <q-tabs v-model="tab" class="text-grey" active-color="primary">
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

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue"
import ConfigGlobal from "src/components/ConfigGlobal.vue"
import ConfigBoosters from "src/components/ConfigBoosters.vue"
import ConfigOffers from "src/components/ConfigOffers.vue"
import { useRoute } from "vue-router"

export default defineComponent({
  name: "ConfigPage",
  components: {
    ConfigGlobal,
    ConfigBoosters,
    ConfigOffers
  },
  setup() {
    const tab = ref("config") // Default selected tab
    const route = useRoute()
    onMounted(() => {
      if (route.query.tab) {
        tab.value = route.query.tab as string
      }
    })
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
