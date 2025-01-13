<template>
  <div>
    <!-- Navigation Bar -->
    <nav class="navbar">
  <div class="nav-logo">
    <img src="/src/assets/logo.jpg" alt="Swift Recipe Logo" />
    <span>Swift Recipe</span>
  </div>
  <div class="nav-toggle" @click="toggleMenu">&#9776;</div>
  <div :class="['nav-links', { show: isMenuOpen }]">
    <a href="/" @click.prevent="goToHome">Home</a>
    <a href="#">Recipes</a>
    <a href="#">Favorites</a>
    <a href="#">About</a>
  </div>
</nav>
      <header>
        <h1>{{ recipe.name }}</h1>
        <p class="description">{{ recipe.description }}</p>
      </header>
    <div v-if="recipe" class="recipe-details">

      <img :src="recipe.image" :alt="recipe.name" />
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
      <!-- Updated Back Button -->
      <button @click="goBack">
        <svg height="16" width="16" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024">
          <path
            d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"
          ></path>
        </svg>
        <span>Back</span>
      </button>
    </div>
    <div v-else>
      <p>Recipe not found.</p>
      <button @click="goBack">
        <svg height="16" width="16" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024">
          <path
            d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"
          ></path>
        </svg>
        <span>Back</span>
      </button>
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


.recipe-details {
  max-width: 1150px;
  margin: 0 auto;
  padding: 20px;
  text-align: left;
  font-family: "Arial", sans-serif;
  line-height: 1.6;
}

.recipe-details img {
  width: 50%; 
  object-fit: cover; 
  height: 400px; 
  display: block; 
  margin: 20px auto; 
  border-radius: 10px; 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); 
}

.recipe-details section h3 {
  font-size: 1.8rem;
  font-family: "Montserrat", sans-serif; 
  color: #333;
  margin-bottom: 10px;
}

.recipe-details ul,
.recipe-details ol {
  font-size: 1rem;
  font-family: "Roboto", sans-serif; 
  color: #444;
  margin: 20px 0;
  padding-left: 20px;
}

button {
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

button > svg {
  margin-right: 5px;
  margin-left: 5px;
  font-size: 20px;
  transition: all 0.4s ease-in;
}

button:hover > svg {
  font-size: 1.2em;
  transform: translateX(-5px);
}

button:hover {
  box-shadow: 9px 9px 33px #d1d1d1, -9px -9px 33px #ffffff;
  transform: translateY(-2px);
}

</style>