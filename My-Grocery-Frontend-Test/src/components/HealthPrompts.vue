<template>
  <div>
    <el-card>
      <el-collapse :accordion="true">
        <!-- Allergy Information Section -->
        <el-collapse-item title="Allergy Information">
          <div>
            <div>
              <div v-if="loading" class="loading-indicator">
                <el-spinner></el-spinner>
              </div>
              <div
                v-if="AllergyInformation.length === 0"
                class="health-loading"
              >
                Loading...
              </div>
              <div v-else-if="AllergyInformation.length > 0">
                <div v-for="item in AllergyInformation" :key="item.id">
                  <p><strong>Food Item: </strong>{{ item["Food Item"] }}</p>
                  <div>
                    <p>{{ item["Allergy Information"] }}</p>
                  </div>
                </div>
              </div>
              <div v-else class="health-loading">
                No allergy information available.
              </div>
              <el-button
                type="info"
                @click="
                  fetchData(
                    'gpt',
                    '/api/allergy-information-using-gpt',
                    'AllergyInformation'
                  )
                "
                :loading="loading"
                plain
                >Generate Prompt</el-button
              >
            </div>
          </div>
        </el-collapse-item>
        <!-- Healthier Eating Alternatives Section -->
        <el-collapse-item title="Healthier Eating Alternatives">
          <div>
            <div>
              <div>
                <div v-if="loading" class="loading-indicator">
                  <el-spinner></el-spinner>
                </div>
                <div v-if="alternatives.length === 0" class="health-loading">
                  Loading...
                </div>
                <div v-if="alternatives && alternatives.length > 0">
                  <div v-for="(item, index) in alternatives" :key="index">
                    <p><strong>Food Item: </strong>{{ item["Food Item"] }}</p>
                    <p>
                      <strong>Healthy Alternative:</strong>
                      {{ item["Healthy Alternative"] }}
                    </p>
                  </div>
                </div>
                <div v-if="!alternatives">
                  <el-alert title="No Suggestions" type="info" show-icon>
                    No healthy alternatives available.
                  </el-alert>
                </div>
                <el-button
                  type="info"
                  @click="
                    fetchData(
                      'gpt',
                      '/api/healthier-alternatives-using-gpt',
                      'alternatives'
                    )
                  "
                  :loading="loading"
                  plain
                  >Generate Prompt
                </el-button>
              </div>
            </div>
          </div>
        </el-collapse-item>
        <!-- Healthy Eating Advice Section -->
        <el-collapse-item title="Healthy Eating Advice">
          <div>
            <div>
              <div v-if="loading" class="loading-indicator">
                <el-spinner></el-spinner>
              </div>
              <div v-if="eatingAdviceList.length === 0" class="health-loading">
                Loading...
              </div>
              <div v-if="eatingAdviceList.length > 0">
                <div v-for="(item, index) in eatingAdviceList" :key="index">
                  <div>
                    <p>
                      <strong>Response:</strong> {{ item["Health Advice"] }}
                    </p>
                  </div>
                </div>
              </div>
              <div v-if="!eatingAdviceList">
                <el-alert title="No Advice" type="info" show-icon>
                  No healthy eating advice available.
                </el-alert>
              </div>
              <el-button
                type="info"
                @click="
                  fetchData(
                    'gpt',
                    '/api/healthy-eating-advice-using-gpt',
                    'eatingAdviceList'
                  )
                "
                :loading="loading"
                plain
              >
                Generate Prompt
              </el-button>
            </div>
          </div>
        </el-collapse-item>
        <!-- Health Advice Section -->
        <el-collapse-item title="Health Advice">
          <div>
            <div>
              <div v-if="loading" class="loading-indicator">
                <el-spinner></el-spinner>
              </div>
              <div v-if="healthAdviceList.length === 0" class="health-loading">
                Loading...
              </div>
              <div v-if="healthAdviceList.length > 0">
                <div v-for="(advice, index) in healthAdviceList" :key="index">
                  <div slot="header" class="clearfix">
                    <span>Advice {{ index + 1 }}</span>
                  </div>
                  <div>
                    <p><strong>Prompt:</strong> {{ advice.Prompt }}</p>
                    <p>
                      <strong>Health Advice:</strong>
                      {{ advice["Health Advice"] }}
                    </p>
                  </div>
                </div>
              </div>
              <div v-if="!healthAdviceList">
                <el-alert title="No Advice" type="info" show-icon>
                  No health available.
                </el-alert>
              </div>
              <el-button
                type="info"
                @click="
                  fetchData(
                    'gpt',
                    '/api/health-advice-using-gpt',
                    'healthAdviceList'
                  )
                "
                :loading="loading"
                plain
              >
                Generate Prompt
              </el-button>
            </div>
          </div>
        </el-collapse-item>
        <!-- Healthy Items Usage Suggestions Section -->
        <el-collapse-item title="Healthy Items Usage">
          <div>
            <div>
              <div v-if="loading" class="loading-indicator">
                <el-spinner></el-spinner>
              </div>
              <div v-if="suggestions.length === 0" class="health-loading">
                Loading...
              </div>
              <div v-if="suggestions && suggestions.length > 0">
                <div v-for="(item, index) in suggestions" :key="index">
                  <p><strong>Food Item: </strong> {{ item["Food Item"] }}</p>
                  <p><strong>Suggestion:</strong> {{ item["Suggestion"] }}</p>
                </div>
              </div>
              <div v-if="!suggestions">
                <el-alert title="No Suggestions" type="info" show-icon>
                  No healthy items usage suggestions available.
                </el-alert>
              </div>
              <el-button
                type="info"
                @click="
                  fetchData(
                    'gpt',
                    '/api/healthy-items-usage-using-gpt',
                    'suggestions'
                  )
                "
                :loading="loading"
                plain
                >Generate Prompt</el-button
              >
            </div>
          </div>
        </el-collapse-item>
        <!-- Health Incompatabilities Section -->
        <el-collapse-item title="Health Incompatibilities">
          <div>
            <div>
              <div v-if="loading" class="loading-indicator">
                <el-spinner></el-spinner>
              </div>
              <div
                v-if="healthIncompatibilities.length === 0"
                class="health-loading"
              >
                Loading...
              </div>
              <div v-else-if="healthIncompatibilities.length > 0">
                <div v-for="item in healthIncompatibilities" :key="item.id">
                  <p>
                    <strong>Food Combination: </strong>
                    {{ item["Food Combination"] }}
                  </p>
                  <p>
                    <strong>Health-wise Incompatabilities: </strong
                    >{{ item["Health-wise Incompatibility Information"] }}
                  </p>
                </div>
              </div>
              <div v-if="!healthIncompatibilities">
                <el-alert title="No Suggestions" type="info" show-icon>
                  No health incompatabilities suggestions available.
                </el-alert>
              </div>
              <el-button
                type="info"
                @click="
                  fetchData(
                    'gpt',
                    '/api/health_incompatibilities_using_gpt',
                    'healthIncompatibilities'
                  )
                "
                :loading="loading"
                plain
                >Generate Prompt</el-button
              >
            </div>
          </div>
        </el-collapse-item>
        <!-- Nutritional Analysis Section -->
        <el-collapse-item title="Nutritional Analysis">
          <div>
            <div>
              <div v-if="loading" class="loading-indicator">
                <el-spinner></el-spinner>
              </div>
              <div
                v-if="nutritionalAnalysis.length === 0"
                class="health-loading"
              >
                Loading...
              </div>
              <div v-else-if="nutritionalAnalysis.length > 0">
                <div v-for="item in nutritionalAnalysis" :key="item.id">
                  <p>
                    <strong>Group of Items: </strong>
                    {{ item["Group of Items"].join(", ") }}
                  </p>
                  <p>
                    <strong>Nutritional Analysis: </strong>
                    {{ item["Nutritional Analysis"] }}
                  </p>
                </div>
              </div>
              <div v-if="!nutritionalAnalysis">
                <el-alert title="No Suggestions" type="info" show-icon>
                  No nutritional analysis available.
                </el-alert>
              </div>
            </div>
            <el-button
              type="info"
              @click="
                fetchData(
                  'gpt',
                  '/api/nutritional-analysis-using-gpt',
                  'nutritionalAnalysis'
                )
              "
              :loading="loading"
              plain
              >Generate Prompt</el-button
            >
          </div>
        </el-collapse-item>
        <!-- Nutritional Value Section -->
        <el-collapse-item title="Nutritional Value">
          <div>
            <div>
              <div v-if="loading" class="loading-indicator">
                <el-spinner></el-spinner>
              </div>
              <div v-if="nutritionalValue.length === 0" class="health-loading">
                Loading...
              </div>
              <div v-else-if="nutritionalValue.length > 0">
                <div v-for="item in nutritionalValue" :key="item.id">
                  <p><strong>Food Item: </strong>{{ item["Food Item"] }}</p>
                  <p>
                    <strong>Nutritional Advice: </strong>
                    {{ item["Nutritional Advice"] }}
                  </p>
                </div>
              </div>
              <div v-if="!nutritionalValue">
                <el-alert title="No Suggestions" type="info" show-icon>
                  No nutritional value available.
                </el-alert>
              </div>
              <el-button
                type="info"
                @click="
                  fetchData(
                    'gpt',
                    '/api/nutritional-value-suggestions-using-gpt',
                    'nutritionalValue'
                  )
                "
                :loading="loading"
                plain
                >Generate Prompt</el-button
              >
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>

<script>
const baseUrl = "http://127.0.0.1:8081";

export default {
  data() {
    return {
      AllergyInformation: [],
      eatingAdviceList: [], // Updated property name
      alternatives: [],
      suggestions: [],
      healthIncompatibilities: [],
      nutritionalAnalysis: [],
      nutritionalValue: [],
      healthAdviceList: [],
      loading: false,
      error: false,
    };
  },
  async mounted() {
    try {
      await this.fetchData(
        "json",
        "/api/allergy-information-using-json",
        "AllergyInformation"
      );
      await this.fetchData(
        "json",
        "/api/healthier-alternatives-using-json",
        "alternatives"
      );
      await this.fetchData(
        "json",
        "/api/food-waste-reduction-using-json",
        "foodWasteReductionSuggestions"
      );
      await this.fetchData(
        "json",
        "/api/healthy-eating-advice-using-json",
        "eatingAdviceList"
      );
      await this.fetchData(
        "json",
        "/api/healthy-items-usage-using-json",
        "suggestions"
      );
      await this.fetchData(
        "json",
        "/api/health_incompatibilities_using_json",
        "healthIncompatibilities"
      );
      await this.fetchData(
        "json",
        "/api/nutritional-analysis-using-json",
        "nutritionalAnalysis"
      );
      await this.fetchData(
        "json",
        "/api/nutritional-value-using-json",
        "nutritionalValue"
      );
      await this.fetchData(
        "json",
        "/api/health-advice-using-json",
        "healthAdviceList"
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
<style scoped></style>
