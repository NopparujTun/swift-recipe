<template>
<Navbar />
    <div class="about-container">
      
      <div class="logo-section">
        <img src="/src/assets/logo.jpg" alt="Swift Recipe Logo" class="logo" />
      </div>
  
      
      <div class="description-section">
        <h1>About Swift Recipe</h1>
        <p>
          Welcome to <strong>Swift Recipe</strong>
        </p>
        <p>
          Our mission is to make cooking easy and quick for everyone.
        </p>
        <p>
          Bon appétit and happy cooking!
        </p>
      </div>
    </div>
  </template>
  
  <script>
  import Navbar from "@/components/Navbar.vue";
  export default {
    components: {
    Navbar,
  },
};
  
  </script>
  
  <style scoped>
  .about-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin: 0 auto;
    padding: 2rem;
    max-width: 800px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .logo-section {
    margin-bottom: 2rem;
  }
  
  .logo {
    width: 150px;
    height: auto;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .description-section h1 {
    font-family: "Montserrat", sans-serif;
    font-size: 2rem;
    margin-bottom: 1rem;
    color: #333;
  }
  
  .description-section p {
    font-family: "Roboto", sans-serif;
    font-size: 1rem;
    line-height: 1.6;
    color: #555;
    margin-bottom: 1rem;
  }
  </style>
  