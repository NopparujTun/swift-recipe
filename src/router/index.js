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
    props: (route) => ({ id: parseInt(route.params.id) }), // Pass `id` as a prop
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
