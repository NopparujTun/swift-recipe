<template>
  <div class="card" @click="viewDetails">
    <img :src="recipe.image" :alt="recipe.name" />
    <h3>{{ recipe.name }}</h3>
    <p>{{ recipe.description }}</p>
  </div>
</template>

<script>
export default {
  name: "RecipeCard",
  props: {
    recipe: Object,
  },
  methods: {
    viewDetails() {
      this.$emit("click"); // Emit click event to parent
    },
  },
};
</script>
