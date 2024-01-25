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
      <q-btn
        outline
        label="Boosters Docs"
        color="primary"
        icon="help"
        type="a"
        href="https://docs.boid.com/boidcore/telos/actions/boosters.html"
        target="_blank"
      />
      <!-- Add, Remove, Add Boid ID, Remove Boid ID Buttons -->
      <q-btn flat label="NEW" color="green" icon="add" @click="showNewDialog = true" />
      <q-btn flat label="ADD" color="blue" icon="add" @click="showAddDialog = true" />
      <q-btn flat label="REMOVE" color="orange" icon="remove" @click="showRemoveDialog = true" />
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
          :pagination="pagination"
          row-key="booster_id"
          dense
          flat
        />
      </div>
    </q-card-section>
  </q-card>
  <template>
    <!-- Add Action Dialog -->
    <q-dialog v-model="showAddDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">
            Add Booster
          </div>
          <q-input v-model="addInput.boid_id" label="Boid ID" type="text" />
          <q-input v-model="addInput.booster_id" :hint="boostersHints.booster_id" label="Booster ID" type="number" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" @click="showAddDialog = false" />
          <q-btn flat label="Add" color="green" @click="handleAdd" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- New Action Dialog -->
    <q-dialog v-model="showNewDialog">
      <q-card class="newActionDialog">
        <q-card-section>
          <div class="text-h6">
            New Booster
          </div>
          <q-input
            v-model="boosterInput.booster_id"
            type="number"
            label="Booster ID"
            :hint="boostersHints.booster_id"
            class="q-mb-lg"
          />
          <q-input
            v-model="boosterInput.pwr_multiplier"
            type="number"
            label="Power Multiplier"
            :hint="boostersHints.pwr_multiplier"
            class="q-mb-xl"
          />
          <q-input
            v-model="boosterInput.pwr_add_per_round"
            type="number"
            label="Power Add per Round"
            :hint="boostersHints.pwr_add_per_round"
            class="q-mb-xl"
          />
          <q-input
            v-model="boosterInput.expire_after_elapsed_rounds"
            type="number"
            label="Expire After Elapsed Rounds"
            :hint="boostersHints.expire_after_elapsed_rounds"
            class="q-mb-xl"
          />
          <q-input
            v-model="boosterInput.aggregate_pwr_capacity"
            type="number"
            label="Aggregate Power Capacity"
            :hint="boostersHints.aggregate_pwr_capacity"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" @click="showNewDialog = false" />
          <q-btn flat label="New" color="green" @click="handleNew" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Add Action Dialog -->
    <q-dialog v-model="showRemoveDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">
            Remove Booster
          </div>
          <q-input v-model="removeInput.boid_id" label="Boid ID" type="text" />
          <q-input v-model="removeInput.booster_indices_string" :hint="boostersHints.booster_index" label="Booster Index" type="text" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" @click="showRemoveDialog = false" />
          <q-btn flat label="Remove" color="red" @click="handleRemove" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </template>
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive } from "vue"
import { boosterStore } from "src/stores/boosterStore"
import { QTable, QTableColumn } from "quasar"
import { boostersHints } from "lib/hints"
import { Types } from "src/lib/boid-contract-structure"

const store = boosterStore()
interface SimpleBooster {
  booster_id:number;
  pwr_multiplier:number;
  pwr_add_per_round:number;
  expire_after_elapsed_rounds:number;
  aggregate_pwr_capacity:number;
}
const boosters = ref<SimpleBooster[]>([])

const boosterColData:QTableColumn[] = [
  { name: "booster_id", required: true, label: "Booster ID", align: "left", field: "booster_id", sortable: true },
  { name: "pwr_multiplier", required: true, label: "Power Multiplier", align: "left", field: "pwr_multiplier", sortable: true },
  { name: "pwr_add_per_round", required: true, label: "Power Add per Round", align: "left", field: "pwr_add_per_round", sortable: true },
  { name: "expire_after_elapsed_rounds", required: true, label: "Expire After Elapsed Rounds", align: "left", field: "expire_after_elapsed_rounds", sortable: true },
  { name: "aggregate_pwr_capacity", required: true, label: "Aggregate Power Capacity", align: "left", field: "aggregate_pwr_capacity", sortable: true }
]

const boosterInput = reactive({
  booster_id: 0,
  pwr_multiplier: 0,
  pwr_add_per_round: 0,
  expire_after_elapsed_rounds: 0,
  aggregate_pwr_capacity: 0
})

const addInput = reactive({
  boid_id: "",
  booster_id: 0
})

const removeInput = reactive({
  boid_id: "",
  booster_indices_string: ""
})

const pagination = ref({
  sortBy: "id",
  descending: false, // Set to true if you want descending order by default
  page: 1,
  rowsPerPage: 10
})

// Dialog visibility states
const showAddDialog = ref(false)
const showRemoveDialog = ref(false)
const showNewDialog = ref(false)
const updateBoostersList = async() => {
  const fetchedBoosters = await store.fetchBoostersTableData()
  if (fetchedBoosters && fetchedBoosters.length > 0) {
    boosters.value = fetchedBoosters.map(booster => ({
      booster_id: booster.booster_id.toNumber(),
      pwr_multiplier: booster.pwr_multiplier.toNumber(),
      pwr_add_per_round: booster.pwr_add_per_round.toNumber(),
      expire_after_elapsed_rounds: booster.expire_after_elapsed_rounds.toNumber(),
      aggregate_pwr_capacity: booster.aggregate_pwr_capacity.toNumber()
    }))
  }
}

const handleAdd = async() => {
  try {
    await store.addBoosterAction(addInput.boid_id, addInput.booster_id)
    await updateBoostersList()
    showAddDialog.value = false
  } catch (error) {
    console.error("Error adding booster:", error)
  }
}
const handleNew = async() => {
  try {
    const booster = Types.Booster.from(boosterInput)
    await store.newBoosterAction(booster)
    await updateBoostersList()
    showNewDialog.value = false
  } catch (error) {
    console.error("Error creating new booster:", error)
  }
}
const handleRemove = async() => {
  try {
    const indices = removeInput.booster_indices_string.split(",").map(Number)
    await store.removeBoosterAction(removeInput.boid_id, indices)
    await updateBoostersList()
    showRemoveDialog.value = false
  } catch (error) {
    console.error("Error removing booster:", error)
  }
}

onMounted(async() => {
  await updateBoostersList()
})

</script>
<style>
.my-card {
  min-width: 400px;
  max-width: 800px;
}

.newActionDialog {
  min-width: 400px ;
  max-height: 800px;
  overflow-y: auto; /* Enables scrolling for overflowing content */
  overflow-wrap: break-word; /* Break lines within words if necessary */
}

</style>
<style lang="sass">
.q-input
  padding-bottom:40px
  background: $grey-1
</style>
