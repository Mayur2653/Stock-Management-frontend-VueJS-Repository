<template>
  <div class="page-wrapper">
    <!-- Header -->
    <div class="header-box shadow-sm">
      <h3 class="header-title">Stock Lists</h3>

      <router-link to="/dashboard">
        <button class="btn btn-light btn-add shadow me-2">
          Go to Dashboard
        </button>
      </router-link>
      <router-link to="/add-stock">
        <button class="btn btn-light btn-add shadow me-2">+ Add Stock</button>
      </router-link>

      <router-link to="/bulk">
        <button class="btn btn-success btn-add shadow">Bulk Entry</button>
      </router-link>
    </div>

    <!-- Search Box -->
    <div class="card search-card shadow-sm">
      <div class="card-body">
        <input
          v-model="search"
          type="text"
          class="search-input"
          placeholder="Search by stock, item, location..."
          @input="reload"
        />
      </div>
    </div>

    <!-- Table Box -->
    <div class="card table-card shadow-sm">
      <div class="card-body">
        <div id="stock-table" class="table-container"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_bootstrap5.min.css";
import axios from "../../router/bootstrap";

export default {
  setup() {
    const table = ref(null);
    const search = ref("");

    const reload = () => {
      console.log("Reload triggered");
      table.value?.replaceData();
    };

    onMounted(() => {
      console.log("Tabulator starting...");
      console.log("Component mounted!");

      table.value = new Tabulator("#stock-table", {
        layout: "fitColumns",
        height: "520px",

        pagination: "remote",
        paginationSize: 10,

        ajaxURL: "/stocks",

        ajaxRequestFunc: async (url, config, params) => {
          console.log("Calling Laravel API...", params);

          const res = await axios.get("/stocks", {
            params: {
              page: params.page,
              size: params.size,
              sortField: params.sort?.[0]?.field,
              sortDir: params.sort?.[0]?.dir,
              search: search.value,
            },
          });

          console.log("Response:", res.data);
          return res.data;
        },

        ajaxResponse: (url, params, response) => {
          return response.data;
        },

        paginationDataReceived: {
          last_page: "last_page",
          total: "total",
        },

        columns: [
          { title: "Stock No", field: "stock_no" },
          { title: "Item Code", field: "item_code" },
          { title: "Item Name", field: "item_name" },
          { title: "Quantity", field: "quantity" },
          { title: "Location", field: "location" },
          { title: "Store", field: "store_name" },
          { title: "In Stock Date", field: "in_stock_date" },
          { title: "Status", field: "status" },

          {
            title: "Actions",
            hozAlign: "center",
            width: 120,
            formatter: () =>
              `<button class="btn btn-sm btn-danger">Delete</button>`,

            cellClick: async (e, cell) => {
              if (!confirm("Delete this record?")) return;

              try {
                await axios.delete(`stocks/${cell.getData().id}`);
                cell.getRow().delete();
              } catch (err) {
                console.error(err);
                alert("Could not delete record");
              }
            },
          },
        ],
      });
    });

    return { search, reload };
  },
};
</script>

<style scoped>
/* ----------- Page Layout ------------ */
.page-wrapper {
  padding: 30px;
  max-width: 1400px;
  margin: auto;
}

/* ----------- Header Box ------------ */
.header-box {
  background: black;
  color: white;
  border-radius: 14px;
  padding: 20px 28px;
  display: flex;
  /* justify-content: space-between; */
  /* align-items: center; */
}

.header-title {
  margin: 0;
  font-size: 26px;
  font-weight: 500;
  color: white;
}

/* ----------- Buttons ------------ */
.btn-add {
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 10px;
}

/* ----------- Search Box ------------ */
.search-card {
  margin-top: 25px;
  border-radius: 10px;
  padding-right: 15px 28px;
}

.search-input {
  height: 40px;
  border-radius: 14px;
  font-size: 15px;
}

/* ----------- Table Card ------------ */
.table-card {
  margin-top: 25px;
  border-radius: 14px;
  overflow: hidden;
}

.table-container {
  border-radius: 14px;
  overflow: hidden;
}

/* ----------- Tabulator Styling ------------ */
#stock-table {
  border-radius: 14px !important;
}

.tabulator {
  font-size: 15px;
  border: 2px solid black;
}

.tabulator .tabulator-header {
  background: black;
  color: white;
  font-weight: 600;
  padding: 5px 0;
}

.tabulator .tabulator-header .tabulator-col {
  border-right: 1px solid black;
}

.tabulator .tabulator-row {
  border-bottom: 1px solid black;
  min-height: 50px !important;
}

.tabulator .tabulator-cell {
  padding: 12px 10px;
}

/* Hover effect */
.tabulator-row:hover {
  background: black !important;
}

/* Buttons */
.btn {
  border-radius: 8px !important;
}
</style>
