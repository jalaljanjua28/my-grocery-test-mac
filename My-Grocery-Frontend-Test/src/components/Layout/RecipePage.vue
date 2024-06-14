<template>
  <div>
    <router-link to="/" style="text-decoration: none">
      <el-page-header content="Recipes"> </el-page-header>
    </router-link>
    <el-main class="main-content">
      <div class="nav-buttons">
        <router-link to="items-inventory" class="router_link">
          <el-button type="primary" size="x-small" plain>Items</el-button>
        </router-link>
        <router-link to="/health-page" class="router_link">
          <el-button type="info" size="x-small" plain style="margin-left: 10px"
            >Health</el-button
          >
        </router-link>
      </div>
      <recipe-prompt></recipe-prompt>
    </el-main>
  </div>
</template>
<script>
import RecipePrompt from "../Data-resources/ChatGPTPrompts/RecipePrompts.vue";
export default {
  components: {
    RecipePrompt,
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>

<style scoped></style>
