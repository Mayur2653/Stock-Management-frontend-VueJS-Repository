<template>
  <div class="page-wrapper">
    <!-- Header -->
    <div class="header-box shadow-sm">
      <h3 class="header-title">Add New Stock</h3>

      <router-link to="/stocks">
        <button class="btn btn-light btn-add shadow">Back</button>
      </router-link>
    </div>

    <!-- Form Box -->
    <div class="card form-card shadow-sm">
      <div class="card-body">
        <form @submit.prevent="submit">
          <!-- Stock No + Item Code -->
          <div class="row mb-3">
            <!-- <div class="col-md-6">
              <label class="form-label">Stock No</label>
              <input
                v-model="form.stock_no"
                type="text"
                class="form-control"
                required
              />
            </div> -->

            <div class="col-md-6">
              <label class="form-label">Item Code</label>
              <input
                v-model="form.item_code"
                type="text"
                class="form-control"
                required
              />
            </div>
          </div>

          <!-- Item Name -->
          <div class="mb-3">
            <label class="form-label">Item Name</label>
            <input
              v-model="form.item_name"
              type="text"
              class="form-control"
              required
            />
          </div>

          <!-- Quantity + Location -->
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label">Quantity</label>
              <input
                v-model="form.quantity"
                type="number"
                class="form-control"
                required
              />
            </div>

            <div class="col-md-6">
              <label class="form-label">Location</label>
              <input
                v-model="form.location"
                type="text"
                class="form-control"
                required
              />
            </div>
          </div>

          <!-- Store + In Stock Date -->
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label">Store</label>
              <select v-model="form.store_name" class="form-control" required>
                <option value="">Select Store</option>
                <option
                  v-for="store in stores"
                  :key="store.store_name"
                  :value="store.store_name"
                >
                  {{ store.store_name }}
                </option>
              </select>
            </div>

            <div class="col-md-6">
              <label class="form-label">In Stock Date</label>
              <input
                v-model="form.in_stock_date"
                type="date"
                class="form-control"
                required
              />
            </div>
          </div>
          <div class="status-box">
            <div class="radio-row">
              <label class="form-label">Status</label>
              <div class="form-check">
                <input
                  type="radio"
                  v-model="form.status"
                  class="form-check-input"
                  name="status"
                  value="pending"
                />
                <label class="form-check-label">Pending</label>
              </div>

              <div class="form-check">
                <input
                  type="radio"
                  class="form-check-input"
                  v-model="form.status"
                  name="status"
                  value="in_stock"
                />
                <label class="form-check-label">In Stock</label>
              </div>

              <div class="form-check">
                <input
                  type="radio"
                  class="form-check-input"
                  name="status"
                  v-model="form.status"
                  value="out"
                />
                <label class="form-check-label">Out</label>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="mt-4 text-end">
            <button type="submit" class="btn btn-success btn-lg shadow">
              Save Stock
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "@/router/bootstrap";

export default {
  setup() {
    const form = ref({
      // stock_no: "",
      item_code: "",
      item_name: "",
      quantity: "",
      location: "",
      store_name: "",
      status: "",
      in_stock_date: "",
    });

    const router = useRouter();
    const stores = ref([]);
    const stocks = ref([]);

    // Save Stock
    const submit = async () => {
      try {
        await axios.post("/stocks", form.value);
        alert("Stock Added Successfully!");
        router.push("/stocks");
      } catch (err) {
        console.error(err);
        alert("Error saving stock.");
      }
    };

    // Load Stores
    const loadStores = async () => {
      try {
        const res = await axios.get("/stores");
        stores.value = res.data.data ?? res.data;
      } catch (err) {
        console.error(err);
        alert("Failed to load stores (Unauthorized?)");
      }
    };

    const loadStocks = async () => {
      try {
        const res = await axios.get("/stocks");
        stocks.value = res.data.data.map((s) => s.status);
      } catch (err) {
        console.log(err);
        alert("Failed to load Stocks Status");
      }
    };

    onMounted(() => loadStores());
    onMounted(() => loadStocks());
    return { form, stores, stocks, submit };
  },
};
</script>

<!-- <script>
import { ref, onMounted } from "vue";
import axios from "@/router/bootstrap";

export default {
  setup() {
    const form = ref({
      stock_no: "",
      item_code: "",
      item_name: "",
      quantity: "",
      location: "",
      store_id: "",
      in_stock_date: "",
    });

    const stores = ref([]);
    const submit = async () => {
      await axios.post("api/stocks", form.value);
      alert("Stock Added Successfully!");
    };

    // Fetch stores for dropdown
    onMounted(async () => {
      const res = await axios.get("api/stores");
      stores.value = res.data.data ?? res.data;
    });

    return { form, stores, submit };
  },
};
</script> -->
<style>
/* ------------ Global -------------- */
.page-wrapper {
  max-width: 900px;
  margin: auto;
  padding: 30px;
  font-family: "Segoe UI", sans-serif;
}

/* ------------ Header -------------- */
.header-box {
  background: linear-gradient(135deg, #000, #222);
  color: #fff;
  border-radius: 16px;
  padding: 18px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header-box h2 {
  margin: 0;
  font-weight: 700;
}

/* ------------ Card -------------- */
.form-card {
  background: #fff;
}

/* ------------ Fields -------------- */
.form-label {
  font-size: 20px;
  /* font-weight: 600; */
  margin: 5px 0;
  display: block;
  text-align: center;
}

.form-control,
select {
  width: 100%;
  height: 44px;
  border-radius: 8px;
  border: 1px solid #dadada;
  padding: 6px 12px;
  font-size: 15px;
}

/* tighten spacing */
.mb-3 {
  margin-bottom: 10px;
}

/* ------------ Store / Date Row -------------- */
.row-inline {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  align-items: end;
}

/* ------------ Status Section -------------- */
.status-box {
  margin-top: 20px;
  text-align: center;
}

.status-box h6 {
  margin-bottom: 8px;
}

/* radio row */
.radio-row {
  display: flex;
  justify-content: start;
  gap: 50px;
}

.form-check {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

/* radio size fix */
.form-check-input {
  /* width: 18px;
  height: 18px; */
  margin: 0;
  cursor: pointer;
  accent-color: black;
}

/* radio label */
.form-check-label {
  font-size: 20px;
}

/* ------------ Submit Button -------------- */
.btn-success {
  margin-top: 25px;
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
}

/* ------------ Back Button -------------- */
.btn-add {
  background: #28a745;
  border-radius: 8px;
  color: white;
  border: none;
  padding: 7px 15px;
}

/* ------------ Mobile Fix -------------- */
@media (max-width: 768px) {
  .row-inline {
    grid-template-columns: 1fr;
  }

  .radio-row {
    gap: 25px;
  }
}
</style>
