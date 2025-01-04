<template>
  <div>
    <nav class="navbar">
  <div class="nav-logo">
    <img src="/src/assets/logo.jpg" alt="Swift Recipe Logo" />
    <span>Swift Recipe</span>
  </div>
  <div class="nav-toggle" @click="toggleMenu">&#9776;</div>
  <div :class="['nav-links', { show: isMenuOpen }]">
    <a href="/" @click.prevent="goToHome">Home</a>
    <a href="#">Recipes</a>
    <a href="#">Favorites</a>
    <a href="#">About</a>
  </div>
</nav>

    <header>
      <h1>Welcome to Swift Recipe</h1>
      <p>Your simplest and quickest food recipes, all in one place.</p>
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
      <p>© 2025 Recipe Manager. All rights reserved.</p>
    </footer>
  </div>
</template>

<script>
import RecipeCard from "@/components/RecipeCard.vue";

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
    loadRecipes() {
      const savedRecipes = localStorage.getItem("recipes");
      this.recipes = savedRecipes ? JSON.parse(savedRecipes) : [];
      this.filterRecipes();
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
  mounted() {
    this.loadRecipes(); 
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
