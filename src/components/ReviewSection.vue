<template>
  <section class="review-section">
    <div class="review-header">
      <h2 class="review-title">Reviews</h2>
    </div>
    <!-- Add Review Form -->
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
            <!-- Show edit button only if not editing this review -->
            <button
              v-if="editingReviewId !== review.id"
              class="edit-button"
              @click="startEditing(review)"
            >
              Edit
            </button>
            <button class="delete-button" @click="deleteReview(review.id)">
              Delete
            </button>
          </div>
        </div>
        <!-- If this review is being edited, show textarea with Save/Cancel -->
        <div v-if="editingReviewId === review.id" class="edit-review">
          <textarea v-model="editComment" class="edit-textarea"></textarea>
          <div class="edit-buttons">
            <button class="save-button" @click="updateReview(review.id)">Save</button>
            <button class="cancel-button" @click="cancelEditing">Cancel</button>
          </div>
        </div>
        <!-- Otherwise show the review comment normally -->
        <p v-else class="review-comment">{{ review.comment }}</p>
      </div>
      <div v-if="reviews.length === 0" class="no-reviews">
        No reviews yet.
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
      currentUserId: null, // Will store the authenticated user's ID
      // New properties for editing reviews
      editingReviewId: null,
      editComment: "",
    };
  },
  async created() {
    // Fetch the current authenticated user and store their ID
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
      if (!this.comment.trim()) return; // Prevent posting empty reviews

      // Since the user is authenticated, use the current user's ID
      const userId = this.currentUserId;
      // Retrieve display name from the authenticated user's metadata
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user?.user_metadata) {
        console.error("Error retrieving user data:", userError);
        return;
      }
      const displayName =
        userData.user.user_metadata.display_name || "Anonymous";

      // Insert the new review into the reviews table along with user_name.
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
        // Refresh the reviews list after posting.
        await this.fetchReviews();
        this.comment = "";
      }
    },
    async fetchReviews() {
      // Fetch all reviews for the given recipe_id.
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("recipe_id", this.recipeId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching reviews:", error);
      } else {
        this.reviews = data;
      }
    },
    async deleteReview(reviewId) {
      // Delete the review with the given id
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", reviewId);
      if (error) {
        console.error("Error deleting review:", error);
      } else {
        await this.fetchReviews();
      }
    },
    startEditing(review) {
      // Set this review as being edited
      this.editingReviewId = review.id;
      this.editComment = review.comment;
    },
    async updateReview(reviewId) {
      if (!this.editComment.trim()) return; // Prevent empty update

      // Update the review comment in the reviews table.
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
      // Cancel editing mode
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

/* Review Form Styles */
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

/* Reviews List Styles */
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

/* Action Buttons Styles */
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
  border-radius: 4px;
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

/* Edit Review Styles */
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

.save-button,
.cancel-button {
  background-color: #1a1a1a;
  color: #fff;
  border: none;
  padding: 6px 12px;
  font-size: 0.9rem;
  border-radius: 20px;
  cursor: pointer;
}

.save-button:hover {
  background-color: #333333;
}

.cancel-button {
  background-color: #777;
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
</style>
