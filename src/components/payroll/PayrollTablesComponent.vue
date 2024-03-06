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
            <div class="q-mb-sm">
              <q-btn @click="executeActions" label="EXECUTE ACTIONS" color="primary" class="q-mr-sm" />
              <q-btn @click="clearActions" label="CLEAR ALL" color="primary" />
            </div>
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
            <div class="row q-mb-sm">
              <q-btn @click="addPayrollAction" label="Add Payroll" color="primary" class="q-mr-sm" />
              <q-btn @click="toggleWhitelistDialog" label="Whitelist" color="primary" />
              <q-input
                dense
                filled
                v-model="searchQuery"
                placeholder="Search payrolls..."
                class="q-ml-md"
              >
                <template #append>
                  <q-icon
                    name="close"
                    class="cursor-pointer"
                    @click="searchQuery = ''"
                  />
                </template>
              </q-input>
              <div class="q-ml-md text-subtitle2">
                {{ totalsBySymbol }}
              </div>
            </div>
            <q-table
              flat bordered
              :rows="filteredPayrolls"
              :columns="payrollsColumns"
              row-key="id"
            >
              <template #body="props">
                <q-tr :props="props">
                  <q-td v-for="col in props.cols" :key="col.name" :props="props">
                    <template v-if="col.name === 'actions'">
                      <q-btn size="sm" flat icon="delete" color="negative" @click.stop="deleteSelectedPayroll(props.row.id)" />
                      <q-btn size="sm" flat icon="savings" color="green" @click.stop="claimSelectedPayroll(props.row.id)" />
                      <q-btn size="xs" color="accent" round dense @click.stop="toggleExpansion(props.row)" :icon="expandedRows.includes(props.row.id) ? 'remove' : 'add'" />
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
      </div>
    </q-page>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watchEffect, computed } from "vue"
import { usePayrollStore } from "src/stores/payrollStore"
import PayrollConfigForm from "src/components/payroll/PayrollConfigForm.vue"
import { ActionDescriptor } from "src/lib/contracts"
import { ActionParams } from "src/lib/payroll.boid"
import { PayrollMeta, PayrollDataItem, TokensWhitelistItem, PayrollItem, AggregatedTotals } from "src/types/types"
import { Asset, Bytes, Name, TimePointSec } from "@wharfkit/session"
import { Dialog, QBtn, QTableProps } from "quasar"

const payrollStore = usePayrollStore()
const loading = ref(true)
const searchQuery = ref("")

const payrolls = ref<PayrollDataItem[]>([])
const tokensWhitelist = ref<TokensWhitelistItem[]>([])
const showWhitelistDialog = ref(false)
const expandedRows = ref<number[]>([])
const toggleWhitelistDialog = () => {
  showWhitelistDialog.value = !showWhitelistDialog.value
}
function toggleExpansion(row:PayrollDataItem) {
  const index = expandedRows.value.indexOf(row.id)
  if (index > -1) {
    expandedRows.value.splice(index, 1) // Collapse row if it's already expanded
  } else {
    expandedRows.value.push(row.id) // Expand row
  }
}

const deleteSelectedPayroll = (payrollId:number | null = null) => {
  payrollStore.removePayrollAction((payrollId))
  console.log(`Deleting payroll with ID: ${payrollId}`)
}
const claimSelectedPayroll = (payrollId:number | null = null) => {
  payrollStore.payPayrollAction((payrollId))
  console.log(`Claiming payroll with ID: ${payrollId}`)
}
const filteredPayrolls = computed(() => {
  if (!searchQuery.value) {
    return payrolls.value
  }
  return payrolls.value.filter(payroll => {
    // Adjust the criteria based on which fields you want to search in
    return payroll.meta.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
           payroll.receiverAccount.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
           payroll.treasuryAccount.toLowerCase().includes(searchQuery.value.toLowerCase())
  })
})
// Helper function to aggregate amounts by symbol
function aggregateAmountsBySymbol(payrolls:PayrollItem[]):AggregatedTotals {
  const totals:AggregatedTotals = {}
  payrolls.forEach(payroll => {
    const totalParts = payroll.total ? payroll.total.split(" ") : ["0", "Unknown"]
    const paidParts = payroll.paid ? payroll.paid.split(" ") : ["0", "Unknown"]

    const totalAmount = parseFloat(totalParts[0] as string)
    const paidAmount = parseFloat(paidParts[0] as string)
    // Ensuring symbol is treated as a string; use a fallback symbol if undefined
    const symbol = totalParts[1] || "Unknown"

    if (!totals[symbol]) {
      totals[symbol] = { total: 0, paid: 0 }
    }

    totals[symbol]!.total += totalAmount
    totals[symbol]!.paid += paidAmount
  })

  return totals
}


// Computed property for aggregated total and paid amounts by symbol
const totalsBySymbol = computed(() => {
  const aggregatedTotals = aggregateAmountsBySymbol(payrolls.value) // Make sure payrolls.value is of type PayrollItem[]
  // Format the aggregated totals for display
  return Object.entries(aggregatedTotals).map(([symbol, amounts]) => {
    return `Total: ${amounts.total.toFixed(4)} ${symbol}, Paid ${amounts.paid.toFixed(4)}`
  }).join(" || ")
})



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

async function executeActions() {
  await payrollStore.executeAllActions()
  console.log("Creating Transaction...")
}
async function clearActions() {
  payrollStore.clearAllDescriptors()
}
async function fetchAndShowDescriptors() {
  // Assume getDescriptors is a method that returns an array of action descriptors
  const descriptors = payrollStore.getDescriptors
  console.log("descriptors: ", descriptors)

  // Use Promise.all to wait for all descriptors to be processed
  const processedDescriptors = await Promise.all(descriptors.map(async(descriptor, index) => {
    if (descriptor.actionName === "payroll.add") {
      // Formatting action_data for payroll.add action
      const data = (descriptor.action_data as { payrollConfig:ActionParams.Type.PayrollConfig }).payrollConfig
      console.log("data total: ", data.total)
      try {
        const meta = await PayrollMeta.fromBytes(data.meta as Bytes)
        const title = meta.title // Now you have access to meta.title
        console.log("Meta title: ", title)

        // Use the title in your code
        return {
          ...descriptor,
          id: index,
          actionDescriptor: `
          Name: ${title} |
          From: ${formatTimePointSec(data.startTime)} |
          To: ${formatTimePointSec(data.finishTime)} |
          Receiver: ${formatName(data.receiverAccount as Name)} || Total: ${formatAsset(data.total as Asset)}`
        }
      } catch (error) {
        console.error("Error fetching meta title", error)
        // Handle any errors that might occur during the fetching of meta.title
        return descriptor // Return the original descriptor in case of an error
      }
    }
    if (descriptor.actionName === "payroll.rm") {
      // Formatting action_data for payroll.remove action
      const data = (descriptor.action_data as { payrollId:number }).payrollId
      return {
        ...descriptor,
        id: index,
        actionDescriptor: `Payroll ID: ${data}`
      }
    }
    if (descriptor.actionName === "payroll.edit") {
      // Formatting action_data for payroll.edit action ||| this is not implemented yet properly!!!
      const data = (descriptor.action_data as { payrollId:number }).payrollId
      return {
        ...descriptor,
        id: index,
        actionDescriptor: `Payroll ID: ${data}`
      }
    }
    if (descriptor.actionName === "payroll.pay") {
      // Formatting action_data for payroll.pay action
      const data = (descriptor.action_data as { payrollId:number }).payrollId
      return {
        ...descriptor,
        id: index,
        actionDescriptor: `Payroll ID: ${data}`
      }
    }
    // not implemented yet
    if (descriptor.actionName === "tokenwl.add") {
      const data = (descriptor.action_data as ActionParams.tokenwladd)
      const sym = data.sym.toString()
      const code = data.contract as Name
      return {
        ...descriptor,
        id: index,
        actionDescriptor: `Symbol: ${sym} | Contract: ${formatName(code)}`
      }
    }
    if (descriptor.actionName === "tokenwl.rm") {
      const data = (descriptor.action_data as ActionParams.tokenwlrm)
      const sym = data.sym.toString()
      return {
        ...descriptor,
        id: index,
        actionDescriptor: `Symbol: ${sym}`
      }
    }
    console.log("actionDescriptor: ", descriptor)
    return descriptor // Return unmodified for other action types
  }))

  actionDescriptors.value = processedDescriptors
}

onMounted(async() => {
  await fetchAndShowDescriptors() // Initial fetch
  loading.value = false
})

// Automatically fetch and show descriptors when the store's descriptors change
watchEffect(async() => {
  await fetchAndShowDescriptors()
})


// Function to handle deleting an action descriptor
const deleteAction = async(descriptorIndex:number) => {
  if (confirm("Are you sure you want to delete this action?")) {
    payrollStore.removeDescriptor(descriptorIndex)
    console.log("Deleted action:", descriptorIndex)
    await fetchAndShowDescriptors() // Refresh the list
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

const fetchPayrollData = async() => {
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
}

let fetchInterval:number | undefined

onMounted(async() => {
  await fetchPayrollData() // Initial fetch
  fetchInterval = setInterval(fetchPayrollData, 30000) as unknown as number // Fetch every 30 seconds
})

onUnmounted(() => {
  clearInterval(fetchInterval) // Clear interval on component unmount
})

</script>


<style scoped>
.whitelist {
  height: 100%;
  width: 100%;
  max-width: fit-content;
}
</style>
