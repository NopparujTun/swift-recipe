<template>
  <div>
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

        <!-- Print Button Section -->
        <section v-if="recipe" class="print-section">
          <button @click="printRecipe" class="print-button">Print Recipe</button>
        </section>

        <section v-if="recipe" class="ingredients-section">
          <h2 class="section-title">Ingredients</h2>
          <ul class="ingredients-list">
            <li
              v-for="(ingredient, index) in ingredients"
              :key="ingredient.id || index"
              class="ingredient-item"
            >
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

        <!-- Review Section wrapped in "no-print" container -->
        <section v-if="recipe" class="no-print">
          <ReviewSection :recipe-id="recipe.id" />
        </section>
      </main>
    </div>
    <Footer />
  </div>
</template>

<script>
import { supabase } from "@/supabase.js";
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import ReviewSection from "@/components/ReviewSection.vue";

export default {
  name: "RecipeDetails",
  components: {
    Navbar,
    Footer,
    ReviewSection,
  },
  data() {
    return {
      recipe: null,
      ingredients: [],
      instructions: [],
      servings: 4,
    };
  },
  async created() {
    await this.loadRecipe();
  },
  methods: {
    async loadRecipe() {
      try {
        // Get the slug from the route parameters (e.g., "khao-tom")
        const slug = this.$route.params.slug;
        // Query for the recipe using the image field.
        // This assumes that the image field ends with "/slug.jpg".
        const { data: recipe, error: recipeError } = await supabase
          .from("recipes")
          .select("*")
          .ilike("image", `%/${slug}.jpg`)
          .single();

        if (recipeError) {
          console.error("Error fetching recipe:", recipeError);
          return;
        }
        this.recipe = recipe;

        if (recipe.servings) {
          this.servings = recipe.servings;
        }

        // Fetch ingredients associated with the recipe
        const { data: ingredients, error: ingredientsError } = await supabase
          .from("ingredients")
          .select("*")
          .eq("recipe_id", recipe.id);

        if (ingredientsError) {
          console.error("Error fetching ingredients:", ingredientsError);
          return;
        }
        this.ingredients = ingredients;

        // Fetch instructions, ordering them by step_number ascending
        const { data: instructions, error: instructionsError } = await supabase
          .from("instructions")
          .select("*")
          .eq("recipe_id", recipe.id)
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
    formatIngredient(ingredient) {
      if (ingredient.multiplier && ingredient.unit) {
        const quantity = this.servings * ingredient.multiplier;
        return `${quantity}${ingredient.unit} ${ingredient.ingredient}`;
      }
      return ingredient.ingredient;
    },
    printRecipe() {
      window.print();
    },
  },
};
</script>

<style scoped>
/* Recipe Detail Container */
.recipe-detail {
  min-height: 100vh;
  background-color: #f9fafb;
  display: flex;
  flex-direction: column;
}

/* Main content container */
.main-content {
  width: 90%;
  margin: 0 auto;
  padding: 16px;
  flex: 1;
}

/* Header Section */
.header-section {
  margin-bottom: 24px;
  text-align: center;
}

.recipe-title {
  font-size: 1.75rem;
  font-weight: bold;
  margin-bottom: 16px;
}

.image-container {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

/* Recipe image fixed at 600px on larger screens, scales on mobile */
.recipe-image {
  width: 100%;
  max-width: 600px;
  height: auto;
  object-fit: cover;
  border-radius: 12px;
}

/* Section Titles */
.section-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 12px;
  text-align: left;
}

/* Ingredients Section */
.ingredients-section,
.instructions-section {
  margin-bottom: 24px;
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
  gap: 8px;
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

/* Instructions Section */
.instructions-list {
  background-color: #ffffff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.instruction-item {
  display: flex;
  gap: 8px;
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

/* Print Section */
.print-section {
  text-align: center;
  margin-bottom: 24px;
}

.print-button {
  background-color: #1a1a1a;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 20px;
  cursor: pointer;
}

.print-button:hover {
  background-color: #333333;
}

/* Loading Text */
.loading {
  text-align: center;
  margin: 40px 0;
  font-size: 1.2rem;
}

/* Tablet & Desktop Styles */
@media (min-width: 768px) {
  .main-content {
    max-width: 1024px;
    padding: 24px;
  }
  .recipe-title {
    font-size: 2.5rem;
    text-align: left;
  }
  .header-section {
    text-align: left;
  }
  .section-title {
    text-align: left;
    font-size: 1.5rem;
  }
}

/* Desktop Larger Screens */
@media (min-width: 1024px) {
  .main-content {
    max-width: 1200px;
    padding: 24px;
  }
}

/* Print-specific styles */
@media print {
  /* Hide elements that aren't needed in print */
  .print-button,
  .navbar,
  .footer,
  .no-print {
    display: none !important;
  }
  
  /* Adjust the layout for print if necessary */
  .main-content {
    width: 100%;
    margin: 0;
    padding: 0;
  }
  .step-number {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
</style>
