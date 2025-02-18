<template>
    <div class="reviews-table">
      <h2>Reviews</h2>
      <table>
        <thead>
          <tr>
            <th>User Name</th>
            <th>Review</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="review in reviews" :key="review.id">
            <td>{{ review.userName }}</td>
            <td>{{ review.review }}</td>
            <td>{{ review.createdAt }}</td>
            <td>
              <button @click="editReview(review)">Edit</button>
              <button @click="deleteReview(review.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Edit Modal -->
      <div v-if="editingReview" class="modal-overlay">
        <div class="modal">
          <h2>Edit Review</h2>
          <form @submit.prevent="updateReview">
            <div class="form-group">
              <label>User Name</label>
              <input type="text" v-model="editingReview.userName" required />
            </div>
            <div class="form-group">
              <label>Review</label>
              <textarea v-model="editingReview.review" rows="3" required></textarea>
            </div>
            <div class="modal-actions">
              <button type="button" @click="cancelEdit">Cancel</button>
              <button type="submit">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from "vue";
  import { supabase } from "@/supabase.js";
  
  export default {
    name: "ReviewsTable",
    setup() {
      const reviews = ref([]);
      const editingReview = ref(null);
  
      const fetchReviews = async () => {
        const { data, error } = await supabase.from("reviews").select("*");
        if (error) {
          console.error("Error fetching reviews:", error);
        } else {
          reviews.value = data;
        }
      };
  
      const deleteReview = async (id) => {
        await supabase.from("reviews").delete().eq("id", id);
        fetchReviews();
      };
  
      const editReview = (review) => {
        // Create a copy so that editing doesn't immediately update the table
        editingReview.value = { ...review };
      };
  
      const updateReview = async () => {
        const { error } = await supabase
          .from("reviews")
          .update({
            userName: editingReview.value.userName,
            review: editingReview.value.review,
          })
          .eq("id", editingReview.value.id);
        if (error) {
          console.error("Error updating review:", error);
        } else {
          await fetchReviews();
          editingReview.value = null;
        }
      };
  
      const cancelEdit = () => {
        editingReview.value = null;
      };
  
      onMounted(() => {
        fetchReviews();
      });
  
      return {
        reviews,
        editingReview,
        deleteReview,
        editReview,
        updateReview,
        cancelEdit,
      };
    },
  };
  </script>
  
  <style scoped>
  .reviews-table {
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 20px;
  }
  
  .reviews-table h2 {
    margin-bottom: 20px;
    color: #1a1a1a;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  thead {
    background: #1a1a1a;
    color: #fff;
  }
  
  th,
  td {
    padding: 10px;
    border: 1px solid #ccc;
  }
  
  button {
    padding: 5px 8px;
    border: none;
    border-radius: 4px;
    background: #ff6f61;
    color: #fff;
    cursor: pointer;
    margin-right: 5px;
  }
  
  /* Edit Modal Styles */
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
    padding: 20px;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  .form-group input,
  .form-group textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
  </style>
  