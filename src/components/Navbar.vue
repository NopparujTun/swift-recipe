<template>
  <nav class="navbar">
    <router-link to="/" class="nav-logo">
      <img src="/src/assets/logo.jpg" alt="Swift Recipe Logo" />
      <span>SwiftRecipe</span>
    </router-link>

    <button class="hamburger" @click="toggleMenu">
      <span></span>
      <span></span>
      <span></span>
    </button>

    <ul class="nav-links" :class="{ open: isMenuOpen }">
      <li><a href="/" @click.prevent="goToHome">Home</a></li>
      <li>
        <a href="/recipes/all" class="dropdown-btn">Recipes</a>
        <ul class="dropdown">
          <li><a @click.prevent="navigateTo('/recipes/maincourse')">Main Course</a></li>
          <li><a @click.prevent="navigateTo('/recipes/dessert')">Dessert</a></li>
          <li><a @click.prevent="navigateTo('/recipes/salad')">Salad</a></li>
          <li><a @click.prevent="navigateTo('/recipes/breakfast')">Breakfast</a></li>
          <li><a @click.prevent="navigateTo('/recipes/vegetarian')">Vegetarian</a></li>
        </ul>
      </li>
      <li><a href="/about">About</a></li>
      <!-- Separate Favorites from the Avatar -->
      <li v-if="user"><a @click.prevent="navigateTo('/favorites')">Favorites</a></li>
      <li v-if="user" class="user-avatar">
        <div class="avatar-wrapper" @click="toggleAvatarDropdown">
          <img v-if="userAvatar" :src="userAvatar" alt="User Avatar" class="avatar" />
          <div v-else class="avatar-placeholder">{{ avatarInitial }}</div>
        </div>
        <ul v-if="isAvatarDropdownOpen" class="avatar-dropdown">
          <li><a @click.prevent="navigateTo('/editprofile')">Edit Profile</a></li>
          <li><a @click.prevent="logout">Logout</a></li>
        </ul>
      </li>
      <li v-if="!user" class="auth-links">
        <a @click.prevent="navigateTo('/signup')">Sign up</a>
        <a @click.prevent="navigateTo('/login')">Login</a>
      </li>
    </ul>
  </nav>
</template>

<script>

import { ref, computed } from "vue";
import { supabase } from "@/supabase.js";

export default {
  data() {
    return {
      isMenuOpen: false,
      isAvatarDropdownOpen: false,
      user: null,
      userAvatar: null,
      userEmail: null,
    };
  },
  async mounted() {
    await this.checkUser();
    supabase.auth.onAuthStateChange((_, session) => {
      this.user = session?.user || null;
      // Get the avatar URL from user metadata if available
      this.userAvatar = session?.user?.user_metadata?.avatar_url || null;
      this.userEmail = session?.user?.email || null;
    });
  },
  computed: {
    avatarInitial() {
      // If a Display Name exists in user metadata, return its first letter (uppercased).
      if (
        this.user &&
        this.user.user_metadata &&
        this.user.user_metadata.display_name
      ) {
        return this.user.user_metadata.display_name.charAt(0).toUpperCase();
      }
      // Otherwise, fallback to using the first letter of the email.
      return this.userEmail ? this.userEmail.charAt(0).toUpperCase() : "?";
    },
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    toggleAvatarDropdown() {
      this.isAvatarDropdownOpen = !this.isAvatarDropdownOpen;
    },
    navigateTo(path) {
      this.$router.push(path);
    },
    goToHome() {
      this.$router.push("/");
    },
    async checkUser() {
      const { data } = await supabase.auth.getSession();
      this.user = data?.session?.user || null;
      this.userAvatar =
        data?.session?.user?.user_metadata?.avatar_url || null;
      this.userEmail = data?.session?.user?.email || null;
    },
    async logout() {
      await supabase.auth.signOut();
      this.user = null;
      this.userAvatar = null;
      this.userEmail = null;
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.user-avatar {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
}

.avatar-wrapper {
  cursor: pointer;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ff6f61;
}

.avatar-placeholder {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  color: #000;
  background-color: #fff;
  border-radius: 50%;
  border: 2px solid #000;
}

.avatar-dropdown {
  position: absolute;
  top: 45px;
  right: 0;
  background: #ffffff;
  border: 1px solid #ddd;
  list-style: none;
  padding: 0.1rem 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  z-index: 100;
  width: 160px;
  
}

.avatar-dropdown li {
  padding: 0.3rem 1rem;
}

.avatar-dropdown li a {
  color: #000000;
  font-family: "Poppins", serif;
  font-weight: bold;
  font-size: 1rem;
}

.avatar-dropdown li a:hover {
  color: #ff6f61;
}

.nav-logo {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.nav-logo img {
  height: 50px;
  margin-right: 0.5rem;
}

.nav-logo span {
  font-size: 1.8rem;
  font-family: "Poppins", serif;
  font-weight: bold;
  color: #1a1a1a;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-links a {
  text-decoration: none;
  font-size: 1rem;
  font-family: "Poppins", sans-serif;
  font-weight: bold;
  color: #1a1a1a;
  transition: color 0.3s ease;
  cursor: pointer;
}

.nav-links a:hover {
  color: #ff6f61;
}

.nav-links li {
  display: flex;
  align-items: center;
  gap: 10px;
}

.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
}

.hamburger span {
  width: 25px;
  height: 3px;
  background: #1a1a1a;
}
.auth-links a {
  border-radius: 20px; 
  padding: 0.5rem 1rem;
  background-color: #f0f0f0; 
  text-decoration: none;
  color: #1a1a1a;
  transition: background-color 0.3s ease;
}

.auth-links a:hover {
  background-color: #e0e0e0; 
}
@media (max-width: 768px) {
  .hamburger {
    display: flex;
  }
  .nav-links {
    display: none;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    background-color: #fff;
    width: 100%;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  .nav-links.open {
    display: flex;
  }
}
* {
  font-family: "Poppins", sans-serif;
}
</style>
