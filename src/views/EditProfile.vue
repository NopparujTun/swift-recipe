<template>
  <Navbar/>
  <div class="edit-profile">
    <h2>Edit Profile</h2>
    <div class="profile-form">
      <div class="input-group">
        <label for="displayName">Display Name</label>
        <input
          id="displayName"
          v-model="newDisplayName"
          type="text"
          placeholder="Enter your display name"
        />
        <!-- error message -->
        <p v-if="usernameError" class="error-message">{{ usernameError }}</p>
      </div>
      <div class="button-group">
        <button @click="saveProfile" class="Savebtn">Save</button>
        <button @click="cancelEdit">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { supabase } from "@/supabase.js";
import { useRouter } from "vue-router";
import Navbar from "@/components/Navbar.vue";

export default {
  components: { Navbar },
  setup() {
    const router = useRouter();
    const user = ref(null);
    const newDisplayName = ref("");
    const usernameError = ref("");

    
    onMounted(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        user.value = session.user;
        newDisplayName.value = session.user.user_metadata.display_name || "";
        
        const { data, error } = await supabase
          .from("profiles")
          .select("display_name")
          .eq("id", user.value.id)
          .single();
        if (data) {
          newDisplayName.value = data.display_name || newDisplayName.value;
        }
      }
    });

    
    const saveProfile = async () => {
  usernameError.value = "";

  // Check length between 3 and 20 characters.
  if (newDisplayName.value.length < 3 || newDisplayName.value.length > 20) {
    usernameError.value = "Display name must be between 3 and 20 characters.";
    return;
  }

  // Validate the name 
  const usernameRegex = /^[A-Za-z0-9][A-Za-z0-9_]*$/;
  if (!usernameRegex.test(newDisplayName.value)) {
    usernameError.value =
      "Please only use letters, numbers, or underscores (underscore cannot be the first letter)";
    return;
  }

  
  const { error: authError } = await supabase.auth.updateUser({
    data: { display_name: newDisplayName.value },
  });
  if (authError) {
    console.error("Error updating auth user:", authError);
  }

  
  const { error: profileError } = await supabase
    .from("profiles")
    .upsert({
      id: user.value.id,
      display_name: newDisplayName.value,
    });
  if (profileError) {
    console.error("Error updating profile:", profileError);
  } else {
    // Update reviews with the new display name.
    const { error: reviewError } = await supabase
      .from("reviews")
      .update({ user_name: newDisplayName.value })
      .eq("user_id", user.value.id);
    if (reviewError) {
      console.error("Error updating reviews:", reviewError);
    }
    
    router.push("/");
  }
};


    const cancelEdit = () => {
      router.back();
    };

    return {
      newDisplayName,
      usernameError,
      saveProfile,
      cancelEdit,
    };
  },
};
</script>

<style scoped>
.edit-profile {
  max-width: 500px;
  margin: 2rem auto;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
}
.profile-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.input-group {
  display: flex;
  flex-direction: column;
}
.input-group label {
  margin-bottom: 0.5rem;
  font-weight: bold;
}
.input-group input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 20px;
}
.error-message {
  color: red;
  margin-top: 0.5rem;
  font-size: 14px;
}
.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 5px;
}
.button-group button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 20px;
  cursor: pointer;
}
.button-group button:first-child {
  background-color: #ff6f61;
  color: #fff;
}
.button-group button:last-child {
  background-color: #ccc;
  color: #000;
}
button.Savebtn {
  background: linear-gradient(to right, #ff914d, #ff6f61, #ff9370);
}
</style>
