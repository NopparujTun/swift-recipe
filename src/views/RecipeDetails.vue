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
          <li v-for="(ingredient, index) in recipe.ingredients" :key="index" class="ingredient-item">
            {{ ingredient }}
          </li>
        </ul>
      </section>
      <section>
        <h3>Instructions</h3>
        <ol>
          <li v-for="(step, index) in recipe.instructions" :key="index" class="step">
            {{ step }}
          </li>
        </ol>
      </section>
      <button @click="goBack" class="back-button">← Back</button>
    </div>

    
    <div v-else>
      <p>Recipe not found.</p>
      <button @click="goBack">← Back</button>
    </div>
  </div>
</template>


<script>
import axios from "axios";
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
      isMenuOpen: false,
    };
  },
  created() {
    this.loadRecipe();
  },
  methods: {
    async loadRecipe() {
      try {
        const response = await axios.get(`http://localhost:3000/recipes/${this.id}`);
        this.recipe = response.data;
      } catch (error) {
        console.error("Error fetching the recipe:", error);
        this.recipe = null; 
      }
    },
    goBack() {
        this.$router.push("/");
      },
  },

};
</script>

<style scoped>
.recipe-header{
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



.back-button button {
  display: flex;
  height: 3em;
  width: 100px;
  align-items: center;
  justify-content: center;
  background-color: #eeeeee4b;
  border-radius: 3px;
  letter-spacing: 1px;
  transition: all 0.2s linear;
  cursor: pointer;
  border: none;
  background: #fff;
}

.back-button button > svg {
  margin-right: 5px;
  margin-left: 5px;
  font-size: 20px;
  transition: all 0.4s ease-in;
}

.back-button button:hover > svg {
  font-size: 1.2em;
  transform: translateX(-5px);
}

.back-button button:hover {
  box-shadow: 9px 9px 33px #d1d1d1, -9px -9px 33px #ffffff;
  transform: translateY(-2px);
}
* {
  font-family: "Poppins", sans-serif;
}
</style>