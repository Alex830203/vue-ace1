<!-- eslint-disable vue/valid-template-root -->
<template>
  <div style="height: 80px; margin-top: 4%">
    <input type="text" v-model="range" placeholder="Enter range (e.g., 'Sheet1!A1:E10')" />
    <button @click="fetchData">查詢</button>
    <button v-if="data.length" @click="pickRandomRow">隨機</button>
    <button v-if="data.length" @click="pickRandom500Times">隨機500次</button>
    <button v-if="data.length" @click="selectAll">全選</button>
    <button v-if="data.length" @click="selectInverse">全反選</button>

    <div v-if="randomRowIndex !== -1 && selectedRows.length > 0" style="margin-top: 10px;">
      <h3>本次選中的店家:</h3>
      <ul>
        <li v-for="(row, index) in selectedRows" :key="index">
          {{ row[0] }}
        </li>
      </ul>
    </div>

    <table v-if="data.length">
      <thead>
        <tr>
          <th>想吃</th>
          <th>店家</th>
          <th>網址</th>
          <th>選中次數</th>
          <th>備註</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in data" :key="rowIndex" :class="{ 'highlighted': rowIndex === randomRowIndex && rowSelections[rowIndex] }">
          <td>
            <input type="checkbox" v-model="rowSelections[rowIndex]" />
          </td>
          <td>{{ row[0] }}</td>
          <td><a :href="row[1]">{{ row[1] }}</a></td>
          <td>{{ selectionCounts[rowIndex] }}</td>
          <td>{{ row[2] }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      range: '美食區',
      data: [],
      headers: [],
      randomRowIndex: -1,
      selectionCounts: [], // Array to store selection counts for each row
      rowSelections: [] // Array to store row selection status
    };
  },
  computed: {
    selectedRows() {
      return this.data.filter((row, index) => this.randomRowIndex === index && this.rowSelections[index]);
    }
  },
  methods: {
    async fetchData() {
      const apiKey = 'AIzaSyAS8_U9ZjmAQOIJegEUeq_miT8DkcKxcyo';
      const spreadsheetId = '1PfEa9PkmbXigxEYUPYtmQO9iIb2oY0hPQ0YxEo_z7vM';
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${this.range}?key=${apiKey}`;

      try {
        const response = await axios.get(url);
        const result = response.data;

        if (result.values && result.values.length) {
          this.headers = result.values[0]; // Assume the first row is the header
          this.data = result.values.slice(1); // The rest are data rows
          this.randomRowIndex = -1; // Reset randomRowIndex
          this.selectionCounts = new Array(this.data.length).fill(0); // Initialize selectionCounts array
          this.rowSelections = new Array(this.data.length).fill(true); // Initialize rowSelections array, all checked by default
        } else {
          this.headers = [];
          this.data = [];
          this.randomRowIndex = -1;
          this.selectionCounts = [];
          this.rowSelections = [];
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        this.headers = [];
        this.data = [];
        this.randomRowIndex = -1;
        this.selectionCounts = [];
        this.rowSelections = [];
      }
    },
    pickRandomRow() {
      if (this.data.length > 0) {
        const selectableIndexes = this.rowSelections.reduce((acc, isSelected, index) => {
          if (isSelected) {
            acc.push(index);
          }
          return acc;
        }, []);

        if (selectableIndexes.length > 0) {
          const randomIndex = Math.floor(Math.random() * selectableIndexes.length);
          this.randomRowIndex = selectableIndexes[randomIndex];
          this.selectionCounts[this.randomRowIndex]++;
        }
      }
    },
    async pickRandom500Times() {
      for (let i = 0; i < 500; i++) {
        await new Promise(resolve => setTimeout(resolve, 10)); // Wait for 10 milliseconds
        this.pickRandomRow();
      }
    },
    selectAll() {
      this.rowSelections = new Array(this.data.length).fill(true);
    },
    selectInverse() {
      this.rowSelections = new Array(this.data.length).fill(false);
    }
  }
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
}

.highlighted {
  background-color: yellow; /* 高亮顏色可以自行調整 */
}
</style>
