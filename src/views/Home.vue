<template>
  <div>
    <Navbar />

    <header class="home">
      <div class="header-content">
        <h1>Welcome To Swift Recipe</h1>
        <p>Your simplest and quickest food recipes, all in one place.</p>
      </div>
      <div class="header-logo">
        <img src="/src/assets/header.jpg" alt="Swift Recipe Logo" />
      </div>
    </header>

    <main>
      <!-- Christmas Recipes Section -->
      <section>
        <h2 class="christmas">🎄 Christmas Edition 🎄</h2>
        <div class="recipes">
          <RecipeCard
            v-for="recipe in christmasRecipes"
            :key="recipe.id"
            :recipe="recipe"
            @click="viewRecipe(recipe.id)"
          />
        </div>
      </section>

      <!-- All Recipes Section -->
      <section>
        <h2>Latest Recipes</h2>
        <div class="recipes">
          <RecipeCard
            v-for="recipe in latestRecipes"
            :key="recipe.id"
            :recipe="recipe"
            @click="viewRecipe(recipe.id)"
          />
        </div>
        <button class="view-all-button" @click="viewAllRecipes">
          View All Recipes
        </button>
      </section>
      <BackToTop />
    </main>

    <footer>
      <p>© 2025 Swift Recipe. All rights reserved.</p>
    </footer>
  </div>
</template>

---

### **Script Section (Updated)**

```js
<script>
import RecipeCard from "@/components/RecipeCard.vue";
import BackToTop from "@/components/BackToTop.vue";
import Navbar from "@/components/Navbar.vue";
import { supabase } from "@/supabase.js"; // Import Supabase client

export default {
  name: "Home",
  components: {
    Navbar,
    BackToTop,
    RecipeCard,
  },
  data() {
    return {
      recipes: [],
      christmasRecipes: [],
    };
  },
  computed: {
    latestRecipes() {
      // Return the latest 8 recipes and reverse them to show the newest at the top-left
      return this.recipes.slice(0, 8);
    },
  },
  methods: {
    async loadRecipes() {
      try {
        // Fetch the latest 8 recipes from the database
        const { data: recipes, error } = await supabase
          .from("recipes")
          .select("*")
          .order("id", { ascending: false }) // Fetch latest recipes first
          .limit(8);

        if (error) {
          console.error("Error fetching recipes:", error);
          return;
        }
        this.recipes = recipes; // Store fetched recipes
      } catch (error) {
        console.error("Error loading recipes:", error);
      }
    },
    async loadChristmasRecipes() {
      try {
        // Simulating fetching Christmas recipes from a special endpoint or database logic
        const { data: christmasRecipes, error } = await supabase
          .from("recipes")
          .select("*")
          .eq("category", "Christmas");

        if (error) {
          console.error("Error fetching Christmas recipes:", error);
          return;
        }
        this.christmasRecipes = christmasRecipes;
      } catch (error) {
        console.error("Error fetching Christmas recipes:", error);
      }
    },
    viewRecipe(id) {
      this.$router.push({ name: "RecipeDetails", params: { id } });
    },
    viewAllRecipes() {
      this.$router.push("/recipes/all");
    },
  },
  async mounted() {
    await this.loadRecipes(); // Load recipes from the database
    await this.loadChristmasRecipes(); // Load Christmas recipes
  },
};
</script>



<style scoped>
section h2.christmas {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: #d9534f;
  font-family: "Poppins", sans-serif;
}
section h2{
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: #333;
  font-family: "Poppins", sans-serif;
}
.recipes {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}


* {
  font-family: "Poppins", sans-serif;
}
.view-all-button {
  margin-top: 30px;
  padding: 10px 20px;
  font-size: 1rem;
  background: linear-gradient(to right, #ff914d, #ff6f61, #ff9370);
  border-radius: 20px;
  border: none;
  color: white;
  cursor: pointer;
  display: block;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  font-family: "Poppins", sans-serif;
  font-weight: bold;
  transition: all 0.3s ease-in-out;
  border: 2px solid transparent;
}

.view-all-button:hover {
  background: white;
  color: #ff6f61;
  border: 2px solid transparent;
  background-clip: padding-box;
  position: relative;
}

.view-all-button:hover::before {
  content: "";
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 20px;
  background: linear-gradient(to right, #ff914d, #ff6f61, #ff9370);
  z-index: -1;
}





</style>
