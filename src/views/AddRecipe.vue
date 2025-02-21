<template>
    <div class="container">
      <!-- Add Recipe Form -->
      <form @submit.prevent="addRecipe">
        <label class="title">
          Recipe Name
        </label>
        <input type="text" v-model="newRecipe.name" placeholder="" required />
  
        <label class="title">
          Description
        </label>
        <textarea v-model="newRecipe.description" placeholder="" required></textarea>
  
        <label class="title">
          Ingredients (comma-separated)
        </label>
        <textarea v-model="newRecipe.ingredients" placeholder="" required></textarea>
  
        <label class="title">
          Category
        </label>
        <select v-model="newRecipe.category" required>
          <option disabled value="">Select Category</option>
          <option v-for="category in uniqueCategories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
  
        <label class="title">
          Image
        </label>
        <input type="file" @change="handleImageUpload" accept="image/*" required />
  
        <!-- Dynamic Instructions Input -->
        <div class="instructions-input">
          <label>Instructions:</label>
          <div v-for="(instruction, index) in newRecipe.instructions" :key="index" class="instruction-step">
            <!-- Removed the <span> and updated placeholder -->
            <input
              type="text"
              v-model="newRecipe.instructions[index]"
              :placeholder="'Step ' + (index + 1)"
              required
            />
            <!-- Show remove button if there's more than one step -->
            <button type="button" v-if="newRecipe.instructions.length > 1" @click="removeInstructionStep(index)" class="remove">
              Remove
            </button>
          </div>
          <button type="button" @click="addInstructionStep">Add Step</button>
        </div>
  
        <button type="submit" class="addrecipe">Add Recipe</button>
      </form>
    </div>
  </template>
  
  <script>
  import { supabase } from "@/supabase.js";
  
  export default {
    data() {
      return {
        recipes: [],
        newRecipe: {
          name: "",
          description: "",
          ingredients: "",
          // Initialize with 3 empty instruction steps
          instructions: ["", "", ""],
          category: "",
          image: "",
        },
        editingRecipe: null,
        imageFile: null,
      };
    },
    computed: {
      uniqueCategories() {
        return [...new Set(this.recipes.map((recipe) => recipe.category))];
      },
    },
    methods: {
      handleImageUpload(event) {
        this.imageFile = event.target.files[0];
        if (this.imageFile) {
          const imageName = this.imageFile.name.split(".")[0]; // Extract name without extension
          this.newRecipe.image = `/src/assets/${imageName}.jpg`;
        }
      },
  
      addInstructionStep() {
        this.newRecipe.instructions.push("");
      },
  
      removeInstructionStep(index) {
        // Remove the instruction at the given index if there is more than one step
        if (this.newRecipe.instructions.length > 1) {
          this.newRecipe.instructions.splice(index, 1);
        }
      },
  
      async addRecipe() {
        try {
          console.log("Adding new recipe with the following details:", this.newRecipe);
  
          // Process instructions array (filtering out any empty steps)
          const instructionsArray = this.newRecipe.instructions.filter(
            (instruction) => instruction.trim() !== ""
          );
  
          // Insert the main recipe
          const { data: recipeData, error: recipeError } = await supabase
            .from("recipes")
            .insert([
              {
                name: this.newRecipe.name,
                description: this.newRecipe.description,
                image: this.newRecipe.image,
                category: this.newRecipe.category,
                updated_at: new Date().toISOString(),
              },
            ])
            .select("id");
  
          if (recipeError) {
            console.error("Error adding recipe:", recipeError);
            return;
          }
  
          const recipeId = recipeData[0].id;
  
          // Insert ingredients (still comma-separated)
          const ingredientsArray = this.newRecipe.ingredients
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item);
          const { error: ingredientsError } = await supabase
            .from("ingredients")
            .insert(
              ingredientsArray.map((ingredient) => ({ recipe_id: recipeId, ingredient }))
            );
  
          // Insert instructions with step numbers
          const { error: instructionsError } = await supabase
            .from("instructions")
            .insert(
              instructionsArray.map((instruction, index) => ({
                recipe_id: recipeId,
                step_number: index + 1,
                instruction,
              }))
            );
  
          if (ingredientsError) {
            console.error("Error adding ingredients:", ingredientsError);
          }
          if (instructionsError) {
            console.error("Error adding instructions:", instructionsError);
          }
  
          // Clear the form and refresh the recipe list
          this.newRecipe = {
            name: "",
            description: "",
            ingredients: "",
            instructions: ["", "", ""],
            category: "",
            image: "",
          };
          this.imageFile = null;
  
          await this.fetchRecipes(); // Refresh the recipes list after adding
        } catch (error) {
          console.error("Error adding recipe:", error);
        }
      },
  
      async fetchRecipes() {
        try {
          const { data: recipesData, error } = await supabase.from("recipes").select("*");
  
          if (error) {
            console.error("Error fetching recipes:", error);
            return;
          }
  
          // Fetch ingredients and instructions for each recipe
          for (const recipe of recipesData) {
            const { data: ingredientsData } = await supabase
              .from("ingredients")
              .select("ingredient")
              .eq("recipe_id", recipe.id);
  
            const { data: instructionsData } = await supabase
              .from("instructions")
              .select("instruction")
              .eq("recipe_id", recipe.id);
  
            recipe.ingredients = ingredientsData
              .map((item) => item.ingredient)
              .join(", ");
            recipe.instructions = instructionsData
              .map((item) => item.instruction)
              .join(" | ");
          }
  
          this.recipes = recipesData;
        } catch (error) {
          console.error("Error fetching recipes:", error);
        }
      },
    },
    async mounted() {
      await this.fetchRecipes();
    },
  };
  </script>
  
  <style scoped>
  .instructions-input{
    text-align: left;
    font-weight: bold;
  }
  .remove{
    
    padding: 10px 15px;
    font-size: 1rem;
    border: none;
    background-color: #ff4d4d;
    color: white;
    cursor: pointer;
    border-radius: 20px;
    margin-top: -1px;
   
  }
  .container {
    background-color: #E5E5E8;
    padding: 1.5rem;
  }
  .title {
    text-align: left;
    font-weight: bold;
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 20px;
  }
  form input,
  form textarea,
  form select {
    font-size: 1rem;
    padding: 0.8rem;
    border-radius: 20px;
    border: 1px solid #ccc;
    width: 100%;
    box-sizing: border-box;
  }
  form textarea {
    resize: vertical;
    min-height: 100px;
  }
  form button {
    margin-top: 10px;
    padding: 10px 15px;
    font-size: 1rem;
    border: none;
    background-color: #000000;
    color: white;
    cursor: pointer;
    border-radius: 20px;
  }
  form button:hover {
    background-color: #2e2e2e;
  }
  .instructions-input {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .instruction-step {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  form button.addrecipe {
    margin-top: 10px;
    padding: 10px 15px;
    font-size: 1rem;
    border: none;
    background-color: #ff914d;
    color: white;
    cursor: pointer;
    border-radius: 20px;
  }
  * {
    font-family: "Poppins", sans-serif;
  }
  </style>
  