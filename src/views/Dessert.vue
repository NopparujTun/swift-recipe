<template>
  <div>
    <Navbar />

    <div class="banner">
      <img src="@/assets/banner.jpg" alt="Banner" class="banner-image" />
      <h1 class="banner-text">Dessert</h1>
    </div>
    
    <main>
      <div class="search-bar">
        <input
          v-model="searchQuery"
          class="search-input"
          type="text"
          placeholder="Search recipes..."
        />
      </div>
      <div class="recipes">
        <RecipeCard
          v-for="recipe in filteredRecipes"
          :key="recipe.id"
          :recipe="recipe"
          @click.native="viewRecipe(recipe.id)"
        />
      </div>
    </main>

    <BackToTop />
    <Footer/>
  </div>
</template>

<script>
import { supabase } from "@/supabase.js";
import RecipeCard from "@/components/RecipeCard.vue";
import Navbar from "@/components/Navbar.vue";
import BackToTop from "@/components/BackToTop.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: "Dessert",
  components: {
    Navbar,
    RecipeCard,
    BackToTop,
    Footer,
  },
  data() {
    return {
      dessertRecipes: [],
      searchQuery: "",
    };
  },
  computed: {
    filteredRecipes() {
      if (!this.searchQuery) {
        return this.dessertRecipes;
      }
      return this.dessertRecipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    async fetchDessertRecipes() {
      try {
        const { data: recipes, error } = await supabase
          .from("recipes")
          .select("*")
          .is("deleted_at", null)
          .eq("category", "Dessert");

        if (error) {
          console.error("Error fetching recipes:", error);
          return;
        }
        this.dessertRecipes = recipes;
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    },
    viewRecipe(id) {
      this.$router.push({ name: "RecipeDetails", params: { id } });
    },
  },
  async mounted() {
    await this.fetchDessertRecipes();
  },
};
</script>

<style>
.banner {
  position: relative;
  text-align: center;
}
.banner-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  display: block;
}
.banner-text {
  position: absolute;
  top: 43%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #333;
  font-size: 2.5rem;
  font-weight: bold;
}
.search-input {
  width: 50%;
  padding: 8px;
  font-size: 1rem;
  border-radius: 20px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
}
</style>
