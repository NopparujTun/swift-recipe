import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import RecipeDetails from "@/views/RecipeDetails.vue";

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
    props: (route) => ({ id: parseInt(route.params.id) }), 
  },
  {
    path: "/admin",
    name: "AdminPage",
    component: () => import("@/views/AdminPage.vue"),
  },
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
