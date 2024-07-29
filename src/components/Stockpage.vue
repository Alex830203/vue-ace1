<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div style="margin-top: 6%">
    <input v-model="searchQuery" placeholder="搜尋網址" />
    <button @click="addIframe">搜尋</button>
    <div class="iframe-grid">
      <div v-for="(iframe, index) in iframes" :key="index" class="iframe-container">
        <input v-model="iframe.url" class="iframe-url-input" />
        <div class="iframe-box">
          <iframe :src="iframe.url" frameborder="0" :style="iframeStyle"></iframe>
          <button class="close-btn" @click="removeIframe(index)">X</button>
          <button
            class="favorite-btn"
            :class="{ active: iframe.favorite }"
            @click="toggleFavorite(index)"
          >
            ❤
          </button>
        </div>
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
        border: "none", // 移除 iframe 的邊框樣式
      },
    };
  },
  methods: {
    addIframe() {
      if (this.searchQuery) {
        this.iframes.push({
          url: `${this.searchQuery}`,
          favorite: false,
        });
        this.searchQuery = ""; // 清空搜尋框
      }
    },
    removeIframe(index) {
      this.iframes.splice(index, 1);
    },
    toggleFavorite(index) {
      this.iframes[index].favorite = !this.iframes[index].favorite;
      if (this.iframes[index].favorite) {
        // 發送請求
        fetch("your-api-endpoint", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: this.iframes[index].url }),
        });
      }
    },
  },
};
</script>

<style>
button {
  background-color: #82abd6;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  margin: 0 5px;
}

input {
  padding: 10px;
  border: 1px solid #ddd;
}
.iframe-grid {
  display: flex;
  flex-wrap: wrap;
}
.iframe-container {
  position: relative;
  margin: 10px;
  width: 900px;
}
.iframe-url-input {
  width: 100%;
  padding: 6px;
  box-sizing: border-box;
  border: none; /* 移除黑色邊框 */
  background-color: rgba(169, 169, 169, 0.9); /* 設置灰色半透明背景 */
}
.iframe-box {
  position: relative;
  width: 100%;
  height: 830px;
  border: 1px solid #ccc; /* 設置框框的邊框樣式 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 設置框框的陰影效果 */
}
.iframe-box iframe {
  display: block;
  width: 100%;
  height: 100%;
}
.close-btn {
  position: absolute;
  top: 0;
  right: 0;
  background-color: transparent;
  color: grey;
  border: none;
  cursor: pointer;
  font-size: 24px;
  z-index: 1; /* 確保按鈕在最上層 */
}
.favorite-btn {
  position: absolute;
  top: 0;
  left: 0;
  background-color: transparent;
  border: none;
  color: grey;
  cursor: pointer;
  z-index: 1;
  font-size: 24px;
}
.favorite-btn.active {
  color: pink;
}
</style>
