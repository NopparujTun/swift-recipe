<template>
  <div class="reviews-table">
    <h2 class="section-title">Reviews</h2>
    <table class="reviews-table__table">
      <thead>
        <tr>
          <th>User Name</th>
          <th>Recipe Name</th>
          <th>Review</th>
          <th>Created At</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <!-- Use paginatedReviews instead of full reviews list -->
        <tr v-for="review in paginatedReviews" :key="review.id">
          <td>{{ review.user_name }}</td>
          <td>{{ review.recipe ? review.recipe.name : "N/A" }}</td>
          <td>{{ review.comment }}</td>
          <td>{{ formatDate(review.created_at) }}</td>
          <td>
            <button class="delete-button" @click="confirmDelete(review)">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination Component -->
    <Pagination 
      :currentPage="currentPage" 
      :totalPages="totalPages" 
      @pageChange="handlePageChange" 
    />

    <!-- Delete Confirmation Modal -->
    <div v-if="reviewToDelete" class="modal-overlay">
      <div class="modal">
        <h3>Are you sure you want to delete this review?</h3>
        <p>This action cannot be undone.</p>
        <div class="modal-actions">
          <button class="delete-button" @click="deleteConfirmed">Delete</button>
          <button class="cancel-button" @click="cancelDelete">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { supabase } from "@/supabase.js";
import Pagination from "@/components/Pagination.vue";

export default {
  name: "ReviewsTable",
  components: {
    Pagination,
  },
  setup() {
    const reviews = ref([]);
    const reviewToDelete = ref(null);
    const currentPage = ref(1);
    const reviewsPerPage = ref(5);
    
    // Compute total pages based on the reviews count.
    const totalPages = computed(
      () => Math.ceil(reviews.value.length / reviewsPerPage.value)
    );
    
    // Compute the reviews for the current page.
    const paginatedReviews = computed(() => {
      const start = (currentPage.value - 1) * reviewsPerPage.value;
      return reviews.value.slice(start, start + reviewsPerPage.value);
    });
    
    const fetchReviews = async () => {
      // Fetch reviews that are not soft-deleted, including the related recipe name.
      const { data, error } = await supabase
        .from("reviews")
        .select("*, recipe:recipes(name)")
        .is("deleted_at", null)
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Error fetching reviews:", error);
      } else {
        reviews.value = data;
        currentPage.value = 1; // Reset to first page on new fetch.
      }
    };

    const confirmDelete = (review) => {
      reviewToDelete.value = review;
    };

    const deleteConfirmed = async () => {
      if (!reviewToDelete.value) return;
      // Perform soft delete by updating the deleted_at field.
      await supabase
        .from("reviews")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", reviewToDelete.value.id);
      await fetchReviews();
      reviewToDelete.value = null;
    };

    const cancelDelete = () => {
      reviewToDelete.value = null;
    };

    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      return new Date(dateString).toLocaleString();
    };

    const handlePageChange = (page) => {
      currentPage.value = page;
    };

    onMounted(() => {
      fetchReviews();
    });

    return {
      reviews,
      reviewToDelete,
      confirmDelete,
      deleteConfirmed,
      cancelDelete,
      formatDate,
      currentPage,
      totalPages,
      paginatedReviews,
      handlePageChange,
    };
  },
};
</script>

<style scoped>
.reviews-table {
  background-color: #f9fafb;
  padding: 20px;
  border-radius: 10px;
  font-family: "Poppins", sans-serif;
  margin: 20px;
}
.section-title {
  font-size: 1.75rem;
  margin-bottom: 20px;
  color: #1a1a1a;
  text-align: center;
}
.reviews-table__table {
  width: 100%;
  border-collapse: collapse;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
.reviews-table__table thead {
  background-color: #1a1a1a;
  color: #ffffff;
}
.reviews-table__table th,
.reviews-table__table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}
.reviews-table__table th {
  font-weight: bold;
}
.reviews-table__table tbody tr:last-child td {
  border-bottom: none;
}
button {
  padding: 5px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: "Poppins", sans-serif;
}
.delete-button {
  background-color: #ff4d4d;
  color: #fff;
  width: 70px;
  font-size: 1rem;
  margin-left: -3px;
  border-radius: 20px;
}
/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.modal h3 {
  margin-top: 0;
}
.modal button {
  margin: 3px;
}
.modal button.cancel-button {
  margin-right: 10px;
  padding: 8px 12px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  background-color: #4e4e4e;
  color: #fff;
}
/* Responsive Styles */
@media (max-width: 600px) {
  .reviews-table__table th,
  .reviews-table__table td {
    padding: 8px;
  }
  .section-title {
    font-size: 1.5rem;
  }
}
</style>
