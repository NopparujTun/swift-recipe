<template>
  <Navbar />
  <div class="recipe-detail">
    
    <main class="main-content">
      <div v-if="recipe" class="header-section">
        <h1 class="recipe-title">{{ recipe.name }}</h1>
        <div class="image-container">
          <img :src="recipe.image" :alt="recipe.name" class="recipe-image" />
        </div>
      </div>
      <div v-else class="loading">
        <p>Loading recipe...</p>
      </div>

      <section v-if="recipe" class="ingredients-section">
        <h2 class="section-title">Ingredients</h2>
        <ul class="ingredients-list">
          <li
            v-for="(ingredient, index) in ingredients"
            :key="ingredient.id || index"
            class="ingredient-item"
          >
            <input type="checkbox" class="checkbox" />
            <span class="ingredient-text">
              {{ formatIngredient(ingredient) }}
            </span>
          </li>
        </ul>
      </section>

      <section v-if="recipe" class="instructions-section">
        <h2 class="section-title">Instructions</h2>
        <div class="instructions-list">
          <div
            v-for="(instruction, index) in instructions"
            :key="instruction.id || index"
            class="instruction-item"
          >
            <div class="step-number">{{ instruction.step_number }}</div>
            <p class="instruction-text">{{ instruction.instruction }}</p>
          </div>
        </div>
      </section>
      <section v-if="recipe">
        <ReviewSection :recipe-id="id" />
      </section>
    </main>
    
  </div>
  <Footer />
</template>

<script>
import { supabase } from "@/supabase.js";
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import ReviewSection from "@/components/ReviewSection.vue";
export default {
  name: "RecipeDetail",
  components: {
    Navbar,
    Footer,
    ReviewSection,
  },
  props: {
    // The recipe id should be passed as a prop
    id: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      recipe: null,
      ingredients: [],
      instructions: [],
      servings: 4, // default value; can be overwritten if recipe data includes servings
    };
  },
  async created() {
    await this.loadRecipe();
  },
  methods: {
    async loadRecipe() {
      try {
        // Fetch the recipe details
        const { data: recipe, error: recipeError } = await supabase
          .from("recipes")
          .select("*")
          .eq("id", this.id)
          .single();

        if (recipeError) {
          console.error("Error fetching recipe:", recipeError);
          return;
        }
        this.recipe = recipe;

        // Optionally update servings if your recipe data contains that field
        if (recipe.servings) {
          this.servings = recipe.servings;
        }

        // Fetch the ingredients for this recipe
        const { data: ingredients, error: ingredientsError } = await supabase
          .from("ingredients")
          .select("*")
          .eq("recipe_id", this.id);

        if (ingredientsError) {
          console.error("Error fetching ingredients:", ingredientsError);
          return;
        }
        this.ingredients = ingredients;

        // Fetch the instructions for this recipe
        const { data: instructions, error: instructionsError } = await supabase
          .from("instructions")
          .select("*")
          .eq("recipe_id", this.id)
          .order("step_number", { ascending: true });

        if (instructionsError) {
          console.error("Error fetching instructions:", instructionsError);
          return;
        }
        this.instructions = instructions;
      } catch (error) {
        console.error("Unexpected error loading recipe:", error);
      }
    },
    // Formats the ingredient text, multiplying quantities if needed.
    formatIngredient(ingredient) {

      if (ingredient.multiplier && ingredient.unit) {
        const quantity = this.servings * ingredient.multiplier;
        return `${quantity}${ingredient.unit} ${ingredient.ingredient}`;
      }
      return ingredient.ingredient;
    },
  },
};
</script>

<style scoped>
.recipe-detail {
  min-height: 100vh;
  background-color: #f9fafb; 
  display: flex;
  flex-direction: column;
}

.main-content {
  max-width: 1024px; 
  margin: 0 auto;
  padding: 24px; 
  flex: 1;
}

.header-section {
  margin-bottom: 32px;
}

.recipe-title {
  font-size: 2.5rem; 
  font-weight: bold;
  margin-bottom: 16px;
  text-align: left;
}

.image-container {
  margin-bottom: 16px;
}

.recipe-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 12px;
}

.section-title {
  font-size: 1.5rem; 
  font-weight: bold;
  margin-bottom: 16px;
  text-align: left;
}

.ingredients-section,
.instructions-section {
  margin-bottom: 32px;
}

.ingredients-list {
  list-style: none;
  padding: 16px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 0;
}

.ingredient-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid #e5e7eb;
}

.ingredient-item:last-child {
  border-bottom: none;
}

.checkbox {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.instructions-list {
  background-color: #ffffff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.instruction-item {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 16px;
  text-align: left;
}

.instruction-item:last-child {
  margin-bottom: 0;
}

.step-number {
  width: 32px;
  height: 32px;
  background-color: #1a1a1a;
  color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.instruction-text {
  flex: 1;
  margin: 0;
  line-height: 1.5;
}

.loading {
  text-align: center;
  margin: 40px 0;
  font-size: 1.2rem;
}
</style>
