<template>
  <div class="card">
    <div class="image-wrapper">
      <img :src="recipe.image" :alt="recipe.name" />
      <!-- Favorite Button at Top Right of Image -->
      <button class="favorite-btn" @click="toggleFavorite">
        <span v-if="isFavorited">❤️</span>
        <span v-else>🤍</span>
      </button>
    </div>

    <div class="card-content">
      <h3>{{ recipe.name }}</h3>
      <p>{{ recipe.description }}</p>
    </div>

    <!-- Card Footer: View Recipe (left) and Favorite Count (right) -->
    <div class="card-footer">
      <button @click="viewRecipe(recipe.id)">
        View recipe
        <div class="arrow-wrapper">
          <div class="arrow"></div>
        </div>
      </button>
      <div class="favorite-count">
        <span>🤍</span> {{ favoriteCount }}
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from "@/supabase.js";

export default {
  name: "RecipeCard",
  props: {
    recipe: Object,
  },
  data() {
    return {
      user: null,
      isFavorited: false,
      favoriteCount: 0,
    };
  },
  async mounted() {
    await this.checkUser();
    if (this.user) {
      await this.checkIfFavorited();
    }
    // Fetch the current favorite count from the database
    await this.fetchFavoriteCount();
  },
  methods: {
    async checkUser() {
      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user) {
        this.user = authData.user;
      }
    },

    async fetchFavoriteCount() {
      const { count, error } = await supabase
        .from("favorite_recipes")
        .select("*", { count: "exact", head: true })
        .eq("recipe_id", this.recipe.id);
      if (error) {
        console.error("Error fetching favorite count:", error);
      } else {
        this.favoriteCount = count || 0;
      }
    },

    async checkIfFavorited() {
      if (!this.user) return;

      const { data } = await supabase
        .from("favorite_recipes")
        .select("id")
        .eq("user_id", this.user.id)
        .eq("recipe_id", this.recipe.id)
        .single();

      if (data) {
        this.isFavorited = true;
      }
    },

    async toggleFavorite() {
      if (!this.user) {
        this.$router.push("/login"); // Redirect to login if not authenticated
        return;
      }

      if (this.isFavorited) {
        await this.removeFavorite();
      } else {
        await this.addFavorite();
      }
      // Refresh the count after toggling
      await this.fetchFavoriteCount();
    },

    async addFavorite() {
      const { error } = await supabase.from("favorite_recipes").insert([
        {
          user_id: this.user.id,
          recipe_id: this.recipe.id,
        },
      ]);

      if (!error) {
        this.isFavorited = true;
      } else {
        console.error("Error adding favorite:", error);
      }
    },

    async removeFavorite() {
      const { error } = await supabase
        .from("favorite_recipes")
        .delete()
        .eq("user_id", this.user.id)
        .eq("recipe_id", this.recipe.id);

      if (!error) {
        this.isFavorited = false;
      } else {
        console.error("Error removing favorite:", error);
      }
    },

    viewRecipe(id) {
      this.$router.push({ name: "RecipeDetails", params: { id } });
    },
  },
};
</script>

<style scoped>
.card {
  display: inline-block;
  overflow: hidden;
  margin: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 30px;
  width: 300px;
  background: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* Image Container */
.image-wrapper {
  position: relative;
}
.image-wrapper img {
  width: 100%;
  height: 220px; 
  object-fit: cover; 
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  border: none;
  margin-bottom: -13px;
}

/* Favorite Button at Top Right of Image */
.favorite-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 0.2rem;
  border-radius: 100%;
  background: rgb(226, 226, 226);
  font-size: 1.5rem;
  cursor: pointer;
}

/* Card Content (Title & Description) */
.card-content {
  padding: 1rem;
  flex-grow: 1;
}
.card-content h3 {
  margin: 0.5rem 0;
  color: #333;
  font-family: "Poppins", sans-serif;
  font-size: 1.2rem;
  text-align: left;
}
.card-content p {
  font-family: "Poppins", sans-serif;
  font-size: 12px;
  margin: 0.5rem 0;
  color: #555;
  font-weight: bold;
  text-align: left;
}

/* Card Footer (View Recipe and Favorite Count) */
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  margin-top: -20px;
  background: #ffffff;
}

button {
  --primary-color: linear-gradient(to right, #ff914d, #ff6f61, #ff9370);
  --secondary-color: #fff;
  --arrow-width: 8px;
  --arrow-stroke: 2px;
  box-sizing: border-box;
  border: 0;
  border-radius: 20px;
  color: var(--secondary-color);
  padding: 0.9em 1.0em;
  background: var(--primary-color);
  display: flex;
  transition: 0.2s background;
  align-items: center;
  gap: 0.6em;
  font-weight: bold;
  font-family: "Poppins", sans-serif;
  font-size: 0.75rem;
  cursor: pointer;
  
}

button .arrow-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

button .arrow {
  margin-top: 1px;
  width: var(--arrow-width);
  background: var(--primary-color);
  height: var(--arrow-stroke);
  position: relative;
  transition: 0.2s;
}

button .arrow::before {
  content: "";
  box-sizing: border-box;
  position: absolute;
  border: solid var(--secondary-color);
  border-width: 0 var(--arrow-stroke) var(--arrow-stroke) 0;
  display: inline-block;
  top: -3px;
  right: 3px;
  transition: 0.2s;
  padding: 3px;
  transform: rotate(-45deg);
}



button:hover .arrow {
  background: var(--secondary-color);
}

button:hover .arrow:before {
  right: 0;
}
/* Favorite Count Display */
.favorite-count {
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 4px;
}

</style>
