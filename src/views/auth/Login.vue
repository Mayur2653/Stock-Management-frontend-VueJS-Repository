<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Login</h2>

      <form @submit.prevent="login">
        <!-- Email -->
        <div class="input-group">
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            @blur="validateEmail"
          />
          <span class="error" v-if="errors.email">{{ errors.email }}</span>
        </div>

        <!-- Password -->
        <div class="input-group">
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            @blur="validatePassword"
          />
          <span class="error" v-if="errors.password">{{
            errors.password
          }}</span>
        </div>

        <!-- Submit -->
        <button :disabled="loading" type="submit">
          {{ loading ? "Logging in..." : "Login" }}
        </button>
      </form>

      <!-- Register link -->
      <!-- <p class="switch">Don't have an account? <a @click="goRegister">Register</a></p> -->
    </div>
  </div>
</template>

<script setup>
// import axios from "axios"; // Correct way (not router)
import axios from "../../router/bootstrap";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const router = useRouter();

const email = ref("");
const password = ref("");
const loading = ref(false);

const errors = ref({
  email: null,
  password: null,
});

// Validate email
const validateEmail = () => {
  if (!email.value) {
    errors.value.email = "Email is required";
  } else if (!/^\S+@\S+\.\S+$/.test(email.value)) {
    errors.value.email = "Enter a valid email address";
  } else {
    errors.value.email = null;
  }
};

// Validate password
const validatePassword = () => {
  if (!password.value) {
    errors.value.password = "Password is required";
  } else if (password.value.length < 6) {
    errors.value.password = "Password must be at least 6 characters";
  } else {
    errors.value.password = null;
  }
};

const isFormValid = () => {
  validateEmail();
  validatePassword();
  return !errors.value.email && !errors.value.password;
};

const login = async () => {
  if (!isFormValid()) return;

  loading.value = true;

  try {
    const res = await axios.post("/login", {
      email: email.value,
      password: password.value,
    });

    console.log("Login API Response:", res.data);

    if (res.status === 200) {
      const token = res.data["auth-token"]; // ← FIXED
      console.log("Extracted Token:", token);

      localStorage.setItem("auth-token", token); // ← FIXED KEY NAME
      store.commit("setToken", res.data.token);
      store.commit("setUser", res.data.user);

      router.push("/dashboard");
    }
  } catch (error) {
    console.error(error);
    alert("Login failed");
  } finally {
    loading.value = false;
  }
};
</script>

<style>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f8f9fa;
}

.login-card {
  width: 380px;
  background: #fff;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.input-group {
  margin-bottom: 15px;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #bbb;
  border-radius: 5px;
  font-size: 14px;
}

.error {
  color: red;
  font-size: 13px;
  margin-top: 4px;
  display: block;
}

button {
  width: 100%;
  padding: 12px;
  background: #007bff;
  border: none;
  border-radius: 5px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
  font-size: 15px;
}

button:disabled {
  background: #9fc4f7;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background: #005ecb;
}

.switch {
  text-align: center;
  margin-top: 15px;
}

.switch a {
  color: #007bff;
  cursor: pointer;
}
</style>
