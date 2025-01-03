<template>
  <div id="app">
    <header>
      <h1>Recipe Mandager</h1>
      <p>Your favorite recipes, all in one place.</p>
    </header>
    <nav>
      <a href="#">Hodme</a>
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
import RecipeCard from './components/RecipeCard.vue';
import recipes from './data/recipes.json'; // Import the recipes data

export default {
  name: 'App',
  components: {
    RecipeCard
  },
  data() {
    return {
      recipes // Assign the recipes data to a property
    };
  },
  methods: {
    viewRecipe(id) {
      const recipe = this.recipes.find(r => r.id === id);
      alert(`Viewing recipe: ${recipe.name}`);
    }
  }
};
</script>
