<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div style="height: 80px; margin-top: 6%">
    <input v-model="searchQuery" placeholder="搜尋網址" />
    <button @click="addIframe">搜尋</button>
    <div class="iframe-grid">
      <div v-for="(iframe, index) in iframes" :key="index" class="iframe-container">
        <iframe :src="iframe.url" frameborder="0" :style="iframeStyle"></iframe>
        <button class="close-btn" @click="removeIframe(index)">X</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: "",
      iframes: [],
      iframeStyle: {
        width: "900px", // 設置 iframe 的寬度
        height: "830px", // 設置 iframe 的高度
        border: "1px solid #ccc", // 設置 iframe 的邊框樣式
      },
    };
  },
  methods: {
    addIframe() {
      if (this.searchQuery) {
        this.iframes.push({
          url: `${this.searchQuery}`,
        });
        this.searchQuery = ""; // 清空搜尋框
      }
    },
    removeIframe(index) {
      this.iframes.splice(index, 1);
    },
  },
};
</script>

<style>
.iframe-grid {
  display: flex;
  flex-wrap: wrap;
}
.iframe-container {
  position: relative;
  margin: 10px;
}
.iframe-container iframe {
  display: block;
}
.close-btn {
  position: absolute;
  top: 0;
  right: 0;
  background-color: red;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
