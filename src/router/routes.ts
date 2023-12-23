import { RouteRecordRaw } from "vue-router"

const routes:RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/StartPage.vue") },
      { path: "boid-users", component: () => import("pages/BoidUsers.vue") },
      { path: "teams", component: () => import("pages/TeamsPage.vue") },
      { path: "config", component: () => import("pages/ConfigPage.vue") },
      { path: "config/add-offer", component: () => import("components/ConfigAddOffer.vue") },
      { path: "config/edit-signers", component: () => import("pages/EditSignersPage.vue") },
      { path: "settings", component: () => import("pages/SettingsPage.vue") }
    ]
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue")
  }
]

export default routes
