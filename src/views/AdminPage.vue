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
  <button class="logout-button" @click="logout">Log Out</button>
  <button @click="goHome">Go to Home</button>
</template>

<script>
import axios from "axios";

export default {
  name: "AdminPage",
  data() {
  return {
    recipes: [],
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
    async fetchRecipes() {
      try {
        const response = await axios.get("http://localhost:3000/recipes");
        this.recipes = response.data;
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          this.newRecipe.image = reader.result; // Base64 string
        };
        reader.readAsDataURL(file);
      }
    },
    async addRecipe() {
  try {
    // Step 1: Fetch all recipes to determine the current highest `id`
    const response = await axios.get("http://localhost:3000/recipes");
    const recipes = response.data;

    // Step 2: Find the highest `id`
    const maxId = recipes.length > 0 ? Math.max(...recipes.map((recipe) => recipe.id)) : 0;

    // Step 3: Create the new recipe with `id = maxId + 1`
    const ingredientsArray = this.newRecipe.ingredients.split(",").map((item) => item.trim());
    const instructionsArray = this.newRecipe.instructions.split(",").map((item) => item.trim());
    const newRecipe = {
      id: maxId + 1, // Assign the next `id` manually
      ...this.newRecipe,
      ingredients: ingredientsArray,
      instructions: instructionsArray,
    };

    // Step 4: Send the new recipe to JSON Server
    const postResponse = await axios.post("http://localhost:3000/recipes", newRecipe);
    this.recipes.push(postResponse.data);

    // Reset the form
    this.newRecipe = { name: "", description: "", ingredients: "", instructions: "", category: "", image: "" };
  } catch (error) {
    console.error("Error adding recipe:", error);
  }
}
,
    editRecipe(recipe) {
      this.editingRecipe = { ...recipe, ingredients: recipe.ingredients.join(", "), instructions: recipe.instructions.join(", ") };
    },
    async saveRecipe() {
      try {
        const updatedRecipe = {
          ...this.editingRecipe,
          ingredients: this.editingRecipe.ingredients.split(",").map((item) => item.trim()),
          instructions: this.editingRecipe.instructions.split(",").map((item) => item.trim()),
        };

        await axios.put(`http://localhost:3000/recipes/${this.editingRecipe.id}`, updatedRecipe);
        const index = this.recipes.findIndex((r) => r.id === this.editingRecipe.id);
        if (index !== -1) {
          this.recipes.splice(index, 1, updatedRecipe);
        }
        this.editingRecipe = null;
      } catch (error) {
        console.error("Error saving recipe:", error);
      }
    },
    cancelEdit() {
      this.editingRecipe = null;
    },
    async deleteRecipe(id) {
      try {
        await axios.delete(`http://localhost:3000/recipes/${id}`);
        this.recipes = this.recipes.filter((recipe) => recipe.id !== id);
      } catch (error) {
        console.error("Error deleting recipe:", error);
      }
    },
    logout() {
      localStorage.removeItem("isAuthenticated");
      this.$router.push("/login");
    },
    goHome() {
      this.$router.push("/");
    },
  },
  async mounted() {
    await this.fetchRecipes();
  },
};
</script>




<style scoped>
.admin-page {
max-width: 800px;
margin: 0 auto;
padding: 20px;
font-family: "Poppins", sans-serif;
}
header {
  margin-bottom: 20px;
  font-family: "Poppins", sans-serif;
}
header h1 {
text-align: center;
margin-bottom: 20px;
font-family: "Poppins", sans-serif;
}

form {
display: flex;
flex-direction: column;
gap: 15px;
margin-bottom: 20px;
font-family: "Poppins", sans-serif;
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
font-family: "Poppins", sans-serif;
}

form textarea {
resize: vertical; 
min-height: 100px;
font-family: "Poppins", sans-serif;
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
* {
  font-family: "Poppins", sans-serif;
}
</style>

