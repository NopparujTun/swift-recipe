<template>
  <div>
    <Navbar />

    <div class="banner">
      <img src="@/assets/banner.jpg" alt="Banner" class="banner-image" />
      <h1 class="banner-text">Breakfast</h1>
    </div>

    <main>
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
  name: "Breakfast",
  components: {
    Navbar,
    BackToTop,
    RecipeCard,
    Footer,
  },
  data() {
    return {
      filteredRecipes: [], // Store only "Salad" recipes
    };
  },
  methods: {
    async fetchBreakfastRecipes() {
      try {
        const { data: recipes, error } = await supabase
          .from("recipes")
          .select("*")
          .eq("category", "Breakfast");

        if (error) {
          console.error("Error fetching recipes:", error);
          return;
        }
        this.filteredRecipes = recipes;
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    },
  },
  async mounted() {
    await this.fetchBreakfastRecipes(); // Fetch salad recipes on mount
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
</style>
