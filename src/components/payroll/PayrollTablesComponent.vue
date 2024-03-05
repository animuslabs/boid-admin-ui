<template>
  <div>
    <q-page class="q-pa-md">
      <div v-if="loading">
        Loading data...
      </div>
      <div v-else>
        <q-card class="q-mb-md">
          <q-card-section>
            <div class="text-h6">
              Action Bucket
            </div>
            <q-btn @click="fetchAndShowDescriptors" label="VIEW" color="primary" />
            <q-btn @click="createMsign" label="CREATE M-SIGN" color="primary" />
            <!-- New table for displaying action descriptors -->
            <q-table
              flat bordered
              :rows="actionDescriptors"
              :columns="actionDescriptorsColumns"
              row-key="id"
            >
              <template #body-cell-actions="props">
                <q-td :props="props">
                  <q-btn flat icon="edit" @click="editPayrollAction(props.row.id)" />
                  <q-btn flat color="negative" icon="delete" @click="deleteAction(props.row.id)" />
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
        <q-card class="q-mb-md">
          <q-card-section>
            <div class="text-h6">
              Payrolls
            </div>
            <q-btn @click="addPayrollAction" label="Add Payroll" color="primary" />
            <q-btn @click="toggleWhitelistDialog" label="Whitelist" color="primary" />
            <q-table
              flat bordered
              :rows="payrolls"
              :columns="payrollsColumns"
              row-key="id"
            >
              <template #body="props">
                <q-tr :props="props">
                  <q-td v-for="col in props.cols" :key="col.name" :props="props">
                    <template v-if="col.name === 'actions'">
                      <q-btn flat icon="delete" color="negative" @click.stop="togglePayrollActionDialog(props.row.id)" />
                      <q-btn flat icon="savings" color="green" @click.stop="togglePayrollActionDialog(props.row.id)" />
                      <q-btn size="sm" color="accent" round dense @click.stop="toggleExpansion(props.row)" :icon="expandedRows.includes(props.row.id) ? 'remove' : 'add'" />
                    </template>
                    <template v-else>
                      {{ col.value }}
                    </template>
                  </q-td>
                </q-tr>
                <q-tr v-show="expandedRows.includes(props.row.id)" :props="props">
                  <q-td colspan="100%">
                    <div><strong>Text:</strong> {{ props.row.meta.text }}</div>
                    <div><strong>Treasury Account:</strong> {{ props.row.treasuryAccount }}</div>
                    <div><strong>Min Claim Freq(Sec)</strong> {{ props.row.minClaimFrequencySec }}</div>
                    <div><strong>WebsiteLink:</strong> {{ props.row.meta.websiteLink }}</div>
                    <div><strong>SocialMediaLinks:</strong> {{ props.row.meta.socialMediaLinks }}</div>
                    <div><strong>MediaImages:</strong> {{ props.row.meta.mediaImages }}</div>
                    <div><strong>DocIPFSCIDs:</strong> {{ props.row.meta.docIPFSCIDs }}</div>
                    <div><strong>Paused:</strong> {{ props.row.paused }}</div>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
        <q-card class="whitelist">
          <q-dialog v-model="showWhitelistDialog">
            <q-card>
              <q-card-section class="row items-center justify-between">
                <div class="text-h6">
                  Tokens Whitelist
                </div>
                <q-btn icon="close" flat @click="toggleWhitelistDialog" />
              </q-card-section>
              <q-card-section>
                <q-table :rows="tokensWhitelist" :columns="tokensWhitelistColumns" row-key="sym" />
              </q-card-section>
            </q-card>
          </q-dialog>
        </q-card>
        <q-dialog v-model="showPayrollActionDialog">
          <q-card>
            <q-card-section class="row justify-center q-pa-md">
              Are you sure you want to delete this payroll?
            </q-card-section>
            <q-card-actions align="around">
              <q-btn flat label="Cancel" color="primary" @click="() => togglePayrollActionDialog()" />
              <q-btn flat label="Delete Payroll" color="negative" @click="deleteSelectedPayroll" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </q-page>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue"
import { usePayrollStore } from "src/stores/payrollStore"
import PayrollConfigForm from "src/components/payroll/PayrollConfigForm.vue"
import { ActionDescriptor } from "src/lib/contracts"
import { ActionParams } from "src/lib/payroll.boid"
import { PayrollMeta, PayrollDataItem, TokensWhitelistItem } from "src/types/types"
import { Asset, Name, UInt64Type, UInt64, TimePointSec } from "@wharfkit/session"
import { Dialog, QBtn, QTableProps } from "quasar"

const payrollStore = usePayrollStore()
const loading = computed(() => payrollStore.isLoading)

const payrolls = ref<PayrollDataItem[]>([])
const tokensWhitelist = ref<TokensWhitelistItem[]>([])
const showWhitelistDialog = ref(false)
const expandedRows = ref([])
const toggleWhitelistDialog = () => {
  showWhitelistDialog.value = !showWhitelistDialog.value
}
function toggleExpansion(row) {
  const index = expandedRows.value.indexOf(row.id)
  if (index > -1) {
    expandedRows.value.splice(index, 1) // Collapse row if it's already expanded
  } else {
    expandedRows.value.push(row.id) // Expand row
  }
}

// payroll action dialog
const showPayrollActionDialog = ref(false)
let selectedPayrollId = ref<number | null>(null)
const togglePayrollActionDialog = (payrollId:number | null = null) => {
  selectedPayrollId.value = payrollId
  showPayrollActionDialog.value = !showPayrollActionDialog.value
}

const deleteSelectedPayroll = () => {
  if (selectedPayrollId.value !== null) {
    payrollStore.removePayrollAction((selectedPayrollId.value))
    console.log(`Deleting payroll with ID: ${selectedPayrollId.value}`)
    // After deletion logic, close the dialog
    togglePayrollActionDialog()
  }
}


// Formatter functions
const formatAsset = (asset:Asset) => `${Asset.from(asset)}`
const formatName = (name:Name) => name.toString()
const formatTimePointSec = (timePointSec:TimePointSec) => {
  // Ensure timePointSec is an instance of TimePointSec and call toMilliseconds() on it
  const milliseconds = timePointSec.toMilliseconds()
  return new Date(milliseconds).toLocaleString()
}

const payrollsColumns = [
  { name: "id", required: true, label: "ID", align: "left", field: "id", sortable: true },
  { name: "meta.title", required: true, label: "Title", align: "left", field: row => row.meta?.title, sortable: true },
  { name: "total", label: "Total", field: "total", sortable: true },
  { name: "paid", label: "Paid", field: "paid", sortable: true },
  { name: "startTime", label: "Start", field: "startTime", sortable: true },
  { name: "finishTime", label: "Finish", field: "finishTime", sortable: true },
  { name: "receiverAccount", label: "Receiver", field: "receiverAccount", sortable: true },
  { name: "actions", label: "Actions", align: "center", sortable: false, field: "id" }
]as QTableProps["columns"]
const tokensWhitelistColumns = [
  { name: "sym", required: true, label: "Symbol", align: "left", field: (row:any) => row.sym, sortable: true },
  { name: "contract", label: "Contract", field: (row:any) => row.contract, sortable: true }
]as QTableProps["columns"]

const actionDescriptors = ref<ActionDescriptor[]>([])

const actionDescriptorsColumns = [
  { name: "id", required: true, label: "ID", align: "left", field: "id", sortable: true },
  { name: "actionName", required: true, label: "Action Name", align: "left", field: "actionName", sortable: true },
  { name: "actionDescriptor", label: "Details", field: "actionDescriptor", sortable: true },
  { name: "actions", label: "Actions", align: "center", sortable: false }
]as QTableProps["columns"]

async function createMsign() {
  await payrollStore.executeAllActions()
  console.log("Creating M-Sign")
}

function fetchAndShowDescriptors() {
  // Assume getDescriptors is a method that returns an array of action descriptors
  const descriptors = payrollStore.getDescriptors
  actionDescriptors.value = descriptors.map((descriptor, index) => {
    if (descriptor.actionName === "payroll.add") {
      // Formatting action_data for payroll.add action
      const data = (descriptor.action_data as { payrollConfig:ActionParams.Type.PayrollConfig }).payrollConfig
      console.log("data total: ", data.total)
      return {
        ...descriptor,
        id: index,
        actionDescriptor: `
        Start: ${formatTimePointSec(data.startTime)} |
        Finish: ${formatTimePointSec(data.finishTime)} |
        Receiver: ${formatName(data.receiverAccount as Name)} | Treasury: ${formatName(data.treasuryAccount as Name)} || Total: ${formatAsset(data.total as Asset)}`
      }
    }
    return descriptor // Return unmodified for other action types
  })
}

// Function to handle deleting an action descriptor
const deleteAction = (descriptorIndex:number) => {
  if (confirm("Are you sure you want to delete this action?")) {
    payrollStore.removeDescriptor(descriptorIndex)
    console.log("Deleted action:", descriptorIndex)
    fetchAndShowDescriptors() // Refresh the list
  }
}

const addPayrollAction = () => {
  Dialog.create({
    component: PayrollConfigForm,
    componentProps: {
      formMode: "add"
    }
  })
}


const editPayrollAction = (descriptorIndex:number) => {
  console.log("Editing action:", descriptorIndex)
  const editDescriptor = payrollStore.getDescriptors[descriptorIndex]

  if (editDescriptor === undefined) {
    console.error("Descriptor not found at index", descriptorIndex)
    // Handle the undefined case here, e.g., show an error message to the user
    return
  } else {
    Dialog.create({
      component: PayrollConfigForm,
      componentProps: {
        editDescriptor,
        formMode: "edit",
        actionIndex: descriptorIndex
      }
    })
    console.log("Descriptor to edit:", editDescriptor)
  }
}

onMounted(async() => {
  const payrollsData = await payrollStore.fetchPayrollsTableData()
  if (payrollsData) {
    // Directly assign the mapped array to payrolls.value
    payrolls.value = await Promise.all(payrollsData.map(async payroll => ({
      id: Number(payroll.id),
      total: formatAsset(payroll.total),
      paid: formatAsset(payroll.paid),
      startTime: formatTimePointSec(payroll.startTime),
      finishTime: formatTimePointSec(payroll.finishTime),
      lastPayout: formatTimePointSec(payroll.lastPayout),
      minClaimFrequencySec: payroll.minClaimFrequencySec.toString(),
      receiverAccount: formatName(payroll.receiverAccount),
      treasuryAccount: formatName(payroll.treasuryAccount),
      paused: payroll.paused,
      meta: await PayrollMeta.fromBytes(payroll.meta)
    })))
  }

  const tokensData = await payrollStore.fetchtokenwlTableData()
  if (tokensData) {
    tokensWhitelist.value = tokensData.map(token => ({
      ...token,
      sym: token.sym.code.toString(),
      contract: formatName(token.contract)
    }))
    console.log("tokensData: ", tokensWhitelist.value)
  }
})

</script>


<style scoped>
.whitelist {
  height: 100%;
  width: 100%;
  max-width: fit-content;
}
</style>
