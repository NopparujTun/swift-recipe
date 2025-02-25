<template>
    <div class="page-container">
      <div class="form-container">
        <p class="title">Admin</p>
        <form class="form" @submit.prevent="handleLogin">
          <input type="text" class="input" placeholder="Username" v-model="username" />
          <input type="password" class="input" placeholder="Password" v-model="password" />
          <button class="form-btn" type="submit">Log in</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "Login",
    data() {
      return {
        username: "",
        password: "",
      };
    },
    methods: {
      handleLogin() {
        const DEFAULT_USERNAME = "AdminZa";
        const DEFAULT_PASSWORD = "1234";
  
        if (this.username === DEFAULT_USERNAME && this.password === DEFAULT_PASSWORD) {
          localStorage.setItem("isAuthenticated", "true");
          this.$router.push("/admin");
        } else {
          alert("Invalid username or password.");
        }
      },
    },
  };
  </script>
  
  <style scoped>
  
  .page-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh; 
    background-color: #f7f7f7;
    margin: 0;
  }
  
  
  .form-container {
    width: 350px;
    background-color: #fff;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    border-radius: 10px;
    padding: 20px 30px;
    box-sizing: border-box;
  }
  
  .title {
    text-align: center;
    font-family: "Poppins", sans-serif;
    margin: 10px 0 30px 0;
    font-size: 28px;
    font-weight: 800;
  }
  
  .form {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 18px;
    margin-bottom: 15px;
  }
  
  .input {
    border-radius: 20px;
    border: 1px solid #c0c0c0;
    outline: 0 !important;
    box-sizing: border-box;
    padding: 12px 15px;
  }
  
  .form-btn {
    padding: 10px 15px;
    font-family: "Poppins", sans-serif;
    border-radius: 20px;
    border: 0 !important;
    outline: 0 !important;
    background: linear-gradient(to right, #ff914d, #ff6f61, #ff9370);
    color: white;
    cursor: pointer;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  }
  </style>
  