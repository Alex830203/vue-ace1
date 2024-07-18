<template>
  <div style="height: 80px; margin-top: 6%">
    <h1>日報</h1>

    <!-- 新聞類別標籤 -->
    <div>
      <button
        v-for="category in categories"
        :key="category"
        @click="selectCategory(category)"
      >
        {{ categoryLabels[category] }}
      </button>
    </div>

    <!-- 顯示美金和日圓的匯率 -->
    <div v-if="twdToUsd !== null && twdToJpy !== null">
      <h2>匯率</h2>
      <p>美金匯率：{{ twdToUsd.toFixed(2) }}</p>
      <p>日圓匯率：{{ twdToJpy.toFixed(2) }}</p>
    </div>

    <!-- 顯示每日生成的新聞 -->
    <div v-if="news.length > 0">
      <h2>{{ categoryLabels[selectedCategory] }}新聞</h2>
      <div v-for="(article, index) in filteredNews" :key="index" class="image-container">
        <div v-if="article.image">
          <img
            :src="article.image"
            alt="每日新聞"
            style="max-width: 100%; height: auto"
          />
          <p>
            <a :href="article.url" target="_blank" rel="noopener noreferrer">{{
              article.title
            }}</a>
          </p>
        </div>
      </div>
    </div>

    <!-- 錯誤處理 -->
    <div v-if="error">
      <p>獲取數據時出現錯誤：{{ error }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { defineComponent, ref, onMounted, computed } from "vue";

export default defineComponent({
  name: "DailyImagePage",
  setup() {
    const news = ref([]);
    const twdToUsd = ref(null);
    const twdToJpy = ref(null);
    const error = ref(null);
    const isMobile = ref(false); // 響應式變量，標識是否為手機設備
    const categories = ["general", "world", "nation", "technology", "sports"];
    const categoryLabels = {
      general: "綜合",
      world: "國際",
      nation: "國內",
      technology: "科技",
      sports: "體育",
    };
    const selectedCategory = ref("general");
    const apiKeys = {
      general: "4b30ff8814968b8b0ea0c4677d931cfc",
      world: "1b08072053543e0fba1a0065e07e08a4",
      nation: "4c243517ec197a7439387cf8b6c75cbb",
      technology: "a2952b90f0439b39323935f65eeb00e9",
      sports: "cf01da62050eb7eaf0a98058240e0a53",
    };

    // 獲取圖像和匯率資訊
    const fetchData = async () => {
      try {
        // 獲取所有類別的新聞
        const allNewsPromises = categories.map((category) =>
          axios.get(
            `https://gnews.io/api/v4/top-headlines?category=${category}&lang=zh&country=tw&max=10&apikey=${apiKeys[category]}`
          )
        );
        const allNewsResponses = await Promise.all(allNewsPromises);
        news.value = allNewsResponses.map((response, index) => ({
          category: categories[index],
          articles: response.data.articles,
        }));

        // 打印每個圖像連結到控制台
        news.value.forEach((newsCategory) => {
          newsCategory.articles.forEach((article) => {
            console.log(`Category: ${newsCategory.category}, 圖片連結:`, article.image);
          });
        });

        // 獲取匯率資訊
        const ratesResponse = await axios.get(
          "https://api.exchangerate-api.com/v4/latest/TWD"
        );
        const rates = ratesResponse.data.rates;
        twdToUsd.value = 1 / rates.USD;
        twdToJpy.value = 1 / rates.JPY;
      } catch (err) {
        error.value = err.message;
        console.error("獲取數據時出現錯誤：", err);
      }
    };

    // 在頁面加載時執行一次數據獲取
    onMounted(() => {
      // 檢測設備類型並設置 isMobile 變量
      detectDeviceType();
      fetchData();
    });

    // 檢測設備類型的函數
    const detectDeviceType = () => {
      const viewportWidth = window.innerWidth;
      isMobile.value = viewportWidth <= 768; // 設定視口寬度小於等於 768px 為手機設備
    };

    const selectCategory = (category) => {
      selectedCategory.value = category;
    };

    const filteredNews = computed(() => {
      const selectedNews = news.value.find((n) => n.category === selectedCategory.value);
      return selectedNews ? selectedNews.articles : [];
    });

    return {
      news,
      twdToUsd,
      twdToJpy,
      error,
      isMobile,
      categories,
      categoryLabels,
      selectedCategory,
      selectCategory,
      filteredNews,
    };
  },
});
</script>

<style scoped>
/* 根據需要添加樣式 */
.image-container {
  margin-bottom: 20px; /* 間距樣式 */
}
</style>
