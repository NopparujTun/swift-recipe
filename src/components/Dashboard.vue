<template>
    <div class="dashboard">
      <h2>Recipe Categories</h2>
      <div class="categories-grid">
        <div
          v-for="category in categories"
          :key="category.name"
          class="category-card"
        >
          <div class="card-header">
            <h3>{{ category.name }}</h3>
            <span>{{ category.count }} recipes</span>
          </div>
          <div class="card-icon">
            
            <img :src="category.icon" alt="icon" />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { supabase } from "@/supabase.js";
  export default {
    name: "Dashboard",
    data() {
      return {
        categories: []
      };
    },
    async mounted() {
      
      const categoryList = [
        { name: "Main Course", icon: "/utensils.png" },
        { name: "Dessert", icon: "/cake.png" },
        { name: "Salad", icon: "/salad.png" },
        { name: "Breakfast", icon: "/coffee.png" },
        { name: "Vegetarian", icon: "/carrot.png" },
      ];
  
      // Fetch all recipes
      const { data: recipes, error } = await supabase
        .from("recipes")
        .select("*")
        .is("deleted_at", null);
  
      if (error) {
        console.error("Error fetching recipes:", error);
        return;
      }
  
      // For each category
      const categories = categoryList.map(category => {
        const count = recipes.filter(
          recipe => recipe.category === category.name
        ).length;
        return { ...category, count };
      });
  
      this.categories = categories;
    }
  };
  </script>
  
  <style scoped>
  .dashboard {
    padding: 20px;
  }
  
  .dashboard h2 {
    font-size: 24px;
    margin-bottom: 20px;
    color: #1a1a1a;
  }
  
  .categories-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
  
  .category-card {
    background: #fff;
    border: 1px solid #ccc;
    padding: 20px;
    width: calc(33.33% - 20px);
    box-sizing: border-box;
    border-radius: 8px;
    transition: border 0.3s;
    cursor: pointer;
  }
  
  .category-card:hover {
    border-color: #ff914d;
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .card-header h3 {
    margin: 0;
    font-size: 18px;
    color: #1a1a1a;
  }
  
  .card-header span {
    font-size: 14px;
    color: #666;
  }
  
  .card-icon {
    margin-top: 10px;
    text-align: right;
  }

  .card-icon img{
    width: 20%;
    height: 20%s;
  }
  </style>
  