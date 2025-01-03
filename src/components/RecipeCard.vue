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
      this.$emit("click");
    },
  },
};
</script>
<style>
.card h3{
  font-family: 'Montserrat', sans-serif;
}
.card p{
  font-family: 'Montserrat', sans-serif;
}
</style>