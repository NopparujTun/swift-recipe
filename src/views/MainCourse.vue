<template>
    <div>
      <Navbar/>
  
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
  import axios from "axios";
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
        recipes: [], 
        filteredRecipes: [], 
      };
    },
    methods: {
      async fetchRecipes() {
        try {
          const response = await axios.get("http://localhost:3000/recipes");
          this.recipes = response.data;
          this.filterRecipes();
        } catch (error) {
          console.error("Error fetching recipes:", error);
        }
      },
      filterRecipes() {
       
        this.filteredRecipes = this.recipes.filter(
          (recipe) => recipe.category === "Main Course"
        );
      },
      viewRecipe(id) {
        this.$router.push({ name: "RecipeDetails", params: { id } });
      },
    },
    async mounted() {
      await this.fetchRecipes();
    },
  };
  </script>
  