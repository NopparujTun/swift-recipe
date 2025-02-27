<!-- Footer.vue -->
<template>
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-grid">
          <!-- Brand Section -->
          <div class="footer-section">
            <h2 class="brand-title">SwiftRecipe</h2>
            <p class="brand-description">
                Your simplest and quickest food recipes, all in one place.
            </p>
            <div class="social-icons">
              <a href="#" class="social-icon" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.325v21.351C0 23.403.597 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.312h3.587l-.467 3.622h-3.12V24h6.116C23.403 24 24 23.403 24 22.675V1.325C24 .597 23.403 0 22.675 0z"/>
                </svg>
              </a>
              <a href="#" class="social-icon" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.337 3.608 1.312.975.975 1.25 2.242 1.312 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.337 2.633-1.312 3.608-.975.975-2.242 1.25-3.608 1.312-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.337-3.608-1.312-.975-.975-1.25-2.242-1.312-3.608C2.175 15.747 2.163 15.367 2.163 12s.012-3.584.07-4.85c.062-1.366.337-2.633 1.312-3.608C4.522 2.5 5.789 2.225 7.155 2.163 8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.771.131 4.602.388 3.678 1.312 2.755 2.235 2.498 3.404 2.439 4.685.013 8.332 0 8.741 0 12s.013 3.668.072 4.948c.059 1.281.316 2.45 1.24 3.374.924.924 2.093 1.181 3.374 1.24C8.332 23.987 8.741 24 12 24s3.668-.013 4.948-.072c1.281-.059 2.45-.316 3.374-1.24.924-.924 1.181-2.093 1.24-3.374.059-1.28.072-1.689.072-4.948s-.013-3.668-.072-4.948c-.059-1.281-.316-2.45-1.24-3.374C19.398.388 18.229.131 16.948.072 15.668.013 15.259 0 12 0z"/>
                  <path d="M12 5.838a6.162 6.162 0 1 0 0 12.324A6.162 6.162 0 0 0 12 5.838zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998z"/>
                  <circle cx="18.406" cy="5.594" r="1.44"/>
                </svg>
              </a>
              <a href="#" class="social-icon" aria-label="Twitter">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 4.557a9.83 9.83 0 0 1-2.828.775A4.932 4.932 0 0 0 23.337 3.1a9.864 9.864 0 0 1-3.127 1.195A4.916 4.916 0 0 0 16.616 3c-2.73 0-4.942 2.214-4.942 4.942 0 .388.044.765.127 1.124C7.728 8.94 4.1 6.85 1.67 3.149c-.427.734-.667 1.588-.667 2.488 0 1.718.874 3.23 2.202 4.121a4.902 4.902 0 0 1-2.237-.618v.062c0 2.404 1.71 4.408 3.977 4.861a4.932 4.932 0 0 1-2.224.085c.626 1.956 2.444 3.379 4.6 3.42A9.867 9.867 0 0 1 0 19.539a13.94 13.94 0 0 0 7.548 2.212c9.055 0 14.009-7.496 14.009-13.986 0-.213-.005-.425-.014-.636A10.012 10.012 0 0 0 24 4.557z"/>
                </svg>
              </a>
              <a href="#" class="social-icon" aria-label="Youtube">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a2.997 2.997 0 0 0-2.112-2.116C19.794 3.5 12 3.5 12 3.5s-7.794 0-9.386.57A2.997 2.997 0 0 0 .502 6.186 31.31 31.31 0 0 0 0 12a31.31 31.31 0 0 0 .502 5.814 2.997 2.997 0 0 0 2.112 2.116C4.206 20.5 12 20.5 12 20.5s7.794 0 9.386-.57a2.997 2.997 0 0 0 2.112-2.116A31.31 31.31 0 0 0 24 12a31.31 31.31 0 0 0-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
  
          <!-- Quick Links -->
          <div class="footer-section">
            <h3 class="footer-heading">Quick Links</h3>
            <ul class="footer-list">
              <li><a href="/">Home</a></li>
              <li><a href="/recipes/all">All Recipes</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/favorites">Favorites</a></li>
            </ul>
          </div>
  
          <!-- Categories -->
          <div class="footer-section">
            <h3 class="footer-heading">Categories</h3>
            <ul class="footer-list">
              <li><a href="/recipes/maincourse">Main Course</a></li>
              <li><a href="/recipes/dessert">Dessert</a></li>
              <li><a href="/recipes/salad">Salad</a></li>
              <li><a href="/recipes/breakfast">Breakfast</a></li>
              <li><a href="/recipes/vegetarian">Vegeterian</a></li>
            </ul>
          </div>
  
          <!-- Contact -->
          <div class="footer-section">
            <h3 class="footer-heading">Contact Us</h3>
            <ul class="footer-list">
              <li>Email: nopparujtunnukij@hotmail.com</li>
              <li>Phone: 086-353-5263</li>
              <li>
                Address: 456 LetMeCook Street,<br />
                KingOfFood City, Foodland 52100
              </li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2025 SwiftRecipe. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </template>
  
  <script>
  export default {
    name: "Footer",
  };
  </script>
  
  <style scoped>
  .footer {
    background-color: #1a1a1a; 
    color: #d1d5db; 
    padding: 2rem 0;
  }
  
  .footer-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
  }
  
  .footer-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  @media (min-width: 768px) {
    .footer-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }
  

  
  .brand-title {
  font-size: 1.5rem;
  font-weight: bold;
  background: linear-gradient(to right, #ff914d, #ff6f61, #ff9370);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
  text-align: left;
}

  
  .brand-description {
    font-size: 0.875rem;
    margin-bottom: 1rem;
    line-height: 1.4;
    text-align: left;
  }
  
  .social-icons {
    display: flex;
    gap: 1rem;
  }
  
  .social-icon {
    display: inline-block;
    width: 20px;
    height: 20px;
    color: #d1d5db;
    transition: color 0.3s ease;
  }
  
  .social-icon:hover {
    color: #f97316;
  }
  
  .footer-heading {
    font-weight: 600;
    margin-bottom: 1rem;
    color: #ffffff;
    text-align: left;
  }
  
  .footer-list {
    list-style: none;
    padding: 0;
    margin: 0;
    font-size: 0.875rem;
  }
  
  .footer-list li {
    margin-bottom: 0.5rem;
    line-height: 1.4;
    text-align: left;
  }
  
  .footer-list li a {
    color: #d1d5db;
    text-decoration: none;
    transition: color 0.3s ease;
  }
  
  .footer-list li a:hover {
  background: linear-gradient(to right, #ff914d, #ff6f61, #ff9370);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
  
  .footer-bottom {
    border-top: 1px solid #2d2d2d;
    margin-top: 2rem;
    padding-top: 2rem;
    text-align: center;
    font-size: 0.875rem;
    color: #d1d5db;
  }
  </style>
  