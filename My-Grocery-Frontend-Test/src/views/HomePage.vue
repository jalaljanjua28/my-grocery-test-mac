<template>
  <div>
    <div class="searchInventory">
      <search-inventory
        :ExpiredFood="Food_expired"
        :ExpiredNonFood="NonFood_expired"
        :NonExpiredFood="Food_nonexpired"
        :NonExpiredNonFood="NonFood_nonexpired"
        :itemsFood="Food"
        :itemsNonFood="NonFood"
      />
    </div>
    <div class="nav-buttons">
      <router-link to="items-inventory" class="router_link">
        <el-button type="primary" size="x-small" plain>Items</el-button>
      </router-link>
      <router-link to="/recipes-page" class="router_link">
        <el-button type="warning" size="x-small" plain style="margin-left: 10px"
          >Recipes</el-button
        >
      </router-link>
      <router-link to="/health-page" class="router_link">
        <el-button type="info" size="x-small" plain style="margin-left: 10px"
          >Health</el-button
        >
      </router-link>
      <router-link to="user-defined-prompt" class="router_link">
        <el-button type="danger" size="x-small" plain style="margin-left: 10px">
          User Defined Prompt</el-button
        >
      </router-link>
    </div>
    <div v-if="displayJokes">
      <el-card v-for="(joke, index) in jokes" :key="index">
        <p class="joke-card">
          {{ joke["Food Joke"] }}
        </p>
        <el-button :loading="loading" type="info" @click="gptJokes()" plain
          >Generate Prompt</el-button
        >
      </el-card>
    </div>
    <offers-page></offers-page>
    <el-card>
      <section>
        <el-tabs
          v-model="outerActiveTab"
          @tab-click="handleOuterTabClick"
          class="custom-tabs"
        >
          <el-tab-pane name="1" label="Food"
            ><span slot="label" class="el-tabs__label"
              ><i class="el-icon-food"></i> Food</span
            >
            <div>
              <purchased-list
                :items="Food_nonexpired"
                @item-deleted="handleItemDeleted()"
              ></purchased-list>
            </div>
          </el-tab-pane>
          <el-tab-pane name="2" label="Not Food">
            <span slot="label" class="el-tabs__label"
              ><i class="el-icon-bicycle"></i> Non Food</span
            >
            <div>
              <purchased-list
                :items="NonFood_nonexpired"
                @item-deleted="handleItemDeleted()"
              ></purchased-list>
            </div>
          </el-tab-pane>
        </el-tabs>
      </section>
      <delete-all-purchase-list></delete-all-purchase-list>
    </el-card>
    <home-prompt></home-prompt>
  </div>
</template>

<script>
import OffersPage from "@/views/OffersList.vue";
import HomePrompt from "../components/HomePrompts.vue";
import PurchasedList from "../components/PurchasedList.vue";
import DeleteAllPurchaseList from "../components/DeleteAllPurchaseList.vue";
import {
  fetchPurchasedListData,
  fetchMasterExpiredData,
  fetchShoppingListData,
} from "@/plugins/Dataservice.js";
import SearchInventory from "../components/SearchInventory.vue";
import { auth } from "../Firebase.js";

const baseUrl = "http://127.0.0.1:8081";

export default {
  components: {
    OffersPage,
    HomePrompt,
    PurchasedList,
    DeleteAllPurchaseList,
    SearchInventory,
  },
  data() {
    return {
      loading: false,
      outerActiveTab: null,
      jokes: [],
      displayJokes: false,
      Food: [],
      NonFood: [],
      Food_nonexpired: [],
      NonFood_nonexpired: [],
      item: [],
    };
  },
  async mounted() {
    try {
      await this.jsonJokes();
      const { Food_nonexpired, NonFood_nonexpired } =
        await fetchPurchasedListData();
      this.Food_nonexpired = Food_nonexpired;
      this.NonFood_nonexpired = NonFood_nonexpired;
      const { Food_expired, NonFood_expired } = await fetchMasterExpiredData();
      this.Food_expired = Food_expired;
      this.NonFood_expired = NonFood_expired;
      // Fetch shopping list data
      const { Food, NonFood } = await fetchShoppingListData();
      this.Food = Food;
      this.NonFood = NonFood;
    } catch (error) {
      console.error("Error loading data:", error);
    }
  },
  created() {
    // Retrieve the active tab from local storage on page load
    const storedOuterTab = localStorage.getItem("activeOuterTab");
    console.log(storedOuterTab);
    const storedInnerTab = localStorage.getItem("activeInnerTab");
    console.log(storedInnerTab);
    if (storedOuterTab && storedInnerTab) {
      this.outerActiveTab = storedOuterTab;
      this.innerActiveTab = storedInnerTab;
    }
  },
  methods: {
    handleItemDeleted(itemToDelete) {
      this.items = this.items.filter((item) => item !== itemToDelete);
      // You can access the deleted item and target tab name here
      console.log("Deleted Item:", itemToDelete);
      // Update the active tab when an item is deleted
    },
    handleInnerTabClick(tab) {
      // Update the local storage on inner tab change
      localStorage.setItem("activeInnerTab", tab.name);
      console.log("Inner Tab: " + this.innerActiveTab);
    },
    handleOuterTabClick(tab) {
      // Update the local storage on outer tab change
      localStorage.setItem("activeOuterTab", tab.name);
      console.log("Outer Tab: " + this.outerActiveTab);
    },

    async jsonJokes() {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          throw new Error("User not authenticated");
        }
        const idToken = await currentUser.getIdToken(/* forceRefresh */ true);
        console.log("idToken", idToken);

        this.loading = true;
        const response = await fetch(baseUrl + "/api/jokes-using-json", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Data Received:", data);

        if (data.jokes) {
          this.jokes = data.jokes;
        } else {
          this.errorMessage = "Error retrieving jokes.";
        }

        this.loading = false;
      } catch (error) {
        console.error("Error:", error);
        this.errorMessage = "Error retrieving jokes.";
        this.loading = false;
      }
      this.displayJokes = true;
    },

    async gptJokes() {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          throw new Error("User not authenticated");
        }
        const idToken = await currentUser.getIdToken(/* forceRefresh */ true);
        console.log("idToken", idToken);

        this.loading = true;
        await fetch(baseUrl + "/api/jokes-using-gpt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({}),
        });

        const response = await fetch(baseUrl + "/api/jokes-using-gpt", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Data Received:", data);

        if (data.jokes) {
          this.jokes = data.jokes;
        } else {
          this.errorMessage = "Error retrieving jokes.";
        }

        this.loading = false;
      } catch (error) {
        console.error("Error in gptJokes:", error);
        this.errorMessage = error.message;
        this.loading = false;
      }
    },
  },
};
</script>
<style scoped>
.el-page-header {
  display: none !important;
}
@media screen and (max-width: 600px) {
  .searchInventory {
    width: 100%;
    margin-bottom: 20px;
  }
}
@media screen and (min-width: 600px) {
  .searchInventory {
    display: none;
  }
  .el-select {
    display: none;
  }
}
</style>
