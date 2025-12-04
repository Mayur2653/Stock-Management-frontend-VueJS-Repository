<template>
  <div class="register-container">
    <div class="register-card">
      <h2>Create Account</h2>

      <form @submit.prevent="register">
        <!-- Name -->
        <div class="input-group">
          <input
            v-model="name"
            type="text"
            placeholder="Full Name"
            @blur="validateName"
          />
          <span class="error" v-if="errors.name">{{ errors.name }}</span>
        </div>

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

        <!-- Confirm Password -->
        <div class="input-group">
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            @blur="validateConfirmPassword"
          />
          <span class="error" v-if="errors.confirmPassword">{{
            errors.confirmPassword
          }}</span>
        </div>

        <button :disabled="loading" type="submit">
          {{ loading ? "Creating account..." : "Register" }}
        </button>
      </form>

      <p class="switch">
        Already have an account?
        <a @click="router.push('/login')">Login</a>
      </p>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const loading = ref(false);

const errors = ref({
  name: null,
  email: null,
  password: null,
  confirmPassword: null,
});

// Validations
const validateName = () => {
  errors.value.name = name.value ? null : "Name is required";
};

const validateEmail = () => {
  if (!email.value) {
    errors.value.email = "Email is required";
  } else if (!/^\S+@\S+\.\S+$/.test(email.value)) {
    errors.value.email = "Enter a valid email address";
  } else {
    errors.value.email = null;
  }
};

const validatePassword = () => {
  if (!password.value) {
    errors.value.password = "Password is required";
  } else if (password.value.length < 6) {
    errors.value.password = "Password must be at least 6 characters";
  } else {
    errors.value.password = null;
  }
};

const validateConfirmPassword = () => {
  if (!confirmPassword.value) {
    errors.value.confirmPassword = "Confirm your password";
  } else if (confirmPassword.value !== password.value) {
    errors.value.confirmPassword = "Passwords do not match";
  } else {
    errors.value.confirmPassword = null;
  }
};

const isFormValid = () => {
  validateName();
  validateEmail();
  validatePassword();
  validateConfirmPassword();

  return (
    !errors.value.name &&
    !errors.value.email &&
    !errors.value.password &&
    !errors.value.confirmPassword
  );
};

const register = async () => {
  if (!isFormValid()) return;

  loading.value = true;

  try {
    const res = await axios.post("http://localhost:8000/api/register", {
      name: name.value,
      email: email.value,
      password: password.value,
    });

    if (res.status === 201) {
      alert("Account created successfully!");
      router.push("/login");
    }
  } catch (error) {
    if (error.response?.status === 422) {
      errors.value.email = "Email already exists";
    } else {
      alert("Registration failed. Try again!");
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f7f7f7;
}

.register-card {
  width: 400px;
  background: #fff;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
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
  background: #28a745;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 15px;
  cursor: pointer;
}

button:hover:not(:disabled) {
  background: #1f8a37;
}

button:disabled {
  background: #98e4a8;
  cursor: not-allowed;
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
