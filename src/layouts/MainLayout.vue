<template>
  <q-layout view="hhh lpR fff">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          <q-btn
            @click="$router.push('/')"
            flat
          >
            <img
              src="../assets/logo.png"
              alt="Boid Lore NFTs"
              class="q-ma-sm"
              style="height: 50px;"
            >
          </q-btn>
        </q-toolbar-title>
        <div class="q-gutter-md">
          <q-btn
            flat
            dense
            @click="$router.push('/')"
          >
            Home
          </q-btn>
          <q-btn
            flat
            dense
            @click="$router.push('/boid-users')"
          >
            Users
          </q-btn>
          <q-btn
            flat
            dense
            @click="$router.push('/boid-workers')"
          >
            Workers
          </q-btn>
          <q-btn
            flat
            dense
            @click="$router.push('/teams')"
          >
            Teams
          </q-btn>
          <q-btn
            flat
            dense
            @click="$router.push('/config')"
          >
            Config
          </q-btn>
          <q-btn
            flat
            dense
            @click="$router.push('/payroll')"
          >
            Payroll
          </q-btn>
          <q-btn
            flat
            dense
          >
            Tools
            <q-icon name="arrow_drop_down" />

            <q-menu>
              <q-list>
                <q-item clickable v-close-popup @click="$router.push('/calculator')">
                  <q-item-section>Calculator</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="$router.push('/keys-gen')">
                  <q-item-section>Keys Generator</q-item-section>
                </q-item>
                <!-- More tools as needed -->
              </q-list>
            </q-menu>
          </q-btn>

          <q-btn
            flat
            dense
            @click="$router.push('/settings')"
            icon="settings"
          >
            <q-badge :color="badgeColor" label="M-Sign" class="q-ma-xs" />
          </q-btn>
          <!-- Dropdown Button for LoginMenu -->
          <q-btn-dropdown icon="person" color="primary">
            <LoginMenu />
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-banner
        v-if="isBannerVisible"
        dense
        class="text-white"
        :style="{ backgroundColor: 'var(--ltpurple)' }"
      >
        Multi-Signature mode is turned on by default. You can turn it off in the settings menu. Make sure to verify your signees before initiating a transaction.

        <template #action>
          <q-btn flat label="Dismiss" @click="dismissBanner" />
        </template>
      </q-banner>
      <router-view />
    </q-page-container>
    <q-footer
      reveal
      bordered
      class="bg-black text-white"
    >
      <q-toolbar class="footer-class">
        <div>
          <a href="https://twitter.com/boidcom">
            <img
              src="../assets/x-logo-white.png"
              alt=""
            >
          </a>
        </div>
        <div>
          <a href="https://www.linkedin.com/company/boid-com/">
            <img
              src="../assets/linkedIn.svg"
              alt=""
            >
          </a>
        </div>
        <div>
          <a href="https://t.me/boidcommunity">
            <img
              src="../assets/Telegram.svg"
              alt=""
            >
          </a>
        </div>
        <div>
          <a href="https://boidcom.medium.com/">
            <img
              src="../assets/Medium.svg"
              alt=""
            >
          </a>
        </div>
        <div>
          <a href="https://community.boid.com">
            <img
              src="../assets/community-svgrepo-com.svg"
              alt=""
            >
          </a>
        </div>
        <div>
          <a href="https://www.reddit.com/r/boid?utm_source=share&utm_medium=android_app&utm_name=androidcss&utm_term=1&utm_content=share_button">
            <img
              src="../assets/Reddit.svg"
              alt=""
            >
          </a>
        </div>
        <div>
          <a href="https://discord.gg/C5eAPqQQ7j">
            <img
              src="../assets/Discord.svg"
              alt=""
            >
          </a>
        </div>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from "vue"
import { useSessionStore } from "src/stores/sessionStore"
import LoginMenu from "src/components/LoginMenu.vue"
import { notifyEvent, showNotification } from "src/lib/contracts"
import { useSignersStore } from "src/stores/useSignersStore"

const sessionStore = useSessionStore()
const isBannerVisible = ref(true) // Reactive property for banner visibility
const signersStore = useSignersStore()

notifyEvent.on("TrxResult", (result) => {
  showNotification(result)
})

const dismissBanner = () => {
  isBannerVisible.value = false // Hide the banner
}
onMounted(async() => {
  await sessionStore.renew()
  await signersStore.initializeSigners()
})
const badgeColor = computed(() => sessionStore.multiSignToggleState ? "green" : "red")
</script>
<style>
.border-bottom {
  border-bottom: 1px solid var(--secondary);
}

.flex-wrap {
  display: flex;
  flex-wrap: wrap;
}
.order-inventory,
  .order-mint,
  .order-lore,
  .font-bold {
    font-weight: bold;
  }
.order-avatar {
  order: 1;
}

.order-inventory {
  order: 3;
}

.order-mint {
  order: 2;
}

.order-lore {
  order: 4;
}
.order-login {
  order: 5;
}
.order-logged-in {
  order: 6;
}

.toolbar-content {
  display: flex;
  flex-wrap: wrap;
}

.footer-class {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.footer-class div {
  flex: 0 0 auto;
  margin: 15px;
}

.footer-class img {
  width: 25px;
  height: auto;
  filter: invert(54%) sepia(85%) saturate(4500%) hue-rotate(267deg) brightness(78%) contrast(62%);
}

@media screen and (max-width: 480px) {
  .toolbar-content {
    flex-wrap: wrap;
  }

  .order-avatar {
    width: 33%;
    text-align: center;
    order: 1;

  }

  .order-inventory {
    order: 3;
    width: 33%;
    text-align: right;

  }

  .order-mint {
    order: 2;
    width: 33%;
    text-align: right;
  }

  .order-lore {
    order: 4;
    width: 50%;
    text-align: center;
  }

  .order-login {
    order: 5;
    width: 50%;
    text-align: center;
  }

  .order-logged-in {
    order: 5;
    width: 50%;
    text-align: center;
  }

  .footer-class {
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    justify-items: center;
  }

  .footer-class div {
    width: auto;
    flex-grow: 0;
  }

  .footer-class div:nth-child(n+4) {
    grid-row: 1;
  }
}
</style>
