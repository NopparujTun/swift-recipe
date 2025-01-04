<template>
    <div class="admin-page">
      <header>
        <h1>Admin Panel</h1>
      </header>
  
      <!-- Add Recipe Form -->
      <form @submit.prevent="addRecipe">
        <input type="text" v-model="newRecipe.name" placeholder="Recipe Name" required />
        <textarea v-model="newRecipe.description" placeholder="Description" required></textarea>
        <textarea v-model="newRecipe.ingredients" placeholder="Ingredients (comma-separated)" required></textarea>
        <textarea v-model="newRecipe.instructions" placeholder="Instructions (comma-separated)" required></textarea>
        <select v-model="newRecipe.category" required>
          <option disabled value="">Select Category</option>
          <option v-for="category in uniqueCategories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
        <input type="file" @change="handleImageUpload" accept="image/*" required />
        <button type="submit">Add Recipe</button>
      </form>
  
      <!-- Recipes Table -->
      <h3>Manage Recipes</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="recipe in recipes" :key="recipe.id">
            <td>{{ recipe.name }}</td>
            <td>{{ recipe.description }}</td>
            <td>{{ recipe.category }}</td>
            <td>
              <button @click="editRecipe(recipe)">Edit</button>
              <button @click="deleteRecipe(recipe.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Edit Modal -->
      <div v-if="editingRecipe" class="modal">
        <h3>Edit Recipe</h3>
        <input type="text" v-model="editingRecipe.name" placeholder="Recipe Name" required />
        <textarea v-model="editingRecipe.description" placeholder="Description" required></textarea>
        <textarea v-model="editingRecipe.ingredients" placeholder="Ingredients (comma-separated)" required></textarea>
        <textarea v-model="editingRecipe.instructions" placeholder="Instructions (comma-separated)" required></textarea>
        <select v-model="editingRecipe.category" required>
          <option disabled value="">Select Category</option>
          <option v-for="category in uniqueCategories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
        <input type="file" @change="handleEditImageUpload" accept="image/*" />
        <button @click="saveRecipe">Save Changes</button>
        <button @click="cancelEdit">Cancel</button>
      </div>
    </div>
  </template>
  
  
  
  
  <script>
import recipesData from "@/data/recipes.json";

export default {
  name: "AdminPage",
  data() {
    return {
      recipes: this.loadRecipes(),
      newRecipe: {
        name: "",
        description: "",
        ingredients: "",
        instructions: "",
        category: "",
        image: "",
      },
      editingRecipe: null,
    };
  },
  computed: {
    uniqueCategories() {
      return [...new Set(this.recipes.map((recipe) => recipe.category))];
    },
  },
  methods: {
    addRecipe() {
      const newId = this.recipes.length + 1;
      const ingredientsArray = this.newRecipe.ingredients.split(",").map((item) => item.trim());
      const instructionsArray = this.newRecipe.instructions.split(",").map((item) => item.trim());

      this.recipes.push({ ...this.newRecipe, id: newId, ingredients: ingredientsArray, instructions: instructionsArray });
      this.newRecipe = { name: "", description: "", ingredients: "", instructions: "", category: "", image: "" };
      this.saveRecipes();
    },
    editRecipe(recipe) {
      this.editingRecipe = { ...recipe, ingredients: recipe.ingredients.join(", "), instructions: recipe.instructions.join(", ") };
    },
    saveRecipe() {
      const index = this.recipes.findIndex((r) => r.id === this.editingRecipe.id);
      if (index !== -1) {
        const updatedRecipe = {
          ...this.editingRecipe,
          ingredients: this.editingRecipe.ingredients.split(",").map((item) => item.trim()),
          instructions: this.editingRecipe.instructions.split(",").map((item) => item.trim()),
        };

        this.recipes.splice(index, 1, updatedRecipe);
        this.saveRecipes();
        this.editingRecipe = null;
      }
    },
    cancelEdit() {
      this.editingRecipe = null;
    },
    deleteRecipe(id) {
      this.recipes = this.recipes.filter((recipe) => recipe.id !== id);
      this.saveRecipes();
    },
    saveRecipes() {
      localStorage.setItem("recipes", JSON.stringify(this.recipes));
    },
    loadRecipes() {
      const savedRecipes = localStorage.getItem("recipes");
      return savedRecipes ? JSON.parse(savedRecipes) : [...recipesData];
    },
  },
};
</script>

  
  
<style scoped>
.admin-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
header {
    margin-bottom: 20px;
}
header h1 {
  text-align: center;
  margin-bottom: 20px;
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
  font-size: 1.2rem; 
  padding: 0.8rem; 
  border-radius: 6px; 
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
  font-size: 1.2rem; 
  border: none;
  background-color: #ff6f61;
  color: white;
  cursor: pointer;
  border-radius: 6px;
}

form button:hover {
  background-color: #ff5239;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

table th,
table td {
  border: 1px solid #ccc;
  padding: 12px; 
  text-align: left;
  font-size: 1rem;
}

button {
  margin-right: 10px;
  padding: 8px 12px;
  font-size: 1rem; 
  border: none;
  background-color: #ff6f61;
  color: white;
  cursor: pointer;
  border-radius: 6px;
  margin-bottom: 5px;
}

button:hover {
  background-color: #ff5239;
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.modal input,
.modal textarea,
.modal select {
  font-size: 1.2rem; 
  padding: 0.8rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  width: 90%;
  margin-bottom: 15px; 
  box-sizing: border-box;
}

.modal button {
  padding: 10px 15px;
  font-size: 1.2rem;
  border: none;
  background-color: #ff6f61;
  color: white;
  cursor: pointer;
  border-radius: 6px;
}

.modal button:hover {
  background-color: #ff5239;
}
</style>

  