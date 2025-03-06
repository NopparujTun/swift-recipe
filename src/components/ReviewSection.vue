<template>
  <section class="review-section">
    <div class="review-header">
      <h2 class="review-title">Reviews</h2>
    </div>
    <!-- Review Form -->
    <div class="review-form">
      <h3 class="form-title">Write a Review</h3>
      <textarea
        v-model="comment"
        placeholder="Share your thoughts about this recipe..."
        class="review-textarea"
      ></textarea>
      <button class="post-button" @click="postReview">Post Review</button>
    </div>
    <!-- Reviews List -->
    <div class="reviews-list">
      <div v-for="review in reviews" :key="review.id" class="review-item">
        <div class="review-header-item">
          <div class="reviewer-info">
            <h4 class="review-user">
              {{ review.user_name || "Anonymous" }}
              <span class="review-date-inline">
                {{ formatDate(review.created_at) }}
              </span>
            </h4>
          </div>
          <!-- Action buttons for current user's reviews -->
          <div v-if="review.user_id === currentUserId" class="action-buttons">
            <!-- edit button -->
            <button
              v-if="editingReviewId !== review.id"
              class="edit-button"
              @click="startEditing(review)"
            >
              Edit
            </button>
            <!-- deleting -->
            <button class="delete-button" @click="confirmDelete(review)">
              Delete
            </button>
          </div>
        </div>
        <!-- show textarea with Save/Cancel -->
        <div v-if="editingReviewId === review.id" class="edit-review">
          <textarea v-model="editComment" class="edit-textarea"></textarea>
          <div class="edit-buttons">
            <button class="save-button" @click="updateReview(review.id)">
              Save
            </button>
            <button class="cancel-button" @click="cancelEditing">Cancel</button>
          </div>
        </div>
        
        <p v-else class="review-comment">{{ review.comment }}</p>
      </div>
      <div v-if="reviews.length === 0" class="no-reviews">
        No reviews yet.
      </div>
    </div>
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
    <!-- Delete Success Modal -->
    <div v-if="deleteSuccess" class="modal-overlay">
      <div class="modal">
        <h3>Review deleted successfully</h3>
        <div class="modal-actions">
          <button class="cancel-button" @click="closeSuccessModal">Ok</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { supabase } from "@/supabase.js";

export default {
  name: "ReviewSection",
  props: {
    recipeId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      sortBy: "newest",
      comment: "",
      reviews: [],
      currentUserId: null, 
      editingReviewId: null,
      editComment: "",
      reviewToDelete: null,
      deleteSuccess: false,
    };
  },
  async created() {
    
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (!userError && userData?.user) {
      this.currentUserId = userData.user.id;
    }
    await this.fetchReviews();
  },
  methods: {
    async postReview() {
      // If user is not authenticated, redirect to login page
      if (!this.currentUserId) {
        this.$router.push("/login");
        return;
      }
      if (!this.comment.trim()) return; 

      const userId = this.currentUserId;
      
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user?.user_metadata) {
        console.error("Error retrieving user data:", userError);
        return;
      }
      const displayName =
        userData.user.user_metadata.display_name || "Anonymous";

      
      const { error } = await supabase.from("reviews").insert([
        {
          user_id: userId,
          recipe_id: this.recipeId,
          comment: this.comment,
          user_name: displayName,
        },
      ]);
      if (error) {
        console.error("Error posting review:", error);
      } else {
        await this.fetchReviews();
        this.comment = "";
      }
    },
    async fetchReviews() {
      // reviews 
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("recipe_id", this.recipeId)
        .is("deleted_at", null)
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Error fetching reviews:", error);
      } else {
        this.reviews = data;
      }
    },
    // delete confirmation modal.
    confirmDelete(review) {
      this.reviewToDelete = review;
    },
    async deleteConfirmed() {
      if (!this.reviewToDelete) return;
      // soft delete 
      const { error } = await supabase
        .from("reviews")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", this.reviewToDelete.id);
      if (error) {
        console.error("Error deleting review:", error);
      } else {
        await this.fetchReviews();
        // Show the delete success modal
        this.deleteSuccess = true;
      }
      this.reviewToDelete = null;
    },
    cancelDelete() {
      this.reviewToDelete = null;
    },
    closeSuccessModal() {
      this.deleteSuccess = false;
    },
    startEditing(review) {
      this.editingReviewId = review.id;
      this.editComment = review.comment;
    },
    async updateReview(reviewId) {
      if (!this.editComment.trim()) return; 

      const { error } = await supabase
        .from("reviews")
        .update({ comment: this.editComment })
        .eq("id", reviewId);
      if (error) {
        console.error("Error updating review:", error);
      } else {
        this.editingReviewId = null;
        this.editComment = "";
        await this.fetchReviews();
      }
    },
    cancelEditing() {
      this.editingReviewId = null;
      this.editComment = "";
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      const seconds = Math.floor((new Date() - date) / 1000);

      let interval = Math.floor(seconds / 31536000);
      if (interval >= 1) {
        return interval + (interval === 1 ? " year ago" : " years ago");
      }

      interval = Math.floor(seconds / 2592000);
      if (interval >= 1) {
        return interval + (interval === 1 ? " month ago" : " months ago");
      }

      interval = Math.floor(seconds / 86400);
      if (interval >= 1) {
        return interval + (interval === 1 ? " day ago" : " days ago");
      }

      interval = Math.floor(seconds / 3600);
      if (interval >= 1) {
        return interval + (interval === 1 ? " hour ago" : " hours ago");
      }

      interval = Math.floor(seconds / 60);
      if (interval >= 1) {
        return interval + (interval === 1 ? " minute ago" : " minutes ago");
      }

      return "Just now";
    },
  },
};
</script>

<style scoped>
.review-section {
  margin-bottom: 32px;
  font-family: "poppins", sans-serif;
  text-align: left;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.review-title {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
}

.review-form {
  background-color: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.form-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  margin-top: -1px;
}

.review-textarea {
  width: 98.5%;
  height: 96px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  resize: vertical;
  font-size: 14px;
  margin-bottom: 12px;
}

.post-button {
  background-color: #ff6f61;
  color: #fff;
  border: none;
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 20px;
  cursor: pointer;
}

.post-button:hover {
  background-color: #ff7d71;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.review-item {
  background-color: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.review-header-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.reviewer-info {
  flex: 1;
}

.review-user {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  text-align: left;
  display: inline;
}

.review-date-inline {
  font-size: 0.9rem;
  font-weight: 400;
  color: #777;
  margin-left: 4px;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.edit-button,
.delete-button {
  background: none;
  border: none;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 20px;
}

.edit-button {
  color: #007bff;
}

.edit-button:hover {
  background-color: #e7f1ff;
}

.delete-button {
  color: red;
}

.delete-button:hover {
  text-decoration: underline;
}

.edit-review {
  margin-top: 8px;
}

.edit-textarea {
  width: 98.5%;
  height: 80px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  resize: vertical;
  font-size: 14px;
}

.edit-buttons {
  margin-top: 8px;
  display: flex;
  gap: 8px;
}

.save-button {
  background-color: #ff6f61;
  color: #fff;
  border: none;
  padding: 6px 12px;
  font-size: 0.9rem;
  border-radius: 20px;
  cursor: pointer;
}

.save-button:hover {
  background-color: #ff7d71;
}

.cancel-button {
  background-color: #777;
  color: #fff;
  border: none;
  padding: 6px 12px;
  font-size: 0.9rem;
  border-radius: 20px;
  cursor: pointer;
}

.cancel-button:hover {
  background-color: #555;
}

.review-comment {
  font-size: 1rem;
  color: #000;
  margin: 0;
  text-align: left;
}

.no-reviews {
  text-align: center;
  color: #777;
  font-size: 14px;
  padding: 16px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

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
  text-align: center;
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
.modal button.delete-button {
  margin-right: 10px;
  padding: 8px 12px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  background-color: #ff4d4d;
  color: #fff;
}
</style>
