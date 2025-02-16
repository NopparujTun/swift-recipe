<template>
  <div class="container">
    <p class="title">Log in</p>
    <form class="form" @submit.prevent="handleSignin">
      <div class="form-group">
        
        <input type="email" id="email" v-model="email" placeholder="Email" />
      </div>
      <div class="form-group">
        
        <input type="password" id="password" v-model="password" placeholder="Password" />
      </div>
      <div class="form-actions">
        <button type="submit" class="btn">Log in</button>
        
      </div>
      <p class="signup-link">
        Don't have an account? 
        <a href="#" @click.prevent="navigateToSignup">Sign up</a>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import router from "@/router/index";
import { supabase } from "@/supabase.js";

const email = ref("");
const password = ref("");

const handleSignin = async () => {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });
    if (error) throw error;
    router.push("/");
  } catch (error) {
    alert(error.error_description || error.message);
  }
};

const navigateToSignup = () => {
  router.push("/signup");
};
</script>

<style scoped>
.container {
  width: 100%;
  max-width: 350px;
  margin: 100px auto;
  padding: 20px;
  background: white;
  border-radius: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 20px;
}

.form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

.form-group input {
  width: 95%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 20px;
  font-size: 16px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.btn {
  background-color: #007bff;
  color: white;
  width: 100%;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 20px;
  font-size: 16px;
}

.btn:hover {
  background-color: #0056b3;
}

.forgot-password {
  color: #007bff;
  text-decoration: none;
  font-size: 14px;
}

.forgot-password:hover {
  text-decoration: underline;
}

.signup-link {
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
}

.signup-link a {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}

.signup-link a:hover {
  text-decoration: underline;
}
</style>
