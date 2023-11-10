<template>
  <q-page class="flex flex-center">
    <q-card>
      <q-card-section>
        <q-table
          title="Boid Teams"
          :rows="teamData"
          :columns="columns"
          row-key="team_id"
        >
          <template #body="props">
            <q-tr :props="props">
              <q-td
                key="logo"
                :props="props"
              >
                <!-- Displaying the team logo from IPFS -->
                <img
                  :src="ipfsEndpoint + props.row.meta.media[0][1]"
                  alt="Team Logo"
                  style="width: 50px; height: 50px;"
                >
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
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from "vue"
import { useTeamStore } from "../stores/teamsStore"
import { endpoints } from "../lib/config"
import { QTableColumn } from "quasar"

export default defineComponent({
  name: "TeamsPage",
  setup() {
    const store = useTeamStore()
    const ipfsEndpoint = endpoints[3]?.[1] || "https://ipfs.pintastic.link/ipfs/"
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

    return { teamData, columns, ipfsEndpoint }
  }
})
</script>

<style scoped>
.q-card {
  width: 600px;
  max-width: 95%;
}
</style>
