<template>
  <div>
    <Navbar />

    <header>
      <h1>Salad</h1>
    </header>

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
  name: "Salad",
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
        this.filteredRecipes = recipes;
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


