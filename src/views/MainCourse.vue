<template>
  <div>
    <Navbar />

    <header>
      <h1>Main Course</h1>
    </header>

    <main>
      <div class="recipes">
        <RecipeCard
          v-for="recipe in filteredRecipes"
          :key="recipe.id"
          :recipe="recipe"
          @click="viewRecipe(recipe.id)"
        />
      </div>
    </main>

    <BackToTop />
    <footer>
      <p>© 2025 Swift Recipe. All rights reserved.</p>
    </footer>
  </div>
</template>

<script>
import { supabase } from "@/supabase.js"; // Import Supabase client
import RecipeCard from "@/components/RecipeCard.vue";
import BackToTop from "@/components/BackToTop.vue";
import Navbar from "@/components/Navbar.vue";

export default {
  name: "MainCourse",
  components: {
    Navbar,
    BackToTop,
    RecipeCard,
  },
  data() {
    return {
      filteredRecipes: [], // Store only "Main Course" recipes
    };
  },
  methods: {
    async fetchMainCourseRecipes() {
      try {
        // Fetch recipes from Supabase where category is "Main Course"
        const { data: recipes, error } = await supabase
          .from("recipes")
          .select("*")
          .eq("category", "Main Course");

        if (error) {
          console.error("Error fetching recipes:", error);
          return;
        }
        this.filteredRecipes = recipes; // Store the main course recipes
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    },
    viewRecipe(id) {
      this.$router.push({ name: "RecipeDetails", params: { id } });
    },
  },
  async mounted() {
    await this.fetchMainCourseRecipes(); // Fetch main course recipes on mount
  },
};
</script>


