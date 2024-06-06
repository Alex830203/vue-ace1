<!-- eslint-disable vue/valid-template-root -->
<template>
  <div style="height: 80px; margin-top: 4%">
    <input type="text" v-model="range" placeholder="Enter range (e.g., 'Sheet1!A1:E10')" />
    <button @click="fetchData">查詢</button>

    <table v-if="data.length">
      <thead>
        <tr>
          <th v-for="(header, index) in headers" :key="index">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in data" :key="rowIndex">
          <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
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
      headers: []
    };
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
        } else {
          this.headers = [];
          this.data = [];
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        this.headers = [];
        this.data = [];
      }
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
</style>
