<template>
  <div class="recipes-table">
    <div class="table-header">
      <h2>Recipes</h2>
      <button @click="navigateToAddRecipe">Add Recipe</button>
    </div>
    <div class="filter-section">
      <label>Filter by category:</label>
      <select v-model="selectedCategory">
        <option value="All">All</option>
        <option value="Main Course">Main Course</option>
        <option value="Dessert">Dessert</option>
        <option value="Salad">Salad</option>
        <option value="Breakfast">Breakfast</option>
        <option value="Vegetarian">Vegetarian</option>
      </select>
    </div>
    <table>
      <thead>
        <tr>
          <th>Recipe Name</th>
          <th>Category</th>
          <th>Updated At</th>
          <th>Likes</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="recipe in paginatedRecipes" :key="recipe.id">
          <td>{{ recipe.name }}</td>
          <td>{{ recipe.category }}</td>
          <td>{{ formatDate(recipe.updated_at) }}</td>
          <td>{{ recipe.likes }}</td>
          <td>
            <button @click="editRecipe(recipe)" class="editbutton">Edit</button>
            <button @click="confirmDelete(recipe)" class="deletebutton">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <Pagination
      :currentPage="currentPage"
      :totalPages="totalPages"
      @pageChange="handlePageChange"
    />

    <!-- Inline Edit Modal -->
    <div v-if="editingRecipe" class="modal-overlay">
      <div class="modal">
        <h3>Edit Recipe</h3>
        <input
          type="text"
          v-model="editingRecipe.name"
          placeholder="Recipe Name"
          required
        />
        <textarea
          v-model="editingRecipe.description"
          placeholder="Description"
          required
        ></textarea>
        <textarea
          v-model="editingRecipe.ingredients"
          placeholder="Ingredients (comma-separated)"
          required
        ></textarea>
        <select v-model="editingRecipe.category" required>
          <option disabled value="">Select Category</option>
          <option
            v-for="category in uniqueCategories"
            :key="category"
            :value="category"
          >
            {{ category }}
          </option>
        </select>
        <input type="file" @change="handleEditImageUpload" accept="image/*" />
        
        <!-- Dynamic Instructions Input for Editing -->
        <div class="instructions-input">
          <label>Instructions:</label>
          <div
            v-for="(instruction, index) in editingRecipe.instructions"
            :key="index"
            class="instruction-step"
          >
            <input
              type="text"
              v-model="editingRecipe.instructions[index]"
              :placeholder="'Step ' + (index + 1)"
              required
            />
            <button
              type="button"
              v-if="editingRecipe.instructions.length > 1"
              @click="removeEditInstructionStep(index)"
              class="remove-step"
            >
              Remove
            </button>
          </div>
          <button type="button" @click="addEditInstructionStep" class="edit-button">
            Add Step
          </button>
        </div>

        <button @click="saveRecipe" class="edit-buttonsave">Save Changes</button>
        <button @click="cancelEdit" class="edit-buttoncancel">Cancel</button>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="recipeToDelete" class="modal-overlay">
      <div class="modal">
        <h3>Are you sure you want to delete this recipe?</h3>
        <p>This action cannot be undone.</p>
        <button @click="deleteConfirmed" class="delete-button">Delete</button>
        <button @click="cancelDelete" class="edit-buttoncancel">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import Pagination from "./Pagination.vue";
import { supabase } from "@/supabase.js";
import { useRouter } from "vue-router";

export default {
  name: "RecipesTable",
  components: { Pagination },
  setup() {
    const recipes = ref([]);
    const selectedCategory = ref("All");
    const currentPage = ref(1);
    const itemsPerPage = 5;
    const editingRecipe = ref(null);
    const recipeToDelete = ref(null);
    const router = useRouter();

    const fetchRecipes = async () => {
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .is("deleted_at", null)
        .order("updated_at", { ascending: false });
      if (error) {
        console.error("Error fetching recipes:", error);
      } else {
        const recipesWithDetails = await Promise.all(
          data.map(async (recipe) => {
            const { data: ingredientsData } = await supabase
              .from("ingredients")
              .select("ingredient")
              .eq("recipe_id", recipe.id);
            const { data: instructionsData } = await supabase
              .from("instructions")
              .select("instruction")
              .eq("recipe_id", recipe.id);
            const { count, error: countError } = await supabase
              .from("favorite_recipes")
              .select("*", { count: "exact", head: true })
              .eq("recipe_id", recipe.id);
            if (countError) {
              console.error(
                `Error fetching favorite count for recipe ${recipe.id}:`,
                countError
              );
            }
            return {
              ...recipe,
              ingredients: ingredientsData
                ? ingredientsData.map((item) => item.ingredient).join(", ")
                : "",
              instructions: instructionsData
                ? instructionsData.map((item) => item.instruction).join(" | ")
                : "",
              likes: count || 0,
            };
          })
        );
        recipes.value = recipesWithDetails;
      }
    };

    onMounted(() => {
      fetchRecipes();
    });

    const filteredRecipes = computed(() => {
      if (selectedCategory.value === "All") {
        return recipes.value;
      }
      return recipes.value.filter(
        (recipe) => recipe.category === selectedCategory.value
      );
    });

    const totalPages = computed(() =>
      Math.ceil(filteredRecipes.value.length / itemsPerPage)
    );

    const paginatedRecipes = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      return filteredRecipes.value.slice(start, start + itemsPerPage);
    });

    const handlePageChange = (page) => {
      currentPage.value = page;
    };

    const navigateToAddRecipe = () => {
      router.push("/admin/addrecipe");
    };

    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      return new Date(dateString).toLocaleString();
    };

    const uniqueCategories = computed(() => {
      return ["Main Course", "Dessert", "Salad", "Breakfast", "Vegetarian"];
    });

    const editRecipe = async (recipe) => {
      const { data: ingredientsData, error: ingredientsError } =
        await supabase
          .from("ingredients")
          .select("ingredient")
          .eq("recipe_id", recipe.id);
      if (ingredientsError) {
        console.error("Error fetching ingredients:", ingredientsError);
      }
      const { data: instructionsData, error: instructionsError } =
        await supabase
          .from("instructions")
          .select("instruction")
          .eq("recipe_id", recipe.id)
          .order("updated_at", { ascending: false });
      if (instructionsError) {
        console.error("Error fetching instructions:", instructionsError);
      }
      let ingredients = "";
      if (ingredientsData && ingredientsData.length > 0) {
        ingredients = ingredientsData.map((item) => item.ingredient).join(", ");
      }
      let instructions = [];
      if (instructionsData && instructionsData.length > 0) {
        instructions = instructionsData.map((item) => item.instruction);
      } else {
        instructions = ["", "", ""];
      }
      editingRecipe.value = { ...recipe, ingredients, instructions };
    };

    const confirmDelete = (recipe) => {
      recipeToDelete.value = recipe;
    };

    const deleteConfirmed = async () => {
  if (!recipeToDelete.value) return;
  try {
    await supabase
      .from("recipes")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", recipeToDelete.value.id);
    fetchRecipes();
    recipeToDelete.value = null;
  } catch (error) {
    console.error("Error deleting recipe:", error);
  }
};


    const cancelDelete = () => {
      recipeToDelete.value = null;
    };

    const handleEditImageUpload = (event) => {
      const file = event.target.files[0];
      if (file && editingRecipe.value) {
        const imageName = file.name.split(".")[0];
        editingRecipe.value.image = `/src/assets/${imageName}.jpg`;
      }
    };

    const addEditInstructionStep = () => {
      if (editingRecipe.value) {
        editingRecipe.value.instructions.push("");
      }
    };

    const removeEditInstructionStep = (index) => {
      if (editingRecipe.value && editingRecipe.value.instructions.length > 1) {
        editingRecipe.value.instructions.splice(index, 1);
      }
    };

    const saveRecipe = async () => {
      if (!editingRecipe.value) return;
      try {
        const instructionsArray = editingRecipe.value.instructions.filter(
          (instruction) => instruction.trim() !== ""
        );
        await supabase
          .from("recipes")
          .update({
            name: editingRecipe.value.name,
            description: editingRecipe.value.description,
            image: editingRecipe.value.image,
            category: editingRecipe.value.category,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingRecipe.value.id);
        await supabase
          .from("ingredients")
          .delete()
          .eq("recipe_id", editingRecipe.value.id);
        const ingredientsArray = editingRecipe.value.ingredients
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item);
        await supabase.from("ingredients").insert(
          ingredientsArray.map((ingredient) => ({
            recipe_id: editingRecipe.value.id,
            ingredient,
          }))
        );
        await supabase
          .from("instructions")
          .delete()
          .eq("recipe_id", editingRecipe.value.id);
        await supabase.from("instructions").insert(
          instructionsArray.map((instruction, index) => ({
            recipe_id: editingRecipe.value.id,
            step_number: index + 1,
            instruction,
          }))
        );
        await fetchRecipes();
        editingRecipe.value = null;
        console.log("Recipe updated successfully!");
      } catch (error) {
        console.error("Error saving recipe:", error);
      }
    };

    const cancelEdit = () => {
      editingRecipe.value = null;
    };

    return {
      selectedCategory,
      currentPage,
      paginatedRecipes,
      totalPages,
      handlePageChange,
      navigateToAddRecipe,
      formatDate,
      uniqueCategories,
      editRecipe,
      confirmDelete,
      recipeToDelete,
      deleteConfirmed,
      cancelDelete,
      editingRecipe,
      handleEditImageUpload,
      addEditInstructionStep,
      removeEditInstructionStep,
      saveRecipe,
      cancelEdit,
      fetchRecipes,
    };
  },
};
</script>

<style scoped>
.recipes-table {
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
}
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.table-header h2 {
  margin: 0;
  color: #1a1a1a;
}
.table-header button {
  padding: 8px 12px;
  background: #ff914d;
  color: #fff;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 1rem;
}
.filter-section {
  margin: 15px 0;
  text-align: left;
  font-family: "Poppins", sans-serif;
}
.filter-section label {
  margin-right: 10px;
}
select {
  border-radius: 5px;
  font-size: 1rem;
}
table {
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
thead {
  background: #1a1a1a;
  color: #fff;
}
th,
td {
  padding: 10px;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
}
/* Center align only the last column (Actions) */
th:last-child,
td:last-child {
  text-align: center;
}
button {
  margin-right: 5px;
  padding: 5px 8px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
}
button.editbutton {
  background-color: #2395ff;
  margin-right: 10px;
  width: 70px;
  font-size: 1rem;
  color: white;
}
button.deletebutton {
  background-color: #ff4d4d;
  width: 70px;
  font-size: 1rem;
  color: white;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
}
.modal input[type="text"],
.modal textarea,
.modal select {
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 20px;
}
.instructions-input {
  margin-bottom: 10px;
}
.instruction-step {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
}
.modal button {
  margin-right: 10px;
  padding: 8px 12px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  background-color: #000000;
  color: #fff;
}
.modal button.edit-buttoncancel {
  background-color: #4e4e4e;
}
.modal button.deletebutton {
  background-color: #ff4d4d;
}
.modal button.edit-buttonsave {
  background-color: #ff914d;
}
.modal button.remove {
  background-color: #ff4d4d;
  color: #fff;
  margin-top: -10px;
  border-radius: 4px;
}
button.delete-button {
  background-color: #ff4d4d;
  width: 70px;
}
button.remove-step {
  background-color: #ff4d4d;
  margin-top: -7px;
}

/* Responsive Styles */
@media (max-width: 600px) {
  table th,
  table td {
    padding: 8px;
  }
  .section-title {
    font-size: 1.5rem;
  }
}
</style>
