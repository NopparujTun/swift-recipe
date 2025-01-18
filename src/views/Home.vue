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
        <li><a href="#">About</a></li>
      </ul>
    </nav>

    <header>
      <h1>Welcome to Swift Recipe</h1>
      <p>Your simplest and quickest food recipes, all in one place.</p>
    </header>

    <main>
      <!-- Christmas Recipes Section -->
      <section>
        <h2 class="christmas">🎄 Christmas Edition 🎄</h2>
        <div class="recipes">
          <RecipeCard
            v-for="recipe in christmasRecipes"
            :key="recipe.id"
            :recipe="recipe"
            @click="viewRecipe(recipe.id)"
          />
        </div>
      </section>

      <!-- All Recipes Section -->
      <section>
        <h2>All Recipes</h2>
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
      </section>
      <BackToTop />
    </main>

    <footer>
      <p>© 2025 Swift Recipe. All rights reserved.</p>
    </footer>
  </div>
</template>

<script>
import RecipeCard from "@/components/RecipeCard.vue";
import BackToTop from "@/components/BackToTop.vue";
import axios from "axios";

export default {
  name: "Home",
  components: {
    BackToTop,
    RecipeCard,
  },
  data() {
    return {
      recipes: [], 
      selectedCategory: "All",
      filteredRecipes: [],
      christmasRecipes: [], 
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
      // Load all recipes
      const allResponse = await axios.get("/src/data/recipes.json");
      this.recipes = allResponse.data.recipes;

      // Load Christmas recipes
      const christmasResponse = await axios.get("/src/data/recipes_christmas.json");
      this.christmasRecipes = christmasResponse.data.recipes;

      this.filterRecipes(); 
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  },
    async loadChristmasRecipes() {
      try {
        const response = await axios.get("/src/data/recipes_christmas.json");

        this.christmasRecipes = response.data.recipes;
      } catch (error) {
        console.error("Error fetching Christmas recipes:", error);
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
  if (isNaN(id)) {
 
    this.$router.push({ name: "RecipeDetails_Christmas", params: { id } });
  } else {
 
    this.$router.push({ name: "RecipeDetails", params: { id } });
  }
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
    await this.loadRecipes();
    await this.loadChristmasRecipes(); 
  },
};
</script>


<style scoped>
section h2.christmas {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: #d9534f;
  font-family: "Montserrat", sans-serif;
}
section h2{
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: #333;
  font-family: "Montserrat", sans-serif;
}
.recipes {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

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
