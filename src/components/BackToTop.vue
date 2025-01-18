<template>
    <button class="back-to-top" @click="scrollToTop">
        ↑
    </button>
  </template>
  
  <script>
  export default {
    name: "BackToTop",
    methods: {
      scrollToTop() {
        // Smoothly scroll to the top of the page
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      },
    },
  };
  </script>
  
  <style scoped>
  .back-to-top {
    padding: 10px 20px;
  font-size: 16px;
  font-family: Arial, sans-serif;
  color: #ffffff;
  background-color: #007bff; /* Blue background */
  border: none;
  border-radius: 50%;
  cursor: pointer;
  position: fixed;
  height: 50px;
  width: 50px;
  bottom: 20px; /* Position near the bottom */
  right: 20px; /* Position near the right side */
  z-index: 1000; /* Ensure it's above other content */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s ease;
  }
  
  .back-to-top:hover {
    background-color: #0056b3; /* Darker blue on hover */
  }
  </style>
  