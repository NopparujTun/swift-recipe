<template>
  <div>
    <Navbar />

    <header class="home">
      <div class="header-content">
        <h1>Welcome To SwiftRecipe</h1>
        <p>Your simplest and quickest food recipes, all in one place.</p>
      </div>
      <div class="header-logo">
        <img src="/src/assets/header.jpg" alt="Swift Recipe Logo" />
      </div>
    </header>

    <main>
      <!-- Popular Recipes Section -->
      <section class="popular-section">
        <h2>Popular Recipes</h2>
        <!-- Spinner shown while loading popular recipes initially -->
        <div v-if="loadingPopular" class="spinner-container">
          <div class="spinner"></div>
        </div>
        <div v-else class="popular-recipes">
          <div
            v-for="(recipe, index) in popularRecipes"
            :key="recipe.id"
            class="popular-card-wrapper"
          >
            <div class="rank-icon">
              <img :src="getRankIcon(index)" :alt="`Rank ${index + 1}`" />
            </div>
            <RecipeCard :recipe="recipe" class="popular-card" />
          </div>
        </div>
      </section>

      <!-- Latest Recipes Section -->
      <section>
        <h2>Latest Recipes</h2>
        <div class="recipes">
          <RecipeCard
            v-for="recipe in latestRecipes"
            :key="recipe.id"
            :recipe="recipe"
          />
        </div>
        <button class="view-all-button" @click="viewAllRecipes">
          View All Recipes
        </button>
      </section>
      <BackToTop />
    </main>

    <Footer />
  </div>
</template>

<script>
import RecipeCard from "@/components/RecipeCard.vue";
import BackToTop from "@/components/BackToTop.vue";
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import { supabase } from "@/supabase.js";

export default {
  name: "Home",
  components: {
    Navbar,
    BackToTop,
    Footer,
    RecipeCard,
  },
  data() {
    return {
      recipes: [],
      popularRecipes: [],
      loadingPopular: false, 
    };
  },
  computed: {
    latestRecipes() {
      // Return the latest 8 recipes to display
      return this.recipes.slice(0, 8);
    },
  },
  methods: {
    async loadRecipes() {
      try {
        const { data: recipes, error } = await supabase
          .from("recipes")
          .select("*")
          .is("deleted_at", null)
          .order("id", { ascending: false }) // Newest first
          .limit(8);
        if (error) {
          console.error("Error fetching recipes:", error);
          return;
        }
        this.recipes = recipes;
      } catch (error) {
        console.error("Error loading recipes:", error);
      }
    },
    async loadPopularRecipes() {
      try {
        this.loadingPopular = true;

        // Try to load from cache first for fast rendering
        const cachedData = localStorage.getItem("popular_recipes");
        const cacheTimestamp = localStorage.getItem("popular_recipes_timestamp");
        const cacheExpiry = 1800 * 1000; // 30 minutes

        if (cachedData && cacheTimestamp && Date.now() - cacheTimestamp < cacheExpiry) {
          this.popularRecipes = JSON.parse(cachedData);
          console.log("Loaded popular recipes from cache!");
          // Revalidate in background
          this.fetchAndUpdatePopularRecipes();
        } else {
          // No valid cache? Fetch from Supabase immediately
          await this.fetchAndUpdatePopularRecipes();
        }

        this.loadingPopular = false;
      } catch (error) {
        console.error("Error loading popular recipes:", error);
        this.loadingPopular = false;
      }
    },
    async fetchAndUpdatePopularRecipes() {
      console.log("Fetching popular recipes from Supabase...");
      const { data: recipesData, error: recipesError } = await supabase
        .from("recipes")
        .select("*")
        .is("deleted_at", null);

      if (recipesError) {
        console.error("Error fetching recipes:", recipesError);
        return;
      }

      // Get like count for each recipe
      const recipesWithLikes = await Promise.all(
        recipesData.map(async (recipe) => {
          const { count, error: countError } = await supabase
            .from("favorite_recipes")
            .select("*", { count: "exact", head: true })
            .eq("recipe_id", recipe.id);
          if (countError) {
            console.error(`Error fetching like count for recipe ${recipe.id}:`, countError);
            return { ...recipe, likes: 0 };
          }
          return { ...recipe, likes: count || 0 };
        })
      );

      // Sort recipes by like count (descending) and select top 3
      recipesWithLikes.sort((a, b) => b.likes - a.likes);
      const freshPopularRecipes = recipesWithLikes.slice(0, 3);

      // Only update if data has changed
      if (JSON.stringify(freshPopularRecipes) !== JSON.stringify(this.popularRecipes)) {
        this.popularRecipes = freshPopularRecipes;
        // Update the cache
        localStorage.setItem("popular_recipes", JSON.stringify(this.popularRecipes));
        localStorage.setItem("popular_recipes_timestamp", Date.now());
        console.log("Popular recipes updated and cached!");
      } else {
        console.log("Popular recipes remain unchanged.");
      }
    },
    viewRecipe(id) {
      this.$router.push({ name: "RecipeDetails", params: { id } });
    },
    viewAllRecipes() {
      this.$router.push("/recipes/all");
    },
    getRankIcon(index) {
      switch (index) {
        case 0:
          return "/first.png";
        case 1:
          return "/second.png";
        case 2:
          return "/third.png";
        default:
          return "";
      }
    },
  },
  async mounted() {
    await this.loadRecipes(); // Load latest recipes
    await this.loadPopularRecipes(); // Load popular recipes with stale-while-revalidate pattern
  },
};
</script>

<style scoped>
section {
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 10px;
}
section h2 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: #1a1a1a;
  font-family: "Poppins", sans-serif;
}

.recipes {
  gap: 10px;
  background-color: #f5f5f5;
}

/* Styles for Popular Recipes Section */
.popular-section {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 40px;
}

.popular-recipes {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 20px;
}

.popular-card-wrapper {
  position: relative;
}

.rank-icon {
  position: absolute;
  top: -10px;
  left: -10px;
  width: 50px;
  height: 50px;
  z-index: 1;
}

.rank-icon img {
  width: 100%;
  height: auto;
}

* {
  font-family: "Poppins", sans-serif;
}

.view-all-button {
  margin-top: 30px;
  padding: 10px 20px;
  font-size: 1rem;
  background: #1a1a1a;
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
  color: #1a1a1a;
  border: 2px solid black;
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
  background: #1a1a1a;
  z-index: -1;
}

.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px; 
}

.spinner {
  border: 8px solid #f3f3f3;
  border-top: 8px solid #1a1a1a;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 600px) {
  .popular-recipes {
    flex-direction: column;
    gap: 10px;
    align-items: center;
  }
  .popular-card-wrapper {
    width: 90%;
  }
}
</style>
