<template>
  <div id="app">
    <the-header></the-header>
    <the-main></the-main>
    <the-footer></the-footer>
  </div>
</template>

<script>
import TheHeader from "../components/TheHeader.vue";
import TheMain from "../components/TheMain.vue";
import TheFooter from "../components/TheFooter.vue";

export default {
  components: {
    TheHeader,
    TheMain,
    TheFooter,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped></style>
