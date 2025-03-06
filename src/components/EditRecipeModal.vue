<template>
    <div class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h2>Edit Recipe</h2>
          <button class="close-button" @click="onClose">X</button>
        </div>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label>Recipe Name</label>
            <input type="text" v-model="editedRecipe.name" required />
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="editedRecipe.description" rows="3" required></textarea>
          </div>
          <div class="form-group">
            <label>Ingredients (comma-separated)</label>
            <input type="text" v-model="editedRecipe.ingredients" required />
          </div>
          <div class="form-group">
            <label>Category</label>
            <select v-model="editedRecipe.category" required>
              <option value="Main Course">Main Course</option>
              <option value="Dessert">Dessert</option>
              <option value="Salad">Salad</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Vegetarian">Vegetarian</option>
            </select>
          </div>
          <!-- Image upload with automatic URL conversion -->
          <div class="form-group">
            <label>Image</label>
            <input type="file" @change="handleEditImageUpload" accept="image/*" />
            <p>Selected Image Path: {{ editedRecipe.image }}</p>
          </div>
          <div class="form-group instructions">
            <div class="instructions-header">
              <label>Instructions</label>
              <button type="button" @click="handleAddStep">+</button>
            </div>
            <div
              v-for="(instruction, index) in instructions"
              :key="index"
              class="instruction-step"
            >
              <input
                type="text"
                v-model="instructions[index]"
                :placeholder="'Step ' + (index + 1)"
                required
              />
              <button
                type="button"
                v-if="instructions.length > 3"
                @click="handleRemoveStep(index)"
              >
                -
              </button>
            </div>
          </div>
          <div class="modal-actions">
            <button type="button" @click="onClose">Cancel</button>
            <button type="submit">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "EditRecipeModal",
    props: {
      recipe: Object,
      onClose: Function,
      onSave: Function
    },
    data() {
      return {
        
        editedRecipe: {},
        instructions: []
      };
    },
    watch: {
      
      recipe: {
        immediate: true,
        handler(newRecipe) {
          if (newRecipe) {
            this.editedRecipe = { ...newRecipe };
            
            this.instructions = newRecipe.instructions
              ? [...newRecipe.instructions]
              : ["", "", ""];
          }
        }
      }
    },
    methods: {
      handleAddStep() {
        this.instructions.push("");
      },
      handleRemoveStep(index) {
        this.instructions.splice(index, 1);
      },
      handleEditImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
          
          const imageName = file.name.split('.')[0];
          
          this.editedRecipe.image = `/src/assets/${imageName}.jpg`;
        }
      },
      handleSubmit() {
        
        this.onSave({ ...this.editedRecipe, instructions: this.instructions });
      }
    }
  };
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .modal {
    background: #fff;
    border-radius: 8px;
    padding: 20px;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
  }
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .close-button {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
  }
  .form-group {
    margin-bottom: 15px;
  }
  .form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #1a1a1a;
  }
  .form-group input,
  .form-group textarea,
  .form-group select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  .instructions {
    margin-bottom: 15px;
  }
  .instructions-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .instruction-step {
    display: flex;
    gap: 10px;
    margin-top: 5px;
  }
  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
  .modal-actions button {
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .modal-actions button:first-child {
    background: #ccc;
  }
  .modal-actions button:last-child {
    background: #ff914d;
    color: #fff;
  }
  </style>
  