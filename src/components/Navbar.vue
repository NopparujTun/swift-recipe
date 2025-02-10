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
  </template>
  
  <script>
  export default {
    data() {
      return {
        isMenuOpen: false,
      };
    },
    methods: {
      toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
      },
      navigateTo(path) {
        this.$router.push(path);
      },
      goToHome() {
      this.$router.push("/");
    },
    },
  };
  </script>
  
  <style scoped>
/* Navbar Styling */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 1000;


}

.nav-logo {
  display: flex;
  align-items: center;
}

.nav-logo img {
  height: 50px;
  margin-right: 0.5rem;
}

.nav-logo span {
  font-size: 1.8rem;
  font-family: "poppins", serif;
  font-weight: bold;
  color: #333;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-links a {
  text-decoration: none;
  font-size: 1rem;
  font-family: "poppins", sans-serif;
  font-weight: bold;
  color: #333;
  transition: color 0.3s ease;
}

.nav-links a:hover {
  color: #ff6f61;
}
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  padding: 1rem 2rem;
}

.nav-links {
  list-style: none;
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
}

.nav-links li {
  position: relative;
}

.nav-links a {
  text-decoration: none;
  color: rgb(0, 0, 0);
  font-weight: bold;
  padding: 0.5rem 0.5rem;
  display: block;
}
/* Dropdown menu */
ul li ul.dropdown {
  width: 100%;
  background: #ffffff;
  position: absolute;
  top: 100%; 
  left: 0;
  z-index: 999;
  display: none;
  cursor: pointer;
}

ul li ul.dropdown li {
  display: block;
}

ul li:hover ul.dropdown {
  display: block; 
}

.dropdown:hover .dropdown-content,
.dropdown-content:hover {
  display: block;
}
.dropdown li a{
  margin-left: -30px;
}
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
}

.hamburger span {
  width: 25px;
  height: 3px;
  background: #333;
}
@media (max-width: 768px) {
  .hamburger {
    display: flex;
  }

  .nav-links {
    display: none;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    background-color: #fff;
    width: 100%;
    padding: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .nav-links.open {
    display: flex;
  }

  .nav-links li {
    margin: 0.5rem 0;
  }
}

* {
  font-family: "Poppins", sans-serif;
}
  </style>
  