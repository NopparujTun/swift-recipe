import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import RecipeDetails from "@/views/RecipeDetails.vue";
import AllRecipes from "@/views/AllRecipes.vue";
import RecipeDetails_Christmas from "@/views/RecipeDetails_Christmas.vue";
import AdminPage from "@/views/AdminPage.vue";
import AdminLogin from "@/views/AdminLogin.vue";
import MainCourse from "@/views/MainCourse.vue";

import Dessert from "@/views/Dessert.vue";
import Salad from "@/views/Salad.vue"
import Breakfast from "@/views/Breakfast.vue";
import Vegetarian from "@/views/Vegetarian.vue";
import About from "@/views/About.vue";

import Dashboard from '@/components/Dashboard.vue';
import RecipesTable from '@/components/RecipesTable.vue';
import ReviewsTable from '@/components/ReviewsTable.vue';
import AddRecipe from '@/views/AddRecipe.vue';


const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/adminlogin",
    name: "AdminLogin",
    component: AdminLogin,
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
    component: AdminPage,
    beforeEnter: (to, from, next) => {
      // Simple authentication check
      const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
      if (isAuthenticated) {
        next();
      } else {
        next("/login");
      }
    },
    children: [
      { path: "", name: "Dashboard", component: Dashboard },           // /admin
      { path: "recipes", name: "RecipesTable", component: RecipesTable }, // /admin/recipes
      { path: "reviews", name: "ReviewsTable", component: ReviewsTable }, // /admin/reviews
      { path: "addrecipe", name: "AddRecipe", component: AddRecipe },       // /admin/addrecipe
    ],
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
  {
    path: "/about",
    name: "About",
    component: About,
  },
  {
    path: "/login",
    name: "sign in",
    component: () => import("@/views/SignIn.vue"),
  },
  {
    path: "/signup",
    name: "sign up",
    component: () => import("@/views/SignUp.vue"),
  },
  {
    path: "/favorites",
    name: "favorties",
    component: () => import("@/views/Favorites.vue")
  }
  
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});



export default router;
