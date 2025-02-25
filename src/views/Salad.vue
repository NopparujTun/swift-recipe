<template>
  <div>
    <Navbar />

    <div class="banner">
      <img src="@/assets/banner.jpg" alt="Banner" class="banner-image" />
      <h1 class="banner-text">Salad</h1>
    </div>
    
    <main>
      <div class="search-bar">
        <input
          v-model="searchQuery"
          class="search-input"
          type="text"
          placeholder="Search recipes..."
        />
      </div>
      <div class="recipes">
        <RecipeCard
          v-for="recipe in filteredRecipes"
          :key="recipe.id"
          :recipe="recipe"
        />
      </div>
    </main>

    <BackToTop />
    <Footer/>
  </div>
</template>

<script>
import { supabase } from "@/supabase.js";
import RecipeCard from "@/components/RecipeCard.vue";
import BackToTop from "@/components/BackToTop.vue";
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: "Salad",
  components: {
    Navbar,
    BackToTop,
    RecipeCard,
    Footer,
  },
  data() {
    return {
      saladRecipes: [],  // Holds all salad recipes fetched from the database
      searchQuery: '',   // The search term entered by the user
    };
  },
  computed: {
    // Filters the full list of recipes based on the search query
    filteredRecipes() {
      if (!this.searchQuery) {
        return this.saladRecipes;
      }
      return this.saladRecipes.filter(recipe =>
        recipe.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    async fetchSaladRecipes() {
      try {
        const { data: recipes, error } = await supabase
          .from("recipes")
          .select("*")
          .eq("category", "Salad");

        if (error) {
          console.error("Error fetching recipes:", error);
          return;
        }
        this.saladRecipes = recipes;
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    },
    viewRecipe(id) {
      this.$router.push({ name: "RecipeDetails", params: { id } });
    },
  },
  async mounted() {
    await this.fetchSaladRecipes(); // Fetch salad recipes on mount
  },
};
</script>

<style>
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




.search-input {
  width: 50%;
  padding: 8px;
  font-size: 1rem;
  border-radius: 20px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
}
</style>
