<template>
  <div>
    <!-- Navigation Bar -->
    <nav class="navbar">
    <div class="nav-logo">
      <img src="/src/assets/logo.jpg" alt="Swift Recipe Logo" />
      <span>Swift Recipe</span>
    </div>
    <button class="hamburger" @click="toggleMenu">
      <span></span>
      <span></span>
      <span></span>
    </button>
    <ul class="nav-links" :class="{ 'open': isMenuOpen }">
      <li><a href="/" @click.prevent="goToHome">Home</a></li>
      <li>
        <a href="#" class="dropdown-btn">Recipes</a>
        <ul class="dropdown">
          <li v-for="category in uniqueCategories" :key="category" @click="filterByCategory(category)">
            <a href="#">{{ category }}</a>
          </li>
        </ul>
      </li>
      <li><a href="#">Favorites</a></li>
      <li><a href="#">About</a></li>
    </ul>
  </nav>

 
    <header class="recipe-header">
      <h1>{{ recipe.name }}</h1>
      <p class="description">{{ recipe.description }}</p>
    </header>

    <!-- White Container -->
    <div v-if="recipe" class="container">
      <img :src="recipe.image" :alt="recipe.name" class="recipe-image" />
      <section>
        <h3>Ingredients</h3>
        <ul>
          <li v-for="(ingredient, index) in recipe.ingredients" :key="index">
            {{ ingredient }}
          </li>
        </ul>
      </section>
      <section>
        <h3>Instructions</h3>
        <ol>
          <li v-for="(step, index) in recipe.instructions" :key="index">
            {{ step }}
          </li>
        </ol>
      </section>
      <button @click="goBack" class="back-button">← Back</button>
    </div>

    <!-- Fallback if recipe not found -->
    <div v-else>
      <p>Recipe not found.</p>
      <button @click="goBack">← Back</button>
    </div>
  </div>
</template>


<script>
import axios from "axios";

export default {
  name: "RecipeDetails",
  props: {
    id: Number, // ID of the recipe passed as a prop
  },
  data() {
    return {
      recipe: null, // Holds the fetched recipe
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
        this.recipe = null; // Ensure fallback if the recipe is not found
      }
    },
    goBack() {
      this.$router.push("/");
    },
    goToHome() {
      this.$router.push("/");
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
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
  font-family: "Montserrat", sans-serif; 
  color: #333;
  margin-bottom: 10px;
}

ul,
ol {
  font-size: 1rem;
  font-family: "Roboto", sans-serif; 
  color: #444;
  margin: 20px 0;
  padding-left: 20px;
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

</style>