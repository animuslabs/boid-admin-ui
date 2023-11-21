<template>
  <q-page class="flex flex-center">
    <q-card>
      <q-card-section>
        <q-btn
          label="Add"
          color="primary"
          @click="addTeamDialog = true"
          class="q-mb-md q-mr-sm"
        />

        <q-btn
          label="Remove"
          color="negative"
          @click="removeTeamDialog = true"
          class="q-mb-md"
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
                key="team_id"
                :props="props"
              >
                {{ props.row.team_id }}
              </q-td>
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
  </q-page>
  <template>
    <q-dialog v-model="removeTeamDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">
            Remove Team
          </div>
          <q-input
            v-model="teamIdToRemove"
            label="Enter Team ID to Remove"
            type="number"
            class="q-mb-md"
          />
        </q-card-section>
        <q-card-section align="right">
          <q-btn
            label="Remove"
            color="negative"
            @click="handleRemoveTeam"
            class="q-mr-sm"
          />
          <q-btn
            label="Cancel"
            color="primary"
            @click="removeTeamDialog = false"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="card"
      persistent
      class="team-details-dialog"
    >
      <!-- Dialog for displaying team details -->
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
                  :key="`link-${index}`"
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
              <ul v-if="selectedTeam.meta.text && selectedTeam.meta.text.length">
                <!-- Text section -->
                <li
                  v-for="(textItem, index) in selectedTeam.meta.text"
                  :key="`text-${index}`"
                >
                  <strong>Text {{ index + 1 }} - |{{ textItem[0] }}| </strong>
                  {{ textItem[1] }}
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
      </q-card>
    </q-dialog>
    <!-- Edit Dialog -->
    <q-dialog
      v-model="editDialog"
      persistent
      class="team-details-edit-dialog"
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

          <!-- Dynamic fields for links -->
          <div
            v-for="(link, index) in editFormData.links"
            :key="'link-' + index"
            class="q-mb-md"
          >
            <q-select
              v-model="link[0]"
              :options="linkOptions"
              label="Link Name"
            />
            <q-input
              v-model="link[1]"
              label="Full link URL"
            />
            <q-btn
              icon="delete"
              @click="removeLink(index)"
            />
          </div>
          <q-btn
            label="Add Link"
            @click="addLink"
          />

          <div
            v-for="(media, index) in editFormData.media"
            :key="'media-' + index"
          >
            <q-select
              v-model="media[0]"
              :options="mediaOptions"
              label="Media Link Name"
            />
            <q-input
              v-model="media[1]"
              label="Media image IPFS Hash"
              autogrow
            />
            <q-btn
              icon="delete"
              @click="removeLink(index)"
            />
          </div>
          <q-btn
            label="Add Media"
            @click="addMedia"
          />
          <!-- Dynamic fields for text -->
          <div
            v-for="(textItem, index) in editFormData.text"
            :key="'text-' + index"
            class="q-mb-md"
          >
            <q-select
              v-model="textItem[0]"
              :options="textOptions"
              label="Text Name"
            />
            <q-input
              v-model="textItem[1]"
              label="Text Value"
              autogrow
            />
            <q-btn
              icon="delete"
              @click="removeText(index)"
            />
          </div>
          <q-btn
            label="Add Text"
            @click="addText"
          />
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
    <q-dialog v-model="addTeamDialog">
      <!-- adding a team dialog -->
      <q-card>
        <q-card-section>
          <div class="text-h6">
            Add New Team
          </div>
          <q-input
            v-model="newTeamData.url_safe_name"
            :color="urlSafeNameValid ? 'green' : 'red'"
            label="Team Name"
            hint="Lowercase, numbers, hyphens only. Max 20 characters."
            :dense="true"
            class="q-mb-md"
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
            class="q-mr-sm"
          />

          <q-btn
            label="Cancel"
            color="primary"
            @click="addTeamDialog = false"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </template>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed, ref, reactive } from "vue"
import { useTeamStore } from "../stores/teamsStore"
import { stringToBytes } from "../lib/reuseFunctions"
import { endpoints } from "../lib/config"
import { QTableColumn } from "quasar"
import { DeserializedTeam, TeamMeta } from "../lib/types"

export default defineComponent({
  name: "TeamsPage",
  setup() {
    const store = useTeamStore()
    const card = ref(false)
    const selectedTeam = ref<DeserializedTeam | undefined>(undefined)
    const teamIdToRemove = ref(0)
    const removeTeamDialog = ref(false)

    const urlSafeNameValid = computed(() => {
      const regex = /^[a-z0-9-]{1,20}$/
      return regex.test(newTeamData.url_safe_name)
    })
    const editDialog = ref(false)
    const ipfsEndpoint = endpoints[3]?.[1] || "https://ipfs.pintastic.link/ipfs/"
    const linkOptions = [
      "twitter", "medium", "discord", "telegram", "facebook", "linkedIn"
    ]
    const mediaOptions = ["icon", "logo", "banner"]
    const textOptions = ["summary"]
    const editFormData = reactive({
      name: "",
      owner: "",
      managers: [] as string[],
      min_pwr_tax_mult: 0,
      owner_cut_mult: 0,
      links: [] as [string, string][],
      media: [] as [string, string][],
      text: [] as [string, string][]
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
    const addLink = () => {
      editFormData.links.push(["", ""])
    }

    const removeLink = (index:number) => {
      editFormData.links.splice(index, 1)
    }

    const addMedia = () => {
      editFormData.media.push(["", ""])
    }

    const removeMedia = (index:number) => {
      editFormData.media.splice(index, 1)
    }
    const addText = () => {
      editFormData.text.push(["", ""])
    }

    const removeText = (index:number) => {
      editFormData.text.splice(index, 1)
    }

    function openTeamDetails(team:DeserializedTeam) {
      selectedTeam.value = team
      card.value = true
    }
    function editTeam(team:DeserializedTeam | undefined) {
      // Initialize edit form data
      if (!team) {
        console.error("No team selected")
        return
      }
      editFormData.name = team.url_safe_name
      editFormData.owner = team.owner
      editFormData.managers = [...team.managers]
      editFormData.min_pwr_tax_mult = team.min_pwr_tax_mult
      editFormData.owner_cut_mult = team.owner_cut_mult

      // Ensure links and media are formatted as arrays of arrays
      editFormData.links = team.meta && team.meta.links ? team.meta.links.map(link => [link[0], link[1]]) : []
      editFormData.media = team.meta && team.meta.media ? team.meta.media.map(media => [media[0], media[1]]) : []
      editFormData.text = team.meta && team.meta.text ? [...team.meta.text] : []
      editDialog.value = true
    }

    const rmTeam = async(teamIdToRemove:number) => {
      if (!teamIdToRemove) {
        console.error("No team ID provided for removal.")
        return
      }

      try {
        const result = await store.removeTeamAction(teamIdToRemove)
        if (result) {
          console.log("Team removed successfully:", result)
        // Refresh the team list or perform other updates as needed
        } else {
          console.log("Failed to remove the team.")
        }
      } catch (error) {
        console.error("Error removing team:", error)
      }
    }
    const handleRemoveTeam = async() => {
      if (teamIdToRemove.value) {
        await rmTeam(teamIdToRemove.value) // Call rmTeam with the provided team ID
        removeTeamDialog.value = false // Close the dialog
      } else {
        console.error("Please enter a valid team ID.")
      }
    }

    onMounted(async() => {
      await store.fetchAccTableData()
    })

    const teamData = computed(() => store.organizedData)
    const columns:QTableColumn[] = [
      { name: "team_id", label: "Team ID", field: "team_id", align: "left" },
      { name: "logo", label: "Logo", field: "logo", align: "left" },
      { name: "name", label: "Name", field: "url_safe_name", align: "left" },
      { name: "owner", label: "Owner", field: "owner", align: "left" },
      { name: "members", label: "Members", field: "members", align: "left" },
      { name: "power", label: "Power", field: "power", align: "left" }
    ]

    const saveEdit = async() => {
      console.log("Saving edits:", editFormData)

      // Create an instance of TeamMeta
      const meta = new TeamMeta()
      meta.links = editFormData.links
      meta.media = editFormData.media
      meta.text = editFormData.text

      // Serialize meta data to JSON string
      const metaString = JSON.stringify(meta)

      // Convert JSON string to BytesType
      const metaBytes = stringToBytes(metaString)

      // Prepare data for editTeamAction
      const teamEditData = {
        team_id: selectedTeam.value?.team_id ?? 0,
        owner: editFormData.owner,
        managers: editFormData.managers,
        min_pwr_tax_mult: editFormData.min_pwr_tax_mult,
        owner_cut_mult: editFormData.owner_cut_mult,
        url_safe_name: editFormData.name,
        meta: metaBytes
      }

      // Call editTeamAction
      try {
        const result = await store.editTeamAction(
          teamEditData.team_id,
          teamEditData.owner,
          teamEditData.managers,
          teamEditData.min_pwr_tax_mult,
          teamEditData.owner_cut_mult,
          teamEditData.url_safe_name,
          teamEditData.meta
        )

        if (result) {
          console.log("Team edited successfully:", result)
          await store.fetchAccTableData()
          const updatedTeam = teamData.value.find(team => team.team_id === selectedTeam.value?.team_id)
          if (updatedTeam) {
            selectedTeam.value = updatedTeam
          }
        } else {
          console.log("No result returned from editTeamAction, possibly due to an error")
        }
      } catch (error) {
        console.error("Error editing team:", error)
      }

      editDialog.value = false // Close edit dialog after attempting to save
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
      createNewTeam,
      urlSafeNameValid,
      addText,
      removeText,
      linkOptions,
      mediaOptions,
      textOptions,
      teamIdToRemove,
      handleRemoveTeam,
      removeTeamDialog
    }
  }
})
</script>

<style scoped>
.team-details-dialog .q-card {
  max-width: 800px;
  max-height: 800px;
  overflow-wrap: break-word; /* Break lines within words if necessary */
}

.team-details-edit-dialog .q-card {
  min-width: 400px ;
  max-height: 800px;
  overflow-y: auto; /* Enables scrolling for overflowing content */
  overflow-wrap: break-word; /* Break lines within words if necessary */
}
</style>
