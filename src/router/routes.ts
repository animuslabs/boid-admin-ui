import { RouteRecordRaw } from "vue-router"

const routes:RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/StartPage.vue") },
      { path: "boid-users", component: () => import("pages/BoidUsers.vue") },
      { path: "boid-workers", component: () => import("pages/BoidWorkers.vue") },
      { path: "teams", component: () => import("pages/TeamsPage.vue") },
      { path: "calculator", component: () => import("components/CalculatorDataComponent.vue") },
      { path: "round-calculator", component: () => import("components/RoundCalculatorDataComponent.vue") },
      { path: "keys-gen", component: () => import("components/KeyGeneratorComponent.vue") },
      { path: "config", component: () => import("pages/ConfigPage.vue") },
      { path: "config/add-offer", component: () => import("components/ConfigAddOffer.vue") },
      { path: "settings", component: () => import("pages/SettingsPage.vue") },
      { path: "payroll/:name?", component: () => import("pages/PayrollPage.vue") }
    ]
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue")
  }
]

export default routes
