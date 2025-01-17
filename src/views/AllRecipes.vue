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
            <li v-for="category in uniqueCategories" :key="category" @click="filterByCategory(category)">
              <a href="#">{{ category }}</a>
            </li>
          </ul>
        </li>
        <li><a href="#">About</a></li>
      </ul>
    </nav>
  
    <header>
      <h1>All recipes</h1>
    </header>
    <main>
      <div class="filter">
        <label for="category">Filter by Type:</label>
        <select id="category" v-model="selectedCategory" @change="filterRecipes">
          <option value="All">All</option>
          <option v-for="category in uniqueCategories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>
      <div class="recipes">
        <RecipeCard
          v-for="recipe in filteredRecipes"
          :key="recipe.id"
          :recipe="recipe"
          @click="viewRecipe(recipe.id)"
        />
      </div>
    </main>
    <footer>
      <p>© 2025 Swift Recipe. All rights reserved.</p>
    </footer>
  </template>
  
  <script>
  import RecipeCard from "@/components/RecipeCard.vue";
  import axios from "axios";
  
  export default {
    name: "Home",
    components: {
      RecipeCard,
    },
    data() {
      return {
        recipes: [], 
        selectedCategory: "All",
        filteredRecipes: [],
        isMenuOpen: false,
      };
    },
    computed: {
      uniqueCategories() {
        return [...new Set(this.recipes.map((recipe) => recipe.category))];
      },
    },
    methods: {
      async loadRecipes() {
        try {
          const response = await axios.get("http://localhost:3000/recipes");
          this.recipes = response.data;
          this.filterRecipes(); // Filter the recipes after loading
        } catch (error) {
          console.error("Error fetching recipes:", error);
        }
      },
      filterRecipes() {
        if (this.selectedCategory === "All") {
          this.filteredRecipes = this.recipes;
        } else {
          this.filteredRecipes = this.recipes.filter(
            (recipe) => recipe.category === this.selectedCategory
          );
        }
      },
      viewRecipe(id) {
        this.$router.push({ name: "RecipeDetails", params: { id } });
      },
      goToHome() {
        this.$router.push("/");
      },
      toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
      },
    },
    async mounted() {
      await this.loadRecipes(); 
    },
  };
  </script>
  
  
  <style scoped>
  
  /* Filter Section */
  .filter {
    margin: 1rem 0;
    display: flex;
    gap: 10px;
  }
  
  .filter label {
    margin-top: 3px;
    font-size: 1rem;
    font-weight: bold;
    font-family: "Montserrat", sans-serif;
  }
  
  .filter select {
    padding: 0.2rem;
    font-size: 1rem;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
  
  
  </style>