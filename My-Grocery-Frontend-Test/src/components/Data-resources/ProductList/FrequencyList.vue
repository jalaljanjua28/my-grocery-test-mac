<template>
  <el-card>
    <div style="display: flex; flex-direction: column">
      <el-select v-model="condition" placeholder="Select">
        <el-option label="Biweekly" value="biweekly"></el-option>
        <el-option label="Monthly" value="monthly"></el-option>
        <el-option label="Today" value="today"></el-option>
      </el-select>
      <el-button @click="checkFrequency" type="primary" style="margin-top: 10px"
        >Check Frequency</el-button
      >

      <div v-if="responseMessage" class="response-message">
        {{ responseMessage }}
      </div>

      <div
        v-if="sortedItemFrequency"
        class="item-frequency"
        style="display: flex; flex-direction: column; align-items: center"
      >
        <h3>Item Frequency</h3>
        <el-table :data="sortedItemFrequency" style="width: 100%">
          <el-table-column prop="itemName" label="Item Name"></el-table-column>
          <el-table-column prop="frequency" label="Frequency"></el-table-column>
        </el-table>
      </div>
    </div>
  </el-card>
</template>

<script>
const baseUrl = "http://127.0.0.1:8081";

export default {
  data() {
    return {
      condition: "",
      responseMessage: "",
      sortedItemFrequency: [],
    };
  },
  methods: {
    async checkFrequency() {
      try {
        const response = await fetch(baseUrl + "/api/check-frequency", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ condition: this.condition }),
        });
        const responseData = await response.json();
        if (response.ok) {
          // Transform the object into an array of objects with itemName and frequency properties
          const sortedItemFrequency = Object.entries(
            responseData.sorted_item_frequency
          ).map(([itemName, frequency]) => ({ itemName, frequency }));
          // Sort the array in descending order based on the frequency
          this.sortedItemFrequency = sortedItemFrequency.sort(
            (a, b) => b.frequency - a.frequency
          );
        } else {
          this.responseMessage = responseData.error;
        }
      } catch (error) {
        console.error("Error checking frequency:", error);
        this.responseMessage = "An error occurred while checking frequency.";
      }
    },
  },
};
</script>

<style scoped></style>
