import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import RecipeDetails from "@/views/RecipeDetails.vue";
import AllRecipes from "@/views/AllRecipes.vue";
import RecipeDetails_Christmas from "@/views/RecipeDetails_Christmas.vue";
import AdminPage from "@/views/AdminPage.vue";
import Login from "@/views/Login.vue";
import MainCourse from "@/views/MainCourse.vue";
import Dessert from "@/views/Dessert.vue";
import Salad from "@/views/Salad.vue"
import Breakfast from "@/views/Breakfast.vue";
import Vegetarian from "@/views/Vegetarian.vue";
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
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
    component: AdminPage,
    beforeEnter: (to, from, next) => {
      // Check if user is authenticated
      const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
      if (isAuthenticated) {
        next(); // Allow access
      } else {
        next("/login"); // Redirect to login page
      }
    },
  },
  {
    path: "/recipes/all",
    name: "AllRecipes",
    component: AllRecipes,
  },
  {
    path: "/christmas-recipe/:id",
    name: "RecipeDetails_Christmas",
    component: RecipeDetails_Christmas,
    props: true,
  },
  {
    path: "/recipes/maincourse",
    name: "MainCourse",
    component: MainCourse,
  },
  {
    path: "/recipes/dessert",
    name: "dessert",
    component: Dessert,
  },
  {
    path: "/recipes/salad",
    name: "Salad",
    component: Salad,
  },
  {
    path: "/recipes/breakfast",
    name: "Breakfast",
    component: Breakfast,
  },
  {
    path: "/recipes/vegetarian",
    name: "Vegetarian",
    component: Vegetarian,
  },
  
  
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
