<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '@/supabase';


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
    <router-view />
  </div>
</template>
