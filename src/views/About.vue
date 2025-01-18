<template>
          <nav class="navbar">
        <div class="nav-logo">
          <img src="/src/assets/logo.jpg" alt="Swift Recipe Logo" />
          <span>Swift Recipe</span>
        </div>
        <button class="hamburger" @click="toggleMenu">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul class="nav-links" :class="{ 'open': isMenuOpen }">
          <li><a href="/" @click.prevent="goToHome">Home</a></li>
          <li>
            <a href="/recipes/all" class="dropdown-btn">Recipes</a>
            <ul class="dropdown">
              <li><a @click.prevent="navigateTo('/recipes/maincourse')">Main Course</a></li>
              <li><a @click.prevent="navigateTo('/recipes/dessert')">Dessert</a></li>
              <li><a @click.prevent="navigateTo('/recipes/salad')">Salad</a></li>
              <li><a @click.prevent="navigateTo('/recipes/breakfast')">Breakfast</a></li>
              <li><a @click.prevent="navigateTo('/recipes/vegetarian')">Vegetarian</a></li>
            </ul>
          </li>
          <li><a href="/about">About</a></li>
        </ul>
      </nav>
    <div class="about-container">
      <!-- Logo Section -->
      <div class="logo-section">
        <img src="/src/assets/logo.jpg" alt="Swift Recipe Logo" class="logo" />
      </div>
  
      <!-- Description Section -->
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
  export default {
    name: "About",
    methods: {
    goToHome() {
      this.$router.push("/");
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    navigateTo(path) {
    this.$router.push(path);
  },
  },
  async mounted() {
    await this.loadRecipes();
    await this.loadChristmasRecipes(); 
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
  