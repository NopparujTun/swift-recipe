import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import RecipeDetails from "@/views/RecipeDetails.vue";
import AllRecipes from "@/views/AllRecipes.vue";
import CategoryRecipes from "@/views/CategoryRecipes.vue";
import RecipeDetails_Christmas from "@/views/RecipeDetails_Christmas.vue";
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/recipe/:id",
    name: "RecipeDetails",
    component: RecipeDetails,
    props: (route) => ({ id: parseInt(route.params.id) }), // Parse `id` as a number
  }
  ,
  {
    path: "/admin",
    name: "AdminPage",
    component: () => import("@/views/AdminPage.vue"),
  },
  {
    path: "/recipes/all",
    name: "AllRecipes",
    component: AllRecipes,
  },
  {
    path: "/recipes/:category",
    name: "CategoryRecipes",
    component: CategoryRecipes,
    props: true,
  },
  {
    path: "/christmas-recipe/:id",
    name: "RecipeDetails_Christmas",
    component: RecipeDetails_Christmas,
    props: true,
  },
  
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
