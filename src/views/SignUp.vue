<template>
    <div class="container">
      <p class="title">Sign Up</p>
      <form class="form" @submit.prevent="handleSignup">
        <div class="form-group">
          
          <input type="email" id="email" v-model="email" placeholder="Email" required />
        </div>
        <div class="form-group">
          
          <input type="password" id="password" v-model="password" placeholder="Password" required />
        </div>
        <div class="form-actions">
          <button type="submit" class="btn">Sign Up</button>
         
        </div>
        <p class="signup-link">
          Already have an account?
          <a href="#" @click.prevent="navigateToLogin">Log in</a>
        </p>
      </form>
  
      <!-- Modal Popup -->
      <div v-if="showModal" class="modal-overlay">
        <div class="modal">
          <p class="modal-message">Check your email for a confirmation link to complete your registration.</p>
          <button class="modal-btn" @click="closeTab">Close & Exit</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { supabase } from "../supabase";
  import router from "../router/index";
  
  const email = ref("");
  const password = ref("");
  const showModal = ref(false);
  
  const handleSignup = async () => {
    try {
      const { error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
        options: {
          emailRedirectTo: "http://localhost:5173/"
        }
      });
      if (error) throw error;
  
      // Show modal popup after successful signup
      showModal.value = true;
    } catch (error) {
      alert(error.error_description || error.message);
    }
  };
  
  const navigateToLogin = () => {
    router.push("/login");
  };
  
  const closeTab = () => {
    showModal.value = false;
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
    width: 100%;
    color: white;
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
  
  /* Modal Styling */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .modal {
    background: white;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  }
  
  .modal-message {
    font-size: 16px;
    margin-bottom: 15px;
  }
  
  .modal-btn {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 8px 16px;
    cursor: pointer;
    border-radius: 5px;
  }
  
  .modal-btn:hover {
    background-color: #0056b3;
  }
  </style>
  