<template>
  <div>
    <el-header class="header">
      <header-logo></header-logo>
      <div>
        <search-inventory
          class="searchDev"
          :ExpiredFood="Food_expired"
          :ExpiredNonFood="NonFood_expired"
          :NonExpiredFood="Food_nonexpired"
          :NonExpiredNonFood="NonFood_nonexpired"
          :itemsFood="Food"
          :itemsNonFood="NonFood"
        ></search-inventory>
      </div>
      <the-menu></the-menu>
    </el-header>
  </div>
</template>

<script>
import TheMenu from "./TheMenu.vue";
import HeaderLogo from "./HeaderLogo.vue";
import SearchInventory from "./SearchInventory.vue";
import {
  fetchMasterExpiredData,
  fetchShoppingListData,
  fetchMasterNonexpiredData,
} from "@/plugins/Dataservice.js";

export default {
  components: {
    TheMenu,
    HeaderLogo,
    SearchInventory,
  },
  data() {
    return {
      Food_expired: [],
      Food_nonexpired: [],
      NonFood_nonexpired: [],
      NonFood_expired: [],
      Food: [],
      NonFood: [],
    };
  },
  async mounted() {
    try {
      // Fetch master expired data
      const { Food_expired, NonFood_expired } = await fetchMasterExpiredData();
      this.Food_expired = Food_expired;
      this.NonFood_expired = NonFood_expired;
      // Fetch shopping list data
      const { Food, NonFood } = await fetchShoppingListData();
      this.Food = Food;
      this.NonFood = NonFood;
      // Fetch master nonexpired data
      const { Food_nonexpired, NonFood_nonexpired } =
        await fetchMasterNonexpiredData();
      this.Food_nonexpired = Food_nonexpired;
      this.NonFood_nonexpired = NonFood_nonexpired;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
};
</script>

<style scoped>
.inventory {
  display: none;
}
</style>
