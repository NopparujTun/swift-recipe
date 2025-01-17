<template>
    <div>
      <h1>{{ category }} Recipes</h1>
      <ul>
        <li v-for="recipe in filteredRecipes" :key="recipe.id">{{ recipe.name }}</li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      category: String,
    },
    computed: {
      filteredRecipes() {
        return this.$store.state.recipes.filter(
          (recipe) => recipe.category.toLowerCase() === this.category.toLowerCase()
        );
      },
    },
  };
  </script>
  