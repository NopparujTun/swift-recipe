<template>
  <div class="card">
    <img :src="recipe.image" :alt="recipe.name" />
    <div class="card-content">
      <h3>{{ recipe.name }}</h3>
      <p>{{ recipe.description }}</p>
      <button @click="viewDetails">
        View recipe
        <div class="arrow-wrapper">
          <div class="arrow"></div>
        </div>
      </button>
    </div>
  </div>
</template>



<script>
export default {
  name: "RecipeCard",
  props: {
    recipe: Object,
  },
  methods: {
    viewDetails() {
      this.$emit("click");
    },
  },
};
</script>
<style>
.card {
  text-align: left; /* Ensure all content aligns to the left */
  
}

.recipes {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}
.card-content {
  padding: 1rem; /* Padding only around the text and button */
}

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

.card img {
  width: 100%;
  height: 200px; 
  object-fit: cover; 
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  border: none;
}

.card h3 {
  margin: 0.5rem 0;
  color: #333;
  font-family: "Poppins", sans-serif;
  font-size: 1.3rem;

}

.card p {
  font-family: "Poppins", sans-serif;
  font-size: 12px;
  margin: 0.5rem 0;
  
  color: #555;
  font-weight: bold;
}


button {
  --primary-color: linear-gradient(to right, #ff914d, #ff6f61, #ff9370);
  --secondary-color: #fff;
  --hover-color: #111;
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

button:hover {
  background-color: var(--hover-color);
}

button:hover .arrow {
  background: var(--secondary-color);
}

button:hover .arrow:before {
  right: 0;
}


</style>
