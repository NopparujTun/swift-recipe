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
            <!-- Only show delete button if the review belongs to the current user -->
            <div v-if="review.user_id === currentUserId" class="delete-button-container">
              <button class="delete-button" @click="deleteReview(review.id)">Delete</button>
            </div>
          </div>
          <p class="review-comment">{{ review.comment }}</p>
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
        defaultAvatar: "https://via.placeholder.com/40", // Fallback avatar URL
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
        if (!this.comment.trim()) return; // Prevent posting empty reviews
  
        // Get the current authenticated user.
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData?.user?.id) {
          console.error("User not authenticated", userError);
          return;
        }
        const userId = userData.user.id;
        const displayName = userData.user.user_metadata.display_name || "Anonymous";
        const avatarUrl = userData.user.user_metadata.avatar_url || this.defaultAvatar;
  
        // Insert the new review into the reviews table along with user_name and avatar.
        const { error } = await supabase
          .from("reviews")
          .insert([
            {
              user_id: userId,
              recipe_id: this.recipeId,
              comment: this.comment,
              user_name: displayName,
              avatar: avatarUrl,
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
          console.log("Fetched reviews:", data);
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
    width: 97%;
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
  
  .delete-button-container {
    margin-left: 8px;
  }
  
  .delete-button {
    background: none;
    border: none;
    color: red;
    font-size: 0.9rem;
    cursor: pointer;
  }
  
  .delete-button:hover {
    text-decoration: underline;
  }
  
  .review-comment {
    font-size: 1rem;
    color: #000000;
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
  
  