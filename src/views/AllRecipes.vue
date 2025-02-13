<template>
  <div>
    <Navbar />

    <div class="banner">
      <img src="@/assets/banner.jpg" alt="Banner" class="banner-image" />
      <h1 class="banner-text">All Recipes</h1>
    </div>

    <main class="container">
      
      <div class="search-filter-container">
        <aside class="filter-section">
          <h2>Filters</h2>
          <div class="filter">
            <label for="category">Filter by Type:</label>
            <select id="category" v-model="selectedCategory" @change="filterRecipes">
              <option value="All">All</option>
              <option v-for="category in uniqueCategories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
        </aside>

        <div class="search-bar">
          <input
            v-model="searchQuery"
            class="search-input"
            type="text"
            placeholder="Search recipes..."
          />
        </div>
      </div>

      <!-- Recipe List -->
      <section class="recipe-list">
        <RecipeCard
          v-for="recipe in filteredRecipes"
          :key="recipe.id"
          :recipe="recipe"
          @click="viewRecipe(recipe.id)"
        />
      </section>
    </main>

    <footer class="footer">
      <p>© 2025 Swift Recipe. All rights reserved.</p>
    </footer>
  </div>
</template>


<script>
import RecipeCard from "@/components/RecipeCard.vue";
import Navbar from "@/components/Navbar.vue";
import { supabase } from "../supabase.js"; 

export default {
  name: "Home",
  components: {
    Navbar,
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

      if (this.selectedCategory !== "All") {
        filtered = filtered.filter((recipe) => recipe.category === this.selectedCategory);
      }

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
        const { data: recipes, error } = await supabase.from("recipes").select("*").order("id", { ascending: true });
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
    await this.loadRecipes();
  },
};
</script>

<style scoped>

.header {
  text-align: center;
  position: relative;
}

.search-bar {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.search-input {
  width: 50%;
  padding: 10px;
  font-size: 1rem;
  border-radius: 20px;
  border: 1px solid #ccc;
}
.banner {
  position: relative;
  text-align: center;
}

.banner-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  display: block;
}

.banner-text {
  position: absolute;
  top: 43%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #333;
  font-size: 2.5rem;
  font-weight: bold;
  
}

main {
  max-width: 1600px;
  margin: 2rem auto;
  padding: 1rem;
  text-align: center;
}

.container {
  display: flex;
  align-items: flex-start;
  padding: 20px;
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
    align-items: center;
  }

  .recipe-list {
    grid-template-columns: 1fr !important;
    
  }
  .filter-section {
  width: 300px;
  padding: 15px;
  background: #f4f4f4;
  border-radius: 20px;
  margin-bottom: 20px;
}
}

.filter-section {
  width: 300px;
  padding: 15px;
  background: #f4f4f4;
  border-radius: 20px;
  margin-bottom: 20px;
}

.filter-section h2 {
  font-size: 1.2rem;
  
  text-align: left;
}

.filter {
  margin-bottom: 15px;
}

.filter label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  text-align: left;
}

.filter select {
  width: 100%;
  padding: 8px;
  font-size: 1rem;
  border-radius: 20px;
  border: 1px solid #ccc;
}

.search-container {
  margin-top: 10px;
}

.search-input {
  width: 94%;
  padding: 8px;
  font-size: 1rem;
  border-radius: 20px;
  border: 1px solid #ccc;
}

.recipe-list {
  margin-top: -10px;
  flex-grow: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  
}


</style>
