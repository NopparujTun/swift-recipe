<template>
  <div v-if="recipe" class="recipe-details">
    <header>
      <h1>{{ recipe.name }}</h1>
      <p>{{ recipe.description }}</p>
    </header>
    <img :src="recipe.image" :alt="recipe.name" />
    <h3>Ingredients</h3>
    <ul>
      <li v-for="(ingredient, index) in recipe.ingredients" :key="index">
        {{ ingredient }}
      </li>
    </ul>
    <h3>Instructions</h3>
    <ol>
      <li v-for="(step, index) in recipe.instructions" :key="index">
        {{ step }}
      </li>
    </ol>
    <button @click="goBack">Go Back</button>
  </div>
  <div v-else>
    <p>Recipe not found.</p>
    <button @click="goBack">Go Back</button>
  </div>
</template>

<script>
import recipes from "@/data/recipes.json";

export default {
  name: "RecipeDetails",
  props: {
    id: Number,
  },
  data() {
    return {
      recipe: null, // Store the current recipe
    };
  },
  created() {
    // Fetch the recipe based on the ID
    this.recipe = recipes.find((recipe) => recipe.id === this.id);
  },
  methods: {
    goBack() {
      this.$router.push("/"); // Navigate back to the home page
    },
  },
};
</script>

<style scoped>
.recipe-details {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: left;
}

.recipe-details img {
  width: 100%;
  border-radius: 8px;
  margin: 20px 0;
}

.recipe-details h1 {
  color: #333;
}

.recipe-details ul,
.recipe-details ol {
  margin: 20px 0;
  padding-left: 20px;
}
</style>
