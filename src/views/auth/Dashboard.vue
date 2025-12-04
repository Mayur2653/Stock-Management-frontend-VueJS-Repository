<template>
  <!-- Bootstrap -->
  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
    rel="stylesheet"
  />

  <div class="d-flex min-vh-100 bg-light">
    <!-- ===== Sidebar ===== -->
    <aside class="sidebar text-white p-3">
      <h5 class="mb-4 text-center">Stock System</h5>

      <nav class="nav flex-column">
        <router-link class="nav-link sidebar-link" to="/stocks">
          Stocks
        </router-link>

        <router-link class="nav-link sidebar-link" to="/bulk">
          Bulk Entry
        </router-link>

        <button class="btn btn-danger mt-4" @click="logout">Logout</button>
      </nav>
    </aside>

    <!-- ===== Main Content ===== -->
    <div class="flex-grow-1">
      <!-- Top Navbar -->
      <nav class="navbar navbar-light bg-white shadow-sm px-4">
        <button class="btn btn-outline-secondary d-md-none" @click="toggle">
          ☰
        </button>

        <h6 class="mb-0 fw-semibold">Dashboard</h6>
      </nav>

      <!-- Page -->
      <main class="p-4">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const sidebarVisible = ref(true);

function toggle() {
  sidebarVisible.value = !sidebarVisible.value;

  const sidebar = document.querySelector(".sidebar");
  sidebar.classList.toggle("d-none");
}

function logout() {
  localStorage.removeItem("auth-token");
  router.push("/login");
}
</script>

<style scoped>
.sidebar {
  width: 240px;
  min-height: 100vh;
  background-color: rgb(188, 178, 178);
}

.sidebar-link {
  color: #ffffff !important;
  border-radius: 6px;
  padding: 10px;
}

.sidebar-link:hover {
  background: #0c71d6;
}
</style>
