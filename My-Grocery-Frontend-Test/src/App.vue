<template>
  <div id="app">
    <loading-page />
    <router-view />
  </div>
</template>

<script>
import LoadingPage from "./components/LoadingPage.vue";

export default {
  components: {
    LoadingPage,
  },
};
</script>
