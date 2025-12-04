import { createRouter, createWebHistory } from "vue-router";
import store from "../store/index.js";
import Login from "../views/auth/Login.vue";
import Register from "../views/auth/Register.vue";
import Dashboard from "../views/auth/Dashboard.vue";
import StockView from "../views/stocks/StockView.vue";
import BulkEntryView from "@/views/stocks/BulkEntryView.vue";
import AddStock from "@/views/stocks/AddStock.vue";
import AddStore from "@/views/datastore/AddStore.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", name: "login", component: Login },
  { path: "/register", name: "register", component: Register },

  {
    path: "/dashboard",
    name: "dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },

  {
    path: "/stocks",
    name: "stocks",
    component: StockView,
    meta: { requiresAuth: true },
  },

  {
    path: "/bulk",
    name: "bulk",
    component: BulkEntryView,
    meta: { requiresAuth: true },
  },

  {
    path: "/add-stock",
    name: "add-stock",
    component: AddStock,
    meta: { requiresAuth: true },
  },

  {
    path: "/add-store",
    name: "add-store",
    component: AddStore,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Auth Guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("auth-token");

  if (to.meta.requiresAuth && !token && !store.getters.isAuthenticated) {
    next("/login");
  } else {
    next();
  }
});

export default router;
