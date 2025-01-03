<template>
  <div>
    <header>
      <h1>Swift Recipe</h1>
      <p>Your simplest and quickest food recipes, all in one place.</p>
    </header>
    <nav>
      <a href="#">Home</a>
      <a href="#">Add Recipe</a>
      <a href="#">Search</a>
      <a href="#">Favorites</a>
    </nav>
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
import recipes from "@/data/recipes.json";

export default {
  name: "Home",
  components: {
    RecipeCard,
  },
  data() {
    return {
      recipes, 
      selectedCategory: "All", 
      filteredRecipes: recipes, 
    };
  },
  computed: {
    uniqueCategories() {
     
      return [...new Set(this.recipes.map((recipe) => recipe.category))];
    },
  },
  methods: {
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
  },
};
</script>

<style>

.filter {
  margin: 1rem 0;
  display: flex;
  gap: 10px;
}

.filter label {
  margin-top: 3px;
  font-size: 1rem;
  font-weight: bold;
  font-family: 'Montserrat', sans-serif;
}

.filter select {
  padding: 0.2rem;
  font-size: 1rem;
  border-radius: 5px;
  border: 1px solid #ccc;
}

</style>
