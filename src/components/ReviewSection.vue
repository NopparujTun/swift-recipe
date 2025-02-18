<template>
    <section class="review-section">
      <div class="review-header">
        <h2 class="review-title">Reviews</h2>
        <div class="sort-section">
          <!-- Sorting options if needed -->
        </div>
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
        <div
          v-for="review in reviews"
          :key="review.id"
          class="review-item"
        >
          <div class="review-header-item">
            <div class="reviewer-info">
              <h4 class="review-user">
                {{ review.user_name || "Anonymous" }}
              </h4>
            </div>
            <span class="review-date">
              {{ formatDate(review.created_at) }}
            </span>
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
        defaultAvatar: "https://via.placeholder.com/40", // Fallback avatar URL
      };
    },
    async created() {
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
      formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString();
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
  

  .icon-chevron {
    width: 16px;
    height: 16px;
    margin-left: 4px;
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
    align-items: flex-start;
    margin-bottom: 12px;
  }
  
  .review-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 12px;
  }
  
  .reviewer-info {
    flex: 1;
  }
  
  .review-user {
    font-size: 16px;
    font-weight: 600;
    margin: 0;
    text-align: left;
  }
  
  .review-date {
    font-size: 1rem;
    font-weight: 600;
    color: #000000;
    
  }
  
  .review-comment {
    font-size: 14px;
    color: #000000;
    margin: 0;
    text-align: left;
    font-size: 1rem;
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
  