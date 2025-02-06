<template>
  <div>
    <Navbar/>

    <header class="home">
  <div class="header-content">
    <h1>Welcome To Swift Recipe</h1>
    <p>Your simplest and quickest food recipes, all in one place.</p>
  </div>
  <div class="header-logo">
    <img src="/src/assets/header.jpg" alt="Swift Recipe Logo" />
  </div>
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
        <h2>Latest Recipes</h2>
        <div class="recipes">
          <RecipeCard
            v-for="recipe in latestRecipes"
            :key="recipe.id"
            :recipe="recipe"
            @click="viewRecipe(recipe.id)"
          />
        </div>
        <button class="view-all-button" @click="viewAllRecipes">
          View All Recipes
        </button>

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
import Navbar from "@/components/Navbar.vue";
import axios from "axios";

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
      filteredRecipes: [],
      christmasRecipes: [], 
      isMenuOpen: false,
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
        filtered = filtered.filter(
          (recipe) => recipe.category === this.selectedCategory
        );
      }

      // Filter by search query
      if (this.searchQuery) {
        filtered = filtered.filter((recipe) =>
          recipe.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }

      return filtered;
    },
    // Get the latest 6 recipes
    latestRecipes() {
      return this.recipes.slice(-6);
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
viewAllRecipes() {
    this.$router.push('/recipes/all');
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
  font-family: "Poppins", sans-serif;
}
section h2{
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: #333;
  font-family: "Poppins", sans-serif;
}
.recipes {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}


* {
  font-family: "Poppins", sans-serif;
}
.view-all-button {
  margin-top: 30px;
  padding: 10px 20px;
  font-size: 1rem;
  background: linear-gradient(to right, #ff914d, #ff6f61, #ff9370);
  border-radius: 20px;
  border: none;
  color: white;
  cursor: pointer;
  display: block;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  font-family: "Poppins", sans-serif;
  font-weight: bold;
  transition: all 0.3s ease-in-out;
  border: 2px solid transparent;
}

.view-all-button:hover {
  background: white;
  color: #ff6f61;
  border: 2px solid transparent;
  background-clip: padding-box;
  position: relative;
}

.view-all-button:hover::before {
  content: "";
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 20px;
  background: linear-gradient(to right, #ff914d, #ff6f61, #ff9370);
  z-index: -1;
}




</style>
