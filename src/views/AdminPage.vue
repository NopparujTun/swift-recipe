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
      <p>Selected Image Path: {{ newRecipe.image }}</p> <!-- Display image path -->
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
  </div>
</template>

---

### **Script Section**
```js
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
        instructions: "",
        category: "",
        image: "",
      },
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
        // Extract the image name without extension
        const imageName = this.imageFile.name.split(".")[0]; // "newpics" if "newpics.jpg"
        this.newRecipe.image = `/src/assets/${imageName}.jpg`; // Set the path to the image
        console.log("Image path set to:", this.newRecipe.image);
      }
    },
    async addRecipe() {
      try {
        const ingredientsArray = this.newRecipe.ingredients.split(",").map((item) => item.trim());
        const instructionsArray = this.newRecipe.instructions.split(",").map((item) => item.trim());

        const { data, error } = await supabase.from("recipes").insert([
          {
            name: this.newRecipe.name,
            description: this.newRecipe.description,
            image: this.newRecipe.image, // Store the constructed path (e.g., "/src/assets/newpics.jpg")
            category: this.newRecipe.category,
          },
        ]).select();

        if (error) {
          console.error("Error adding recipe:", error);
          return;
        }

        const recipeId = data[0].id;
        await supabase.from("ingredients").insert(ingredientsArray.map((ingredient) => ({ recipe_id: recipeId, ingredient })));
        await supabase.from("instructions").insert(instructionsArray.map((instruction, index) => ({ recipe_id: recipeId, step_number: index + 1, instruction })));


        await this.fetchRecipes(); // Refresh recipes to reflect the new addition
        this.newRecipe = { name: "", description: "", ingredients: "", instructions: "", category: "", image: "" };
      } catch (error) {
        console.error("Error adding recipe:", error);
      }
    },
    async fetchRecipes() {
      const { data, error } = await supabase.from("recipes").select("*").order("id", { ascending: true });
      if (error) {
        console.error("Error fetching recipes:", error);
      } else {
        this.recipes = data;
      }
    },
    async editRecipe(recipe) {
      this.editingRecipe = {
        ...recipe,
        ingredients: recipe.ingredients.join(", "),
        instructions: recipe.instructions.join(", "),
      };
    },
    async saveRecipe() {
      try {
        const ingredientsArray = this.editingRecipe.ingredients.split(",").map((item) => item.trim());
        const instructionsArray = this.editingRecipe.instructions.split(",").map((item) => item.trim());

        await supabase.from("recipes").update({
          name: this.editingRecipe.name,
          description: this.editingRecipe.description,
          image: this.editingRecipe.image,
          category: this.editingRecipe.category,
        }).eq("id", this.editingRecipe.id);

        await supabase.from("ingredients").delete().eq("recipe_id", this.editingRecipe.id);
        await supabase.from("instructions").delete().eq("recipe_id", this.editingRecipe.id);

        await supabase.from("ingredients").insert(ingredientsArray.map((ingredient) => ({ recipe_id: this.editingRecipe.id, ingredient })));
        await supabase.from("instructions").insert(instructionsArray.map((instruction, index) => ({ recipe_id: this.editingRecipe.id, step_number: index + 1, instruction })));

        await this.fetchRecipes();
        this.editingRecipe = null;
      } catch (error) {
        console.error("Error saving recipe:", error);
      }
    },
    cancelEdit() {
      this.editingRecipe = null;
    },
    async deleteRecipe(id) {
      await supabase.from("recipes").delete().eq("id", id);
      await supabase.from("ingredients").delete().eq("recipe_id", id);
      await supabase.from("instructions").delete().eq("recipe_id", id);
      await this.fetchRecipes();
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
