<template>
  <div>
    <el-card>
      <el-collapse :accordion="true">
        <div class="recipe-container">
          <!-- Fusion Suggestions Section -->
          <el-collapse-item title="Food Cuisine Suggestions">
            <div>
              <div v-if="loading" class="loading-indicator">
                <el-spinner></el-spinner>
              </div>
              <div v-if="displaySuggestions && !loading">
                <div
                  v-for="(suggestion, index) in fusionSuggestions"
                  :key="index"
                >
                  <p>
                    <strong> Fusion Cuisine Suggestion: </strong
                    >{{ suggestion["Fusion Cuisine Suggestion"] }}
                  </p>
                </div>
              </div>
            </div>
          </el-collapse-item>

          <!-- User Defined Dish Section -->
          <el-collapse-item title="User Defined Dish">
            <div>
              <div v-if="loading" class="loading-indicator">
                <el-spinner></el-spinner>
              </div>
              <div v-if="displayDishes && !loading">
                <div v-for="(fact, index) in definedDishes" :key="index">
                  <p><strong>Fun Facts: </strong>{{ fact["Fun Facts"] }}</p>
                </div>
              </div>
            </div>
          </el-collapse-item>

          <!-- Unique Recipe Section -->
          <el-collapse-item title="Unique Recipe">
            <div>
              <div v-if="loading" class="loading-indicator">
                <el-spinner></el-spinner>
              </div>
              <div v-if="displayRecipe && !loading">
                <div v-for="(recipe, index) in uniqueRecipes" :key="index">
                  <p><strong>Recipe: </strong>{{ recipe["Recipe"] }}</p>
                  <p>
                    <strong>Encouragement: </strong
                    >{{ recipe["Encouragement"] }}
                  </p>
                </div>
              </div>
            </div>
          </el-collapse-item>

          <!-- Diet Schedule Section -->
          <el-collapse-item title="Diet Schedule">
            <div>
              <div v-if="loading" class="loading-indicator">
                <el-spinner></el-spinner>
              </div>
              <div v-if="displaySchedule && !loading">
                <div v-for="(meal, index) in dietSchedule" :key="index">
                  <p slot="header">
                    Meal Number {{ meal["Meal Number"] }} -
                    {{ meal["Meal Category"] }}
                  </p>
                  <p><Strong>Food Item: </Strong>{{ meal["Food Item"] }}</p>
                  <p>
                    <strong>Meal Suggestion: </strong
                    >{{ meal["Meal Suggestion"] }}
                  </p>
                </div>
              </div>
              <el-button
                @click="
                  fetchData(
                    'gpt',
                    '/api/diet-schedule-using-gpt',
                    'dietSchedule'
                  )
                "
                type="info"
                plain
                :loading="loading"
                >Generate Prompt</el-button
              >
            </div>
          </el-collapse-item>

          <!-- Generated Recipes Section -->
          <el-collapse-item title="Generated Recipes">
            <div>
              <div v-if="loading" class="loading-indicator">
                <el-spinner></el-spinner>
              </div>
              <div v-if="displayResult && !loading">
                <div v-for="(recipe, index) in generatedRecipes" :key="index">
                  <p slot="header">
                    <Strong>Group of Items: </Strong>
                    {{ recipe["Group of Items"].join(", ") }}
                  </p>
                  <p>
                    <strong>Generated Recipe: </strong>
                    {{ recipe["Generated Recipe"] }}
                  </p>
                </div>
              </div>
              <el-button
                @click="
                  fetchData(
                    'gpt',
                    '/api/recipes-using-gptt',
                    'generatedRecipes'
                  )
                "
                type="info"
                plain
                :loading="loading"
                >Generate Prompt</el-button
              >
            </div>
          </el-collapse-item>
        </div>
      </el-collapse>
    </el-card>
  </div>
</template>

<script>
const baseUrl = "http://127.0.0.1:8081";

export default {
  data() {
    return {
      fusionSuggestions: [],
      definedDishes: [],
      uniqueRecipes: [],
      dietSchedule: [],
      generatedRecipes: [],
      displaySuggestions: true,
      displayDishes: true,
      displayRecipe: true,
      displaySchedule: true,
      displayResult: true,
      loading: false,
    };
  },
  async mounted() {
    try {
      await this.fetchData(
        "json",
        "/api/fusion-cuisine-suggestions-using-json",
        "fusionSuggestions"
      );
      await this.fetchData(
        "json",
        "/api/user-defined-dish-using-json",
        "definedDishes"
      );
      await this.fetchData(
        "json",
        "/api/unique-recipes-using-json",
        "uniqueRecipes"
      );
      await this.fetchData(
        "json",
        "/api/diet-schedule-using-json",
        "dietSchedule"
      );
      await this.fetchData(
        "json",
        "/api/recipes-using-json",
        "generatedRecipes"
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
