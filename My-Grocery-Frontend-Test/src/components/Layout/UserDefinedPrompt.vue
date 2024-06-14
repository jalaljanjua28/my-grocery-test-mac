<template>
  <div>
    <router-link to="/" style="text-decoration: none">
      <el-page-header content="User Defined Prompt"> </el-page-header>
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
            :body-style="{ height: 'auto' }"
          >
            <p>
              <strong>Food Waste Reduction Suggestion:</strong>
              {{ suggestion["Food Waste Reduction Suggestion"] }}
            </p>
          </div>
          <el-alert
            v-if="suggestions && suggestions.length === 0"
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
                  <strong>Food Suggestion: </strong
                  >{{ suggestion["Food Suggestion"] }}
                </p>
              </div>
            </div>
            <div v-if="displayMood.length === 0 && !loading">
              <el-alert
                title="No Mood Changer Suggestion"
                type="info"
                show-icon
              >
                No Mood Changer Suggestion available.
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
        </div>
        <div v-if="displayDishes && !loading">
          <div v-for="(fact, index) in definedDishes" :key="index">
            <p><strong>Fun Facts:</strong> {{ fact["Fun Facts"] }}</p>
          </div>
        </div>
        <div v-if="displayRecipe && !loading">
          <div v-for="(recipe, index) in uniqueRecipes" :key="index">
            <p><strong>Recipe:</strong> {{ recipe["Recipe"] }}</p>
            <p>
              <strong>Encouragement:</strong>
              {{ recipe["Encouragement"] }}
            </p>
          </div>
        </div>
      </el-card>
    </el-main>
  </div>
</template>

<script>
const baseURL = "http://127.0.0.1:8081";

export default {
  data() {
    return {
      selectedPrompt: "",
      selectedOption: "",
      loading: false,
      displayMood: "false",
      displayWasteReduction: false,
      displayDishes: false,
      displayRecipe: false,
      displaySuggestions: false,
      foodWasteReductionSuggestions: [],
      moodChangerSuggestions: [],
      fusionSuggestions: [],
      definedDishes: [],
      uniqueRecipes: [],
    };
  },
  methods: {
    querySearch(queryString, cb) {
      const options = this.loadAll();
      const filteredOptions = options.filter((option) =>
        option.toLowerCase().includes(queryString.toLowerCase())
      );
      cb(filteredOptions);
    },
    loadAll() {
      if (this.selectedPrompt === "foodWasteReduction") {
        return [
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
        return [
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
        return [
          "Italian and Japanese",
          "Mexican and Chinese",
          "Indian and French",
          "Chinese and English",
          "Indian and Italian",
        ];
      } else if (this.selectedPrompt === "definedDishes") {
        return ["Sweet Dishes", "Chicken Dishes", "Meat Dishes", "Milk Dishes"];
      } else if (this.selectedPrompt === "uniqueRecipes") {
        return [
          "banana rice apple",
          "apple rice pie",
          "rice mango tomatoes",
          "onions olives cheese",
          "tomatoes meat onions garlic spices",
        ];
      } else {
        return [];
      }
    },
    async handleSelect(item) {
      try {
        this.loading = true;
        this.selectedOption = item;
        const user_input = item;
        let endpoint;
        if (this.selectedPrompt === "foodWasteReduction") {
          endpoint = "/api/food-waste-reduction-using-gpt";
        } else if (this.selectedPrompt === "moodChanger") {
          endpoint = "/api/mood-changer-using-gpt";
        } else if (this.selectedPrompt === "fusionSuggestions") {
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
            },
            body: JSON.stringify({ user_input }),
          });
          const data = await response.json();
          this.foodWasteReductionSuggestions =
            data.Food_Waste_Reduction_Suggestions;
          this.moodChangerSuggestions = data.Mood_Changer;
          this.fusionSuggestions = data.Fusion_Cuisine_Suggestions;
          this.definedDishes = data.User_Defined_Dish;
          this.uniqueRecipes = data.Unique_Recipes;
        }
        this.loading = false;
        this.displayWasteReduction = true;
        this.displayDishes = true;
        this.displayRecipe = true;
        this.displaySuggestions = true;
      } catch (error) {
        this.error = error.message;
      }
    },
    handleIconClick(ev) {
      console.log(ev);
      this.selectedOption = "";
      this.selectedPrompt = "";
    },
  },
};
</script>

<style scoped>
/* .my-autocomplete {
  li {
    line-height: normal;
    padding: 7px;

    .value {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .link {
      font-size: 12px;
      color: #b4b4b4;
    }
  }
} */
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
