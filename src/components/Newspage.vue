<template>
    <div>
      <h1>每日新聞和匯率</h1>
  
      <!-- 显示每日生成的新聞 -->
      <div v-if="news.length > 0">
        <h2>今日新聞</h2>
        <div v-for="(article, index) in news" :key="index" class="image-container">
          <img v-if="article.image" :src="article.image" alt="每日新聞" style="max-width: 100%; height: auto;">
        </div>
      </div>
  
      <!-- 显示美金和日圆的匯率 -->
      <div v-if="twdToUsd !== null && twdToJpy !== null">
        <h2>匯率</h2>
        <p>美金匯率：{{ twdToUsd.toFixed(2) }}</p>
        <p>日圓匯率：{{ twdToJpy.toFixed(2) }}</p>
      </div>
  
      <!-- 错误处理 -->
      <div v-if="error">
        <p>獲取數據時出現錯誤：{{ error }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { defineComponent, ref, onMounted } from 'vue';
  
  export default defineComponent({
    name: 'DailyImagePage',
    setup() {
      const news = ref([]);
      const twdToUsd = ref(null);
      const twdToJpy = ref(null);
      const error = ref(null);
      const isMobile = ref(false); // 响应式变量，标识是否为手机设备
  
      // 獲取圖像和匯率資訊
      const fetchData = async () => {
        try {
          // 獲取圖像路徑
          const newsResponse = await axios.get('https://gnews.io/api/v4/top-headlines?category=general&lang=zh&country=tw&max=100&apikey=a2952b90f0439b39323935f65eeb00e9');
          news.value = newsResponse.data.articles; // 将所有文章存入 news
  
          // 打印每个图像链接到控制台
          news.value.forEach(article => {
            console.log('圖片連結:', article.image);
          });
  
          // 獲取匯率資訊
          const ratesResponse = await axios.get('https://api.exchangerate-api.com/v4/latest/TWD');
          const rates = ratesResponse.data.rates;
          twdToUsd.value = 1 / rates.USD;
          twdToJpy.value = 1 / rates.JPY;
        } catch (err) {
          error.value = err.message;
          console.error('獲取數據時出現錯誤：', err);
        }
      };
  
      // 在頁面加載時執行一次數據獲取
      onMounted(() => {
        // 检测设备类型并设置 isMobile 变量
        detectDeviceType();
        fetchData();
      });
  
      // 检测设备类型的函数
      const detectDeviceType = () => {
        const viewportWidth = window.innerWidth;
        isMobile.value = viewportWidth <= 768; // 设定视口宽度小于等于 768px 为手机设备
      };
  
      return {
        news,
        twdToUsd,
        twdToJpy,
        error,
        isMobile
      };
    }
  });
  </script>
  
  <style scoped>
  /* 根据需要添加样式 */
  .image-container {
    margin-bottom: 20px; /* 间距样式 */
  }
  </style>
  