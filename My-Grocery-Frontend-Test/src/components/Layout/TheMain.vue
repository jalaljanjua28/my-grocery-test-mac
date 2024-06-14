<template>
  <div>
    <el-main class="main-content">
      <home-page></home-page>
      <br />
      <barcode-dummy class="barcode" ref="BarcodeDummy" />
    </el-main>
  </div>
</template>

<script>
import BarcodeDummy from "@/views/BarcodeDummy.vue";
import HomePage from "./HomePage.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
  components: {
    BarcodeDummy,
    HomePage,
  },
  data() {
    return {
      currentUser: null,
    };
  },
  mounted() {
    this.checkAuth();
  },
  methods: {
    checkAuth() {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.currentUser = user;
          console.log("User is logged in:", user.email);
          // Ensure simulateUpload is called only after currentUser is set
          this.$refs.BarcodeDummy.simulateUpload(this.currentUser);
        } else {
          console.log("No user is logged in");
        }
      });
    },
  },
};
</script>

<style scoped>
.barcode {
  display: none;
}
</style>
