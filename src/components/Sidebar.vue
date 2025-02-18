<template>
    <aside class="sidebar">
      <div class="sidebar-header">
        <h1>Recipe Admin</h1>
      </div>
      <nav class="sidebar-nav">
        <router-link to="/admin" exact-active-class="active">Dashboard</router-link>
        <router-link to="/admin/recipes" exact-active-class="active">Recipes</router-link>
        <router-link to="/admin/reviews" exact-active-class="active">Reviews</router-link>
      </nav>
      <div class="sidebar-footer">
        <button @click="logout">Logout</button>
      </div>
    </aside>
  </template>
  
  <script>
  export default {
    name: "Sidebar",
    methods: {
      logout() {
        // Implement your logout logic here
        console.log("Logging out...");
      }
    }
  };
  </script>
  
  <style scoped>
  .sidebar {
    width: 250px;
    background: #1a1a1a;
    color: #fff;
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .sidebar-header {
    padding: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  .sidebar-header h1 {
    margin: 0;
    font-size: 20px;
  }
  .sidebar-nav {
    flex: 1;
    padding: 20px;
  }
  .sidebar-nav a {
    display: block;
    padding: 10px 15px;
    color: #fff;
    text-decoration: none;
    border-radius: 4px;
    margin-bottom: 10px;
  }
  .sidebar-nav a:hover,
  .sidebar-nav a.active {
    background: #ff914d;
  }
  .sidebar-footer {
    padding: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  .sidebar-footer button {
    width: 100%;
    padding: 10px;
    background: transparent;
    color: #fff;
    border: 1px solid #fff;
    border-radius: 4px;
    cursor: pointer;
  }
  </style>
  