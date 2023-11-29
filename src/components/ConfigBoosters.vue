<style lang="sass">
.q-expansion-item
  padding: 8px
  margin:4px
  width:300px
  background: $grey-1
.q-input
  padding-bottom:10px
</style>

<template>
  <q-card class="my-card">
    <q-card-section>
      <!-- <q-btn
        flat
        label="SAVE"
        color="secondary"
        @click="handleSave"
      /> -->
      <q-btn
        outline
        label="Boosters Docs"
        color="primary"
        icon="help"
        type="a"
        href="https://new.docs.boid.com/boidcore/telos/tables/pwrmods.html"
        target="_blank"
      />
      <div class="fit row wrap justify-center">
        <!-- NFT Settings Section -->
        <q-card-section
          label="Boosters"
          icon="rocket"
        />
        <q-table
          v-if="boosters.length > 0"
          title="Boosters"
          :rows="boosters"
          :columns="boosterColData"
          row-key="mod_id"
          dense
          flat
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from "vue"
import { Types } from "lib/boid-contract-structure"
import { toObject } from "src/lib/util"
import { boosterStore } from "src/stores/boosterStore"
import { QTable, QTableColumn } from "quasar"

const store = boosterStore()
interface SimpleBooster {
  mod_id:number;
  pwr_multiplier:number;
  pwr_add_per_round:number;
  expire_after_elapsed_rounds:number;
  aggregate_pwr_capacity:number;
}

const boosters = ref<SimpleBooster[]>([])

const boosterColData:QTableColumn[] = [
  { name: "mod_id", required: true, label: "Mod ID", align: "left", field: "mod_id", sortable: true },
  { name: "pwr_multiplier", required: true, label: "Power Multiplier", align: "left", field: "pwr_multiplier", sortable: true },
  { name: "pwr_add_per_round", required: true, label: "Power Add per Round", align: "left", field: "pwr_add_per_round", sortable: true },
  { name: "expire_after_elapsed_rounds", required: true, label: "Expire After Elapsed Rounds", align: "left", field: "expire_after_elapsed_rounds", sortable: true },
  { name: "aggregate_pwr_capacity", required: true, label: "Aggregate Power Capacity", align: "left", field: "aggregate_pwr_capacity", sortable: true }
]



onMounted(async() => {
  const fetchedBoosters = await store.fetchBoostersTableData()
  if (fetchedBoosters && fetchedBoosters.length > 0) {
    boosters.value = fetchedBoosters.map(booster => ({
      mod_id: booster.mod_id.toNumber(),
      pwr_multiplier: booster.pwr_multiplier.toNumber(),
      pwr_add_per_round: booster.pwr_add_per_round.toNumber(),
      expire_after_elapsed_rounds: booster.expire_after_elapsed_rounds.toNumber(),
      aggregate_pwr_capacity: booster.aggregate_pwr_capacity.toNumber()
    }))
  }
})



</script>
<style>
.my-card {
  min-width: 400px;
  max-width: 800px;
}
</style>
