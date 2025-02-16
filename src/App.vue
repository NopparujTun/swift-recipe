<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '@/supabase';
import Navbar from '@/components/Navbar.vue';

const session = ref(null);

onMounted(() => {
  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session;
  });

  supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session;
  });
});
</script>

<template>
  <div>
    <!-- Show Navbar if user is authenticated -->
    

    <!-- Router view handles different pages (Home, Account, Auth, etc.) -->
    <router-view />
  </div>
</template>
