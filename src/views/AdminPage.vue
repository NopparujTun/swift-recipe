<template>
  <div class="admin-page">
    <Sidebar />
    <main class="admin-content">
      
      <router-view />
    </main>
  </div>
</template>

<script>
import Sidebar from "@/components/Sidebar.vue";



export default {
  name: "AdminPage",
  components: {
    Sidebar,

  },
};
</script>

<style scoped>
.admin-page {
  display: flex;
  height: 100vh;
  background: #E5E5E8;
}

.admin-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: #E5E5E8;
}
</style>
