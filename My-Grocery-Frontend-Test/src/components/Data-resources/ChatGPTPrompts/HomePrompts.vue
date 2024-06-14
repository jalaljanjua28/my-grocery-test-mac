<template>
  <el-card>
    <el-collapse :accordion="true">
      <div>
        <!-- Food Waste Reduction Suggestions Section -->
        <el-collapse-item title="Food Waste Reduction Suggestions">
          <div>
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
            </div>
          </div>
        </el-collapse-item>
        <!-- Ethical Eating Suggestions Section -->
        <el-collapse-item title="Ethical Eating Suggestions">
          <div>
            <!-- Loading indicator -->
            <div v-if="loading" class="loading-indicator">
              <el-spinner></el-spinner>
            </div>
            <div v-if="displayEthicalSuggestions && !loading">
              <!-- Display generated suggestions -->
              <div
                v-for="(group, index) in ethicalEatingSuggestions"
                :key="index"
              >
                <div>
                  <strong>Ingredients:</strong>
                  {{ group["Group of Items"].join(", ") }}
                </div>
                <p>
                  <strong>Ethical Eating Suggestions:</strong>
                  {{ group["Ethical Eating Suggestions"] }}
                </p>
              </div>
              <el-button
                @click="
                  fetchData(
                    'gpt',
                    '/api/ethical-eating-suggestion-using-gpt',
                    'ethicalEatingSuggestions'
                  )
                "
                :loading="loading"
                type="info"
                plain
                style="margin-left: 0px !important"
              >
                Generate Prompt
              </el-button>
            </div>
          </div>
        </el-collapse-item>
        <!-- Fun Facts Section -->
        <el-collapse-item title="Fun Facts">
          <div>
            <div v-if="loading" class="loading-indicator">
              <el-spinner></el-spinner>
            </div>
            <div v-if="displayFunFacts && !loading">
              <div
                v-for="(fact, index) in funFacts"
                :key="index"
                :body-style="{ height: 'auto' }"
              >
                <p>
                  <strong>Food Items:</strong>
                  {{ fact["Food Item"] }}
                </p>
                <p><strong>Fun Facts:</strong> {{ fact["Fun Facts"] }}</p>
              </div>
            </div>
            <el-alert v-if="errorMessage" title="Error" type="error">{{
              errorMessage
            }}</el-alert>
          </div>
          <el-button
            @click="
              fetchData('gpt', '/api/get-fun-facts-using-gpt', 'funFacts')
            "
            :loading="loading"
            type="info"
            plain
            style="margin-left: 0px !important"
          >
            Generate Prompt
          </el-button>
        </el-collapse-item>
        <!-- Cooking Tips Section -->
        <el-collapse-item title="Cooking Tips">
          <div>
            <div v-if="loading" class="loading-indicator">
              <el-spinner></el-spinner>
            </div>
            <div v-if="displayCookingTips && !loading">
              <div v-for="(tip, index) in cookingTips" :key="index">
                <p><strong>Cooking Tips: </strong>{{ tip["Cooking Tip"] }}</p>
              </div>
            </div>
            <div v-if="!cookingTips && !loading">
              <el-alert title="No Cooking Tips" type="info" show-icon>
                No cooking tips available.
              </el-alert>
            </div>
            <el-button
              @click="
                fetchData('gpt', '/api/cooking-tips-using-gpt', 'cookingTips')
              "
              :loading="loading"
              type="info"
              plain
            >
              Generate Prompt
            </el-button>
          </div>
        </el-collapse-item>
        <!-- Current Trends Section -->
        <el-collapse-item title="Current Trends">
          <div>
            <div v-if="loading" class="loading-indicator">
              <el-spinner></el-spinner>
            </div>
            <div v-if="displayCurrentTrends && !loading">
              <div v-for="(trend, index) in currentTrends" :key="index">
                <p><strong>Current Trends:</strong>{{ trend["Fun Facts"] }}</p>
              </div>
            </div>
            <div v-if="!currentTrends && !loading">
              <el-alert title="No Fun Facts" type="info" show-icon>
                No current food trends available.
              </el-alert>
            </div>
            <el-button
              @click="
                fetchData(
                  'gpt',
                  '/api/current-trends-using-gpt',
                  'currentTrends'
                )
              "
              :loading="loading"
              type="info"
              plain
            >
              Generate Prompt
            </el-button>
          </div>
        </el-collapse-item>
        <!-- Food Handling  Section -->
        <el-collapse-item title="Food Handling Advice">
          <div>
            <div v-if="loading" class="loading-indicator">
              <el-spinner></el-spinner>
            </div>
            <div v-if="displayFoodHandling && !loading">
              <div v-for="(item, index) in handlingadvice" :key="index">
                <p><strong>Food Items:</strong> {{ item["Food Item"] }}</p>
                <p>
                  <strong>Handling Advice:</strong>
                  {{ item["Handling Advice"] }}
                </p>
              </div>
            </div>
            <div v-if="!displayFoodHandling">
              <el-alert title="No handling Advice" type="info" show-icon>
                No health handling advice available.
              </el-alert>
            </div>
            <el-button
              @click="
                fetchData(
                  'gpt',
                  '/api/food-handling-advice-using-gpt',
                  'handlingadvice'
                )
              "
              :loading="loading"
              type="info"
              plain
            >
              Generate Prompt
            </el-button>
          </div>
        </el-collapse-item>
        <!-- Mood Changer Section -->
        <el-collapse-item title="Mood Changer Suggestion">
          <div>
            <div v-if="loading" class="loading-indicator">
              <el-spinner></el-spinner>
            </div>
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
        </el-collapse-item>
      </div>
    </el-collapse>
  </el-card>
</template>

<script>
const baseUrl = "http://127.0.0.1:8081";

export default {
  data() {
    return {
      funFacts: [],
      cookingTips: [],
      currentTrends: [],
      handlingadvice: [],
      foodSuggestions: [],
      ethicalEatingSuggestions: [],
      foodWasteReductionSuggestions: [],
      moodChangerSuggestions: [],
      displayMood: "true",
      displayEthicalSuggestions: "true",
      displayCookingTips: "true",
      displayCurrentTrends: "true",
      displayWasteReduction: "true",
      displayFunFacts: "true",
      displayFoodHandling: "true",
      loading: false,
      error: false,
    };
  },
  async mounted() {
    try {
      await this.fetchData(
        "json",
        "/api/ethical-eating-suggestion-using-json",
        "ethicalEatingSuggestions"
      );
      await this.fetchData("json", "/api/get-fun-facts-using-json", "funFacts");
      await this.fetchData(
        "json",
        "/api/food-waste-reduction-using-json",
        "foodWasteReductionSuggestions"
      );
      await this.fetchData(
        "json",
        "/api/food-handling-advice-using-json",
        "handlingadvice"
      );
      await this.fetchData(
        "json",
        "/api/current-trends-using-json",
        "currentTrends"
      );
      await this.fetchData(
        "json",
        "/api/cooking-tips-using-json",
        "cookingTips"
      );
      await this.fetchData(
        "json",
        "/api/mood-changer-using-json",
        "moodChangerSuggestions"
      );
    } catch (error) {
      console.error("Error loading data:", error);
    }
  },
  methods: {
    async fetchData(type, endpoint, property) {
      try {
        this.loading = true;
        let response;
        if (type === "json") {
          response = await fetch(baseUrl + endpoint, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
        } else if (type === "gpt") {
          await fetch(baseUrl + endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
          });
          response = await fetch(baseUrl + endpoint);
        } else {
          throw new Error("Invalid request type.");
        }

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        // Log the entire data object for inspection
        console.log("Data Received:", data);
        // Check if the property exists in the data object
        if (property in data) {
          this[property] = data[property] || [];
          console.log(data[property]);
        } else {
          console.error(
            `Property '${property}' not found in the server response.`
          );
        }
        this.loading = false;
      } catch (error) {
        this.error = error.message;
      }
    },
  },
};
</script>

<style scoped>
.el-button {
  margin-top: 10px;
}
</style>
