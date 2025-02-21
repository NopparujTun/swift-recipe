<template>
  <div>
    <Navbar />

    <div class="banner">
      <img src="@/assets/banner.jpg" alt="Banner" class="banner-image" />
      <h1 class="banner-text">Your Favorite Recipes</h1>
    </div>

    <main class="container">
      <div class="search-filter-container">
        <aside class="filter-section">
          <h2>Filter by type:</h2>
          <div class="filter">
            
            <select id="category" v-model="selectedCategory">
              <option value="All">All</option>
              <option
                v-for="category in uniqueCategories"
                :key="category"
                :value="category"
              >
                {{ category }}
              </option>
            </select>
          </div>
        </aside>

        <div class="search-bar">
          <input
            v-model="searchQuery"
            class="search-input"
            type="text"
            placeholder="Search recipes..."
          />
        </div>
      </div>

      <!-- Recipe List -->
      <section class="recipe-list">
        <RecipeCard
          v-for="recipe in filteredRecipes"
          :key="recipe.id"
          :recipe="recipe"
        />
      </section>
    </main>

    <Footer />
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import RecipeCard from "@/components/RecipeCard.vue";
import Footer from "@/components/Footer.vue";
import { supabase } from "@/supabase.js"; // adjust path if needed

export default {
  name: "Favorites",
  components: { Navbar, RecipeCard, Footer },
  data() {
    return {
      recipes: [],
      selectedCategory: "All",
      searchQuery: "",
      loading: false,
    };
  },
  computed: {
    uniqueCategories() {
      return [...new Set(this.recipes.map((recipe) => recipe.category))];
    },
    filteredRecipes() {
      let filtered = this.recipes;
      if (this.selectedCategory !== "All") {
        filtered = filtered.filter(
          (recipe) => recipe.category === this.selectedCategory
        );
      }
      if (this.searchQuery) {
        filtered = filtered.filter((recipe) =>
          recipe.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
      return filtered;
    },
  },
  methods: {
    async loadFavorites() {
      this.loading = true;
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        const userId = userData.user.id;
        const { data, error } = await supabase
          .from("favorite_recipes")
          .select(`
            *,
            recipe:recipes(
              id,
              name,
              image,
              description,
              category,
              created_at,
              updated_at
            )
          `)
          .eq("user_id", userId);
        if (error) {
          console.error("Error fetching favorites:", error);
        } else {
          console.log("Favorites data:", data);
          // Map over the favorites to extract the joined recipe data.
          this.recipes = data
            .map((fav) => fav.recipe) // if your alias is "recipe"
            .filter((recipe) => recipe !== null);
        }
      } else {
        // Redirect to login if no user is logged in.
        this.$router.push("/login");
      }
      this.loading = false;
    },
  },
  async mounted() {
    await this.loadFavorites();
  },
};
</script>

<style scoped>
.header {
  text-align: center;
  position: relative;
}

.search-bar {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.search-input {
  width: 50%;
  padding: 10px;
  font-size: 1rem;
  border-radius: 20px;
  border: 1px solid #ccc;
}
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

main {
  max-width: 1600px;
  margin: 2rem auto;
  padding: 1rem;
  text-align: center;
}

.container {
  display: flex;
  align-items: flex-start;
  padding: 20px;
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
    align-items: center;
  }

  .recipe-list {
    grid-template-columns: 1fr !important;
    
  }
  .filter-section {
  width: 300px;
  padding: 15px;
  background: #f4f4f4;
  border-radius: 20px;
  margin-bottom: 20px;
}
}

.filter-section {
  width: 300px;
  padding: 15px;
  background: #f4f4f4;
  border-radius: 20px;
  margin-bottom: 20px;
}

.filter-section h2 {
  font-size: 1.2rem;
  
  text-align: left;
}

.filter {
  margin-bottom: 15px;
}

.filter label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  text-align: left;
}

.filter select {
  width: 100%;
  padding: 8px;
  font-size: 1rem;
  border-radius: 20px;
  border: 1px solid #ccc;
}

.search-container {
  margin-top: 10px;
}

.search-input {
  width: 94%;
  padding: 8px;
  font-size: 1rem;
  border-radius: 20px;
  border: 1px solid #ccc;
}

.recipe-list {
  margin-top: -10px;
  flex-grow: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  
}
</style>
