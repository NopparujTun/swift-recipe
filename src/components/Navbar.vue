<template>
  <nav class="navbar">
    <div class="nav-logo">
      <img src="/src/assets/logo.jpg" alt="Swift Recipe Logo" />
      <span>Swift Recipe</span>
    </div>

    <button class="hamburger" @click="toggleMenu">
      <span></span>
      <span></span>
      <span></span>
    </button>

    <ul class="nav-links" :class="{ 'open': isMenuOpen }">
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

      <li v-if="user">
        <a @click.prevent="navigateTo('/favorites')">Favorites</a>
        <img v-if="userAvatar" :src="userAvatar" alt="User Avatar" class="avatar" />
        <div v-else class="avatar-placeholder">{{ avatarInitial }}</div>
        <button @click="logout" class="logout-btn">Logout</button>
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
      user: ref(null),
      userAvatar: ref(null),
      userEmail: ref(null),
    };
  },
  async mounted() {
    await this.checkUser();
    supabase.auth.onAuthStateChange((_, session) => {
      this.user = session?.user || null;
      this.userAvatar = session?.user?.user_metadata?.avatar_url || null;
      this.userEmail = session?.user?.email || null;
    });
  },
  computed: {
    avatarInitial() {
      if (this.userEmail) {
        return this.userEmail.charAt(0).toUpperCase();
      }
      return "?"; // Fallback if no email found
    },
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
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
      this.userAvatar = data?.session?.user?.user_metadata?.avatar_url || null;
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

/* Navbar Styling */
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

/* Profile Avatar (Top Right) */
.user-avatar {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Actual Avatar Image */
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ff6f61;
  cursor: pointer;
}

/* Default Letter Avatar */
.avatar-placeholder {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  color: rgb(0, 0, 0);
  background-color: #ffffff;
  border-radius: 50%;
  border: 2px solid #000000;
  cursor: pointer;
}

/* Logout Button */
.logout-btn {
  background: red;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

/* Authentication Links */
.auth-links {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-logo {
  display: flex;
  align-items: center;
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
  gap: 10px; /* Space between items */
}

/* Dropdown menu */
ul li ul.dropdown {
  width: 100%;
  background: #ffffff;
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 999;
  display: none;
  cursor: pointer;
}

ul li ul.dropdown li {
  display: block;
}

ul li:hover ul.dropdown {
  display: block;
}

/* Hamburger Menu for Mobile */
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

/* Responsive */
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
    width: 92.816%;
    
    justify-content: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  .nav-links li {
    flex-direction: column;
    align-items: flex-start;
  }

  .nav-links.open {
    display: flex;
  }

  .nav-links li {
    margin: 0.5rem 0;
  }

  .user-avatar {
    position: absolute;
    right: 20px;
    top: 12px;
  }
}

* {
  font-family: "Poppins", sans-serif;
}
</style>
