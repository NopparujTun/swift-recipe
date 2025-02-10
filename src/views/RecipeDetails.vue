<template>
  <div>
    <Navbar />

    <header class="recipe-header">
      <h1>{{ recipe.name }}</h1>
      <p class="description">{{ recipe.description }}</p>
    </header>

    <div v-if="recipe" class="container">
      <img :src="recipe.image" :alt="recipe.name" class="recipe-image" />

      <section>
        <h3>Ingredients</h3>
        <ul>
          <li v-for="(ingredient, index) in ingredients" :key="index" class="ingredient-item">
            {{ ingredient.ingredient }}
          </li>
        </ul>
      </section>

      <section>
        <h3>Instructions</h3>
        <ol>
          <li v-for="(instruction, index) in instructions" :key="index" class="step">
            {{ instruction.instruction }}
          </li>
        </ol>
      </section>

      <button @click="goBack" class="back-button">← Back</button>
    </div>

    <div v-else>
      <p>Recipe not found.</p>
      <button @click="goBack">Back</button>
    </div>
  </div>
</template>

<script>
import { supabase } from "@/supabase.js"; // Import Supabase client
import Navbar from "@/components/Navbar.vue";

export default {
  name: "RecipeDetails",
  props: {
    id: Number,
  },
  components: {
    Navbar,
  },
  data() {
    return {
      recipe: null,
      ingredients: [],
      instructions: [],
    };
  },
  async created() {
    await this.loadRecipe();
  },
  methods: {
    async loadRecipe() {
      try {
        // Fetch recipe details
        const { data: recipe, error: recipeError } = await supabase
          .from("recipes")
          .select("*")
          .eq("id", this.id)
          .single();

        if (recipeError) {
          console.error("Error fetching recipe details:", recipeError);
          return;
        }
        this.recipe = recipe;

        // Fetch ingredients
        const { data: ingredients, error: ingredientsError } = await supabase
          .from("ingredients")
          .select("ingredient")
          .eq("recipe_id", this.id);

        if (ingredientsError) {
          console.error("Error fetching ingredients:", ingredientsError);
          return;
        }
        this.ingredients = ingredients;

        // Fetch instructions
        const { data: instructions, error: instructionsError } = await supabase
          .from("instructions")
          .select("step_number, instruction")
          .eq("recipe_id", this.id)
          .order("step_number", { ascending: true });

        if (instructionsError) {
          console.error("Error fetching instructions:", instructionsError);
          return;
        }
        this.instructions = instructions;
      } catch (error) {
        console.error("Unexpected error fetching recipe:", error);
      }
    },
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
.recipe-header {
  margin-bottom: 20px;
}

.recipe-image {
  width: 70%;
  object-fit: cover;
  height: 400px;
  display: block;
  margin: 20px auto;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

section h3 {
  font-size: 1.8rem;
  font-family: "Poppins", sans-serif;
  color: #333;
  margin-bottom: 10px;
}

button {
  --primary-color: linear-gradient(to right, #ff914d, #ff6f61, #ff9370);
  --secondary-color: #fff;
  --hover-color: #111;
  --arrow-width: 8px;
  --arrow-stroke: 4px;
  box-sizing: border-box;
  border: 0;
  border-radius: 20px;
  color: var(--secondary-color);
  padding: 0.9em 1.0em;
  background: var(--primary-color);
  display: flex;
  transition: 0.2s background;
  align-items: center;
  gap: 0.6em;
  font-weight: bold;
  font-family: "Poppins", sans-serif;
  font-size: 0.75rem;
  cursor: pointer;
  
}
* {
  font-family: "Poppins", sans-serif;
}
</style>
