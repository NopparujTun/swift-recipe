<template>
    <div>
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
  
    <header>
      <h1>Dessert</h1>
    </header>
      <main>
        <div class="recipes">
          <RecipeCard
            v-for="recipe in filteredRecipes"
            :key="recipe.id"
            :recipe="recipe"
            @click="viewRecipe(recipe.id)"
          />
        </div>
      </main>
      <BackToTop />
      <footer>
      <p>© 2025 Swift Recipe. All rights reserved.</p>
    </footer>
  </div>
  </template>
  
  <script>
  import axios from "axios";
  import RecipeCard from "@/components/RecipeCard.vue";
  import BackToTop from "@/components/BackToTop.vue";
  
  export default {
    name: "MainCourse",
    components: {
        BackToTop,
      RecipeCard,
    },
    data() {
      return {
        recipes: [], // All recipes fetched
        filteredRecipes: [], // Filtered by category
      };
    },
    methods: {
      async fetchRecipes() {
        try {
          const response = await axios.get("http://localhost:3000/recipes");
          this.recipes = response.data;
          this.filterRecipes();
        } catch (error) {
          console.error("Error fetching recipes:", error);
        }
      },
      filterRecipes() {
  
        this.filteredRecipes = this.recipes.filter(
          (recipe) => recipe.category === "Dessert"
        );
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
    navigateTo(path) {
    this.$router.push(path);
  },
    },
    async mounted() {
      await this.fetchRecipes();
    },
  };
  </script>
  