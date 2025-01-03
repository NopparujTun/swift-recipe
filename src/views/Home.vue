<template>
    <div>
      <header>
        <h1>Recipe Manager</h1>
        <p>Your favorite recipes, all in one place.</p>
      </header>
      <nav>
        <a href="#">Home</a>
        <a href="#">Add Recipe</a>
        <a href="#">Search</a>
        <a href="#">Favorites</a>
      </nav>
      <main>
        <h2>Featured Recipes</h2>
        <div class="recipes">
          <RecipeCard
            v-for="recipe in recipes"
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
      };
    },
    methods: {
      viewRecipe(id) {
        this.$router.push({ name: "RecipeDetails", params: { id } });
      },
    },
  };
  </script>
  