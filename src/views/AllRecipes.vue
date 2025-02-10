<template>
  <div>
    <Navbar />

    <header>
      <h1>All Recipes</h1>
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

      <div class="InputContainer">
        <input
          v-model="searchQuery"
          class="input"
          type="text"
          placeholder="Search for recipes..."
        />
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
  </div>
</template>

<script>
import RecipeCard from "@/components/RecipeCard.vue";
import BackToTop from "@/components/BackToTop.vue";
import Navbar from "@/components/Navbar.vue";
import { supabase } from "../supabase.js"; // Import Supabase client

export default {
  name: "Home",
  components: {
    Navbar,
    BackToTop,
    RecipeCard,
  },
  data() {
    return {
      recipes: [],
      selectedCategory: "All",
      searchQuery: "",
    };
  },
  computed: {
    uniqueCategories() {
      return [...new Set(this.recipes.map((recipe) => recipe.category))];
    },
    filteredRecipes() {
      let filtered = this.recipes;

      // Filter by category
      if (this.selectedCategory !== "All") {
        filtered = filtered.filter((recipe) => recipe.category === this.selectedCategory);
      }

      // Filter by search query
      if (this.searchQuery) {
        filtered = filtered.filter((recipe) =>
          recipe.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }

      return filtered;
    },
  },
  methods: {
    async loadRecipes() {
      try {
        const { data: recipes, error } = await supabase
          .from("recipes")
          .select("*")
          .order("id", { ascending: true }); // Ensure consistent order by `id`

        if (error) {
          console.error("Error fetching recipes:", error);
          return;
        }
        this.recipes = recipes;
      } catch (error) {
        console.error("Error loading recipes:", error);
      }
    },
    viewRecipe(id) {
      this.$router.push({ name: "RecipeDetails", params: { id } });
    },
  },
  async mounted() {
    await this.loadRecipes(); // Load recipes from Supabase
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
  font-family: "Poppins", sans-serif;
}

.filter select {
  padding: 0.2rem;
  font-size: 1rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-family: "Poppins", sans-serif;
}

.InputContainer {
  width: 300px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to bottom, rgb(255, 174, 108), rgb(255, 230, 191));
  border-radius: 30px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
}

.input {
  width: 280px;
  height: 40px;
  border: none;
  outline: none;
  caret-color: rgb(255, 81, 0);
  background-color: rgb(255, 255, 255);
  border-radius: 30px;
  padding-left: 15px;
  letter-spacing: 0.8px;
  color: rgb(19, 19, 19);
  font-size: 15px;
}

* {
  font-family: "Poppins", sans-serif;
}
</style>
