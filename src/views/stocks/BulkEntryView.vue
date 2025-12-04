<template>
  <div class="page-wrapper">
    <!-- Header -->
    <div class="header-box shadow-sm">
      <h3 class="header-title">Bulk Stock View</h3>

      <router-link to="/dashboard">
        <button class="btn btn-light btn-add shadow me-2">
          Go to Dashboard
        </button>
      </router-link>
      <div>
        <button @click="addRow">Add New Record</button>
      </div>
      <div>
        <button @click="saveAll">Save All</button>
      </div>
      <router-link to="/stocks">
        <button class="btn btn-light btn-add shadow">Back</button>
      </router-link>
    </div>
    <ag-grid-vue
      class="ag-theme-alpine"
      style="width: 100%; height: 500px"
      :columnDefs="columnDefs"
      :rowData="rowData"
      :defaultColDef="defaultColDef"
      @grid-ready="onGridReady"
    >
    </ag-grid-vue>
  </div>
</template>

<script setup>
import axios from "../../router/bootstrap"; // your axios instance
import { ref } from "vue";
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import { AgGridVue } from "ag-grid-vue3";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { provideGlobalGridOptions } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

ModuleRegistry.registerModules([AllCommunityModule]);
provideGlobalGridOptions({ theme: "legacy" });

const router = useRouter();
const gridApi = ref(null);
const columnDefs = [
  {
    headerName: "Stock No",
    valueGetter: (params) => params.node.rowIndex + 1,
    editable: false,
  },
  { headerName: "Item Code", field: "item_code", editable: true },
  { headerName: "Item Name", field: "item_name", editable: true },
  {
    headerName: "Quantity",
    field: "quantity",
    editable: true,
    type: "numericColumn",
  },
  { headerName: "Location", field: "location", editable: true },
  {
    headerName: "Store",
    field: "store_name",
    editable: true,
    cellEditor: "agSelectCellEditor",
    cellEditorParams: { values: [] },
  },
  { headerName: "In-Stock Date", field: "in_stock_date", editable: true },
  {
    headerName: "Stock Status",
    field: "status",
    editable: true,
    cellEditor: "agSelectCellEditor",
    cellEditorParams: { values: [] },
  },
];

const defaultColDef = { resizable: true, sortable: true, filter: true };

const rowData = ref([]);

// load stores for store dropdown
const stores = ref([]);

// get status for status dropdown
const stocks = ref([]);

onMounted(async () => {
  try {
    const res = await axios.get("/stores");
    stores.value = res.data;
    console.log(res.data);

    const storeCol = columnDefs.find((c) => c.field === "store_name");
    if (storeCol) {
      storeCol.cellEditorParams.values = stores.value.map((s) => s.store_name);
    }

    // Tell ag-grid to refresh column defs if grid is ready
    if (gridApi.value) {
      // gridApi.value.setColumnDefs(columnDefs);
    }
  } catch (err) {
    console.error(err);
  }
});

// for get status rows
onMounted(async () => {
  try {
    const stockRes = await axios.get("/stocks");
    stocks.value = stockRes.data.data;
    console.log(stockRes.data);
    const statusCol = columnDefs.find((c) => c.field === "status");

    if (statusCol) {
      statusCol.cellEditorParams.values = stocks.value.map((s) => s.status);
    }
  } catch (err) {
    console.error(err);
  }
});

function addRow() {
  rowData.value.push({
    item_code: "",
    item_name: "",
    quantity: 0,
    location: "",
    store_name: stores.value.length ? stores.value[0].store_name : null, // Important
    in_stock_date: null,
    status: stocks.value.length ? stocks.value[0].status : null,
  });
}

async function saveAll() {
  const records = rowData.value;
  try {
    const res = await axios.post("/stocks", { records });
    alert("Saved");
    router.push("/stocks");
    rowData.value = []; // clear grid after save
  } catch (e) {
    alert("Save failed");
  }
}
function onGridReady(params) {
  gridApi.value = params.api;
}
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
  justify-content: space-between;
  align-items: center;
}

.header-title {
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  color: white;
}

/* ----------- Buttons ------------ */
.btn-add {
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 10px;
}

/* ----------- Search Box ------------ */

/* ----------- Table Card ------------ */

/* ----------- Tabulator Styling ------------ */

/* Buttons */
.btn {
  border-radius: 8px !important;
}
</style>
