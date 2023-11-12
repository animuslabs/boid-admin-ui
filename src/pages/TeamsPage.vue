<template>
  <q-page class="flex flex-center">
    <q-card>
      <q-card-section>
        <q-btn
          label="Add Team"
          color="primary"
          @click="addTeamDialog = true"
        />
        <q-table
          title="Boid Teams"
          :rows="teamData"
          :columns="columns"
          row-key="team_id"
        >
          <template #body="props">
            <q-tr
              :props="props"
              @click="openTeamDetails(props.row)"
            >
              <q-td
                key="logo"
                :props="props"
              >
                <!-- Check if meta and meta.media exist -->
                <img
                  v-if="props.row.meta && props.row.meta.media && props.row.meta.media.length > 0"
                  :src="ipfsEndpoint + props.row.meta.media[0][1]"
                  alt="Team Logo"
                  style="width: 50px; height: 50px;"
                >
                <!-- Fallback content when meta or meta.media is not available -->
                <div
                  v-else
                  class="text-grey-8"
                >
                  No Logo
                </div>
              </q-td>

              <q-td
                key="name"
                :props="props"
              >
                {{ props.row.url_safe_name }}
              </q-td>
              <q-td
                key="owner"
                :props="props"
              >
                {{ props.row.owner }}
              </q-td>
              <q-td
                key="members"
                :props="props"
              >
                {{ props.row.members }}
              </q-td>
              <q-td
                key="power"
                :props="props"
              >
                {{ props.row.power }}
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
    <!-- Dialog for displaying team details -->
    <q-dialog
      v-model="card"
      persistent
    >
      <q-card>
        <q-card-section>
          <div class="text-h6">
            Team Details
          </div>
        </q-card-section>

        <q-card-section>
          <div v-if="selectedTeam">
            <div><strong>Name:</strong> {{ selectedTeam.url_safe_name }}</div>
            <div><strong>Owner:</strong> {{ selectedTeam.owner }}</div>
            <div><strong>Managers:</strong> {{ selectedTeam.managers }}</div>
            <div><strong>Members:</strong> {{ selectedTeam.members }}</div>
            <div><strong>Power:</strong> {{ selectedTeam.power }}</div>
            <div><strong>Power TAX:</strong> {{ selectedTeam.min_pwr_tax_mult }} %</div>
            <div><strong>Owner Power Cut from TAX:</strong> {{ selectedTeam.owner_cut_mult }} %</div>
            <div><strong>Balance:</strong> {{ selectedTeam.balance }} BOID</div>
            <div><strong>Team ID:</strong> {{ selectedTeam.team_id }}</div>
            <div><strong>Last Edit Round:</strong> {{ selectedTeam.last_edit_round }}</div>
            <div v-if="selectedTeam.stake">
              <div><strong>Self Staked:</strong> {{ selectedTeam.stake.self_staked }} BOID</div>
              <div><strong>Received Delegated Stake:</strong> {{ selectedTeam.stake.received_delegated_stake }} BOID</div>
              <ul v-if="selectedTeam.stake.unstaking.length">
                <li
                  v-for="(unstake, index) in selectedTeam.stake.unstaking"
                  :key="index"
                >
                  <strong>Unstaking {{ index + 1 }}:</strong> {{ unstake.quantity }} (Redeemable after round {{ unstake.redeemable_after_round }})
                </li>
              </ul>
            </div>
            <div v-if="selectedTeam.meta">
              <ul v-if="selectedTeam.meta.links && selectedTeam.meta.links.length">
                <!-- Links section -->
                <li
                  v-for="(link, index) in selectedTeam.meta.links"
                  :key="index"
                >
                  <strong>Link {{ index + 1 }}: </strong>
                  <a
                    :href="link[1]"
                    target="_blank"
                  >{{ link[0] }}</a> {{ link[1] }}
                </li>
              </ul>
              <ul v-if="selectedTeam.meta.media && selectedTeam.meta.media.length">
                <!-- Media section with IPFS endpoint prefix -->
                <li
                  v-for="(mediaItem, index) in selectedTeam.meta.media"
                  :key="`media-${index}`"
                >
                  <strong>Media {{ index + 1 }} - |{{ mediaItem[0] }}| </strong>
                  <a
                    :href="ipfsEndpoint + mediaItem[1]"
                    target="_blank"
                  >{{ ipfsEndpoint + mediaItem[1] }}</a>
                </li>
              </ul>
            </div>
          </div>
        </q-card-section>

        <q-card-section align="right">
          <q-btn
            flat
            label="Edit"
            color="secondary"
            @click="editTeam(selectedTeam)"
          />
          <q-btn
            flat
            label="Close"
            color="primary"
            @click="card = false"
          />
        </q-card-section>
        <!-- Edit Dialog -->
        <q-dialog
          v-model="editDialog"
          persistent
          full-width
        >
          <q-card>
            <q-card-section>
              <div class="text-h6">
                Edit Team
              </div>
            </q-card-section>

            <q-card-section>
              <q-input
                v-model="editFormData.name"
                label="Team Name"
                class="q-my-md"
              />
              <q-input
                v-model="editFormData.owner"
                label="Owner"
                class="q-my-md"
              />

              <div
                v-for="(link, index) in editFormData.links"
                :key="'link-' + index"
              >
                <q-input
                  v-model="editFormData.links[index]"
                  label="Link"
                  class="q-my-md"
                />
              </div>

              <div
                v-for="(media, index) in editFormData.media"
                :key="'media-' + index"
              >
                <q-input
                  v-model="editFormData.media[index]"
                  label="Media"
                  class="q-my-md"
                />
              </div>
            </q-card-section>

            <q-card-section align="right">
              <q-btn
                flat
                label="Save"
                color="primary"
                @click="saveEdit"
              />
              <q-btn
                flat
                label="Cancel"
                color="primary"
                @click="editDialog = false"
              />
            </q-card-section>
          </q-card>
        </q-dialog>
      </q-card>
    </q-dialog>
    <q-dialog v-model="addTeamDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">
            Add New Team
          </div>
          <q-input
            v-model="newTeamData.url_safe_name"
            label="Team Name"
          />
          <q-input
            v-model="newTeamData.min_pwr_tax_mult"
            type="number"
            label="Min Power Tax Mult"
          />
          <q-input
            v-model="newTeamData.owner_cut_mult"
            type="number"
            label="Owner Cut Mult"
          />
        </q-card-section>
        <q-card-section align="right">
          <q-btn
            label="Create"
            color="primary"
            @click="createNewTeam"
          />

          <q-btn
            label="Cancel"
            color="primary"
            @click="addTeamDialog = false"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed, ref, reactive } from "vue"
import { useTeamStore } from "../stores/teamsStore"
import { endpoints } from "../lib/config"
import { QTableColumn } from "quasar"
import { DeserializedTeam } from "../lib/types"

export default defineComponent({
  name: "TeamsPage",
  setup() {
    const store = useTeamStore()
    const card = ref(false)
    const selectedTeam = ref<DeserializedTeam | undefined>(undefined)

    const editDialog = ref(false)
    const ipfsEndpoint = endpoints[3]?.[1] || "https://ipfs.pintastic.link/ipfs/"
    const editFormData = reactive({
      name: "",
      owner: "",
      managers: [] as string[],
      min_pwr_tax_mult: 0,
      owner_cut_mult: 0,
      links: [] as string[],
      media: [] as string[]
    })

    const addTeamDialog = ref(false)
    const newTeamData = reactive({
      url_safe_name: "",
      min_pwr_tax_mult: 10,
      owner_cut_mult: 10
    })

    const createNewTeam = async() => {
      console.log("createNewTeam called with", newTeamData)

      try {
        console.log("Initiating team creation")
        const result = await store.createTeamAction(
          newTeamData.min_pwr_tax_mult,
          newTeamData.owner_cut_mult,
          newTeamData.url_safe_name
        )

        if (result) {
          console.log("Team created successfully:", result)
          console.log("Refreshing team data")
          await store.fetchAccTableData()
        } else {
          console.log("No result returned from createTeamAction, possibly due to an error")
        }

        console.log("Closing add team dialog")
        addTeamDialog.value = false
      } catch (error) {
        console.error("Error caught in createNewTeam:", error)
      }
    }
    // const transferTokens = async() => {
    //   try {
    //     console.log("Initiating transfer creation")
    //     const result = await store.createTransferAction()
    //     return result
    //   } catch (error) {
    //     console.error("Error caught in createTransferAction:", error)
    //   }
    // }
    const addLink = () => {
      editFormData.links.push("")
    }

    const removeLink = (index:number) => {
      editFormData.links.splice(index, 1)
    }

    const addMedia = () => {
      editFormData.media.push("")
    }

    const removeMedia = (index:number) => {
      editFormData.media.splice(index, 1)
    }

    function openTeamDetails(team:DeserializedTeam) {
      selectedTeam.value = team
      card.value = true
    }
    function editTeam(team:DeserializedTeam) {
      // Initialize edit form data
      editFormData.name = team.url_safe_name
      editFormData.owner = team.owner
      editFormData.managers = team.managers
      editFormData.min_pwr_tax_mult = team.min_pwr_tax_mult
      editFormData.owner_cut_mult = team.owner_cut_mult
      editFormData.links = team.meta?.links.map(link => link[1]) || []
      editFormData.media = team.meta?.media.map(media => media[1]) || []
      editDialog.value = true
    }
    onMounted(async() => {
      await store.fetchAccTableData()
    })

    const teamData = computed(() => store.organizedData)
    const columns:QTableColumn[] = [
      { name: "logo", label: "Logo", field: "logo", align: "left" },
      { name: "name", label: "Name", field: "url_safe_name", align: "left" },
      { name: "owner", label: "Owner", field: "owner", align: "left" },
      { name: "members", label: "Members", field: "members", align: "left" },
      { name: "power", label: "Power", field: "power", align: "left" }
    ]

    const saveEdit = () => {
      console.log("Saving edits:", editFormData)
      // Implement saving logic here
      editDialog.value = false // Close edit dialog after saving
    }

    return {
      teamData,
      columns,
      ipfsEndpoint,
      selectedTeam,
      card,
      openTeamDetails,
      editFormData,
      saveEdit,
      editTeam,
      editDialog,
      addLink,
      removeLink,
      addMedia,
      removeMedia,
      addTeamDialog,
      newTeamData,
      createNewTeam
    }
  }
})
</script>

<style scoped>
.q-card {
  max-width: 800px;

}
</style>
