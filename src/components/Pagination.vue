<template>
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
      <button
        v-for="page in totalPages"
        :key="page"
        @click="goToPage(page)"
        :class="{ active: currentPage === page }"
      >
        {{ page }}
      </button>
      <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
    </div>
  </template>
  
  <script>
  export default {
    name: "Pagination",
    props: {
      currentPage: Number,
      totalPages: Number
    },
    methods: {
      prevPage() {
        if (this.currentPage > 1) {
          this.$emit("pageChange", this.currentPage - 1);
        }
      },
      nextPage() {
        if (this.currentPage < this.totalPages) {
          this.$emit("pageChange", this.currentPage + 1);
        }
      },
      goToPage(page) {
        this.$emit("pageChange", page);
      }
    }
  };
  </script>
  
  <style scoped>
  .pagination {
    display: flex;
    justify-content: center;
    gap: 5px;
    margin: 20px 0;
  }
  .pagination button {
    padding: 5px 10px;
    border: 1px solid #ccc;
    background: #fff;
    cursor: pointer;
    border-radius: 4px;
  }
  .pagination button.active {
    background: #ff914d;
    color: #fff;
  }
  .pagination button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  </style>
  