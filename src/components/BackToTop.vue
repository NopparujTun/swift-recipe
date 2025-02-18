<template>
    <button class="back-to-top" @click="scrollToTop">
        ^
    </button>
  </template>
  
  <script>
  export default {
    name: "BackToTop",
    methods: {
      scrollToTop() {
        
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
  font-size: 20px;
  font-family: Arial, sans-serif;
  color: #ffffff;
  background-color: #000000;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  position: fixed;
  height: 50px;
  width: 50px;
  bottom: 20px; 
  right: 20px; 
  z-index: 1000; 
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s ease;
  }
  
  .back-to-top:hover {
    background-color: #ffffff;
    color: #000000;
  }

  
  </style>
  