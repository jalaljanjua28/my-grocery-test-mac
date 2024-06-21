<template>
  <div>
    <router-link to="/" style="text-decoration: none">
      <el-page-header content="User Defined Prompt"></el-page-header>
    </router-link>
    <el-main class="main-content">
      <el-card>
        <el-select
          v-model="selectedPrompt"
          placeholder="Select Prompt"
          style="margin-bottom: 20px; width: max-content"
        >
          <el-option
            label="Food Waste Reduction"
            value="foodWasteReduction"
          ></el-option>
          <el-option label="Mood Changer" value="moodChanger"></el-option>
          <el-option
            label="Food Cusine Suggestions"
            value="cusineSuggestion"
          ></el-option>
          <el-option label="Defined Dishes" value="definedDishes"></el-option>
          <el-option label="Unique Recipe" value="uniqueRecipes"></el-option>
        </el-select>
        <el-autocomplete
          popper-class="my-autocomplete"
          v-model="selectedOption"
          :fetch-suggestions="querySearch"
          placeholder="Please input"
          @select="handleSelect"
        >
          <i
            class="el-icon-edit el-input__icon"
            slot="suffix"
            @click="handleIconClick"
          >
          </i>
          <template slot-scope="{ item }">
            <div class="value">{{ item }}</div>
          </template>
        </el-autocomplete>
        <div v-if="loading" class="loading-indicator">
          <el-spinner></el-spinner>
        </div>
        <div v-if="displayWasteReduction && !loading">
          <div
            v-for="(suggestion, index) in foodWasteReductionSuggestions"
            :key="index"
            :style="{ height: 'auto' }"
          >
            <p>
              <strong>Food Waste Reduction Suggestion:</strong>
              {{ suggestion["Food Waste Reduction Suggestion"] }}
            </p>
          </div>
          <el-alert
            v-if="foodWasteReductionSuggestions.length === 0"
            title="No Suggestions"
            type="info"
            show-icon
            class="no-suggestion"
          >
            No suggestions available.
          </el-alert>
          <div>
            <div v-if="displayMood && !loading">
              <div
                v-for="(suggestion, index) in moodChangerSuggestions"
                :key="index"
              >
                <p>
                  <strong>Food Suggestion: </strong>
                  {{ suggestion["Food Suggestion"] }}
                </p>
              </div>
              <el-alert
                v-if="moodChangerSuggestions.length === 0"
                title="No Mood Changer Suggestions"
                type="info"
                show-icon
              >
                No Mood Changer suggestions available.
              </el-alert>
            </div>
          </div>
        </div>
        <div v-if="displaySuggestions && !loading">
          <div v-for="(suggestion, index) in fusionSuggestions" :key="index">
            <p>
              <strong> Fusion Cuisine Suggestion:</strong>
              {{ suggestion["Fusion Cuisine Suggestion"] }}
            </p>
          </div>
          <el-alert
            v-if="fusionSuggestions.length === 0"
            title="No Fusion Cuisine Suggestions"
            type="info"
            show-icon
          >
            No Fusion Cuisine suggestions available.
          </el-alert>
        </div>
        <div v-if="displayDishes && !loading">
          <div v-for="(fact, index) in definedDishes" :key="index">
            <p><strong>Fun Facts:</strong> {{ fact["Fun Facts"] }}</p>
          </div>
          <el-alert
            v-if="definedDishes.length === 0"
            title="No Fun Facts"
            type="info"
            show-icon
          >
            No Fun Facts available.
          </el-alert>
        </div>
        <div v-if="displayRecipe && !loading">
          <div v-for="(recipe, index) in uniqueRecipes" :key="index">
            <p><strong>Recipe:</strong> {{ recipe["Recipe"] }}</p>
            <p>
              <strong>Encouragement:</strong>
              {{ recipe["Encouragement"] }}
            </p>
          </div>
          <el-alert
            v-if="uniqueRecipes.length === 0"
            title="No Recipes"
            type="info"
            show-icon
          >
            No Recipes available.
          </el-alert>
        </div>
      </el-card>
    </el-main>
  </div>
</template>

<script>
const baseURL = "http://127.0.0.1:8081";
import { auth } from "../Firebase.js";
import { onAuthStateChanged } from "firebase/auth"; // Adjust import based on your Firebase setup

export default {
  data() {
    return {
      selectedPrompt: "",
      selectedOption: "",
      foodWasteReductionSuggestions: [],
      moodChangerSuggestions: [],
      fusionSuggestions: [],
      definedDishes: [],
      uniqueRecipes: [],
      loading: false,
      displayWasteReduction: false,
      displayMood: false,
      displaySuggestions: false,
      displayDishes: false,
      displayRecipe: false,
      currentUser: null,
    };
  },
  methods: {
    async checkAuthState() {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          this.currentUser = user;
          console.log("User is logged in:", user.email);
        } else {
          console.log("No user is logged in");
          this.currentUser = null;
        }
      }); // <-- Added closing parenthesis here
    },
    async querySearch(queryString, cb) {
      let options = [];
      if (this.selectedPrompt === "foodWasteReduction") {
        this.displayWasteReduction = true;
        this.displayMood = false;
        this.displaySuggestions = false;
        this.displayDishes = false;
        this.displayRecipe = false;
        options = [
          "Suggest a recipe that helps reduce food waste.",
          "Provide tips on reducing food waste in the kitchen.",
          "Recommend creative ways to repurpose leftover ingredients.",
          "Share ideas for sustainable meal planning to minimize food waste.",
          "How can I use vegetable scraps to create flavorful broths or stocks?",
          "Give suggestions on preserving fruits and vegetables to extend their shelf life.",
          "What are some zero-waste cooking techniques for a more sustainable kitchen?",
          "Share innovative ways to use overripe fruits in desserts or snacks.",
          "Provide tips on storing fresh herbs to prevent them from going bad.",
          "Suggest ways to use stale bread to avoid food waste.",
        ];
      } else if (this.selectedPrompt === "moodChanger") {
        this.displayWasteReduction = false;
        this.displayMood = true;
        this.displaySuggestions = false;
        this.displayDishes = false;
        this.displayRecipe = false;
        options = [
          "Suggest a recipe to boost your mood.",
          "Provide tips on foods that can improve your mood.",
          "Recommend mood-boosting foods to include in your diet.",
          "Share ideas for creating meals that promote happiness.",
          "How can certain foods positively impact your mood?",
          "Give suggestions on foods to avoid for a better mood.",
          "What are some mood-enhancing recipes for a happier lifestyle?",
          "Share innovative ways to incorporate mood-boosting ingredients into your meals.",
          "Provide tips on meal planning for a better mood.",
          "Suggest snacks to improve your mood throughout the day.",
        ];
      } else if (this.selectedPrompt === "cusineSuggestion") {
        this.displayWasteReduction = false;
        this.displayMood = false;
        this.displaySuggestions = true;
        this.displayDishes = false;
        this.displayRecipe = false;
        options = [
          "Italian and Japanese",
          "Mexican and Chinese",
          "Indian and French",
          "Chinese and English",
          "Indian and Italian",
        ];
      } else if (this.selectedPrompt === "definedDishes") {
        this.displayWasteReduction = false;
        this.displayMood = false;
        this.displaySuggestions = false;
        this.displayDishes = true;
        this.displayRecipe = false;
        options = [
          "Sweet Dishes",
          "Chicken Dishes",
          "Meat Dishes",
          "Milk Dishes",
        ];
      } else if (this.selectedPrompt === "uniqueRecipes") {
        this.displayWasteReduction = false;
        this.displayMood = false;
        this.displaySuggestions = false;
        this.displayDishes = false;
        this.displayRecipe = true;
        options = [
          "banana rice apple",
          "apple rice pie",
          "rice mango tomatoes",
          "onions olives cheese",
          "tomatoes meat onions garlic spices",
        ];
      }

      const results = queryString
        ? options.filter((option) =>
            option.toLowerCase().includes(queryString.toLowerCase())
          )
        : options;
      cb(results);
    },
    async handleSelect(item) {
      this.selectedOption = item;
      this.loading = true;

      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          throw new Error("User not authenticated");
        }
        const idToken = await currentUser.getIdToken(/* forceRefresh */ true);
        let endpoint;

        if (this.selectedPrompt === "foodWasteReduction") {
          endpoint = "/api/food-waste-reduction-using-gpt";
        } else if (this.selectedPrompt === "moodChanger") {
          endpoint = "/api/mood-changer-using-gpt";
        } else if (this.selectedPrompt === "cusineSuggestion") {
          endpoint = "/api/fusion-cuisine-suggestion-using-gpt";
        } else if (this.selectedPrompt === "definedDishes") {
          endpoint = "/api/user-defined-dish-using-gpt";
        } else if (this.selectedPrompt === "uniqueRecipes") {
          endpoint = "/api/unique-recipes-using-gpt";
        }

        if (endpoint) {
          const response = await fetch(baseURL + endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
            body: JSON.stringify({ user_input: item }),
          });
          const data = await response.json();

          this.foodWasteReductionSuggestions =
            data.foodWasteReductionSuggestions || [];
          this.moodChangerSuggestions = data.moodChangerSuggestions || [];
          this.fusionSuggestions = data.fusionSuggestions || [];
          this.definedDishes = data.definedDishes || [];
          this.uniqueRecipes = data.uniqueRecipes || [];
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.loading = false;
      }
    },
    handleIconClick() {
      this.selectedOption = "";
      this.selectedPrompt = "";
    },
    fetchData() {
      // Placeholder for any additional logic to fetch data when selectedPrompt or selectedOption changes.
      // This method can be expanded based on further requirements.
    },
  },
  watch: {
    selectedPrompt: {
      handler: "fetchData", // Call fetchData when selectedPrompt changes
      immediate: true, // Call fetchData initially when the component loads
    },
    selectedOption: "fetchData", // Call fetchData when selectedOption changes
  },
};
</script>

<style scoped>
.suggestions-container {
  margin-top: 20px;
}

.suggestion-item {
  background-color: #f5f5f5;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
}

.suggestion-item p {
  margin: 0;
  color: #333;
}
</style>
