<template>
  <div class="centered-image">
    <img :src="currentImage" alt="Description of the image">
    <div class="controls">
      <button @click="changeImage">🔘🔘🔘</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "AboutPage",
  data() {
    return {
      images: [
        require("../assets/logo1.jpg"),
        require("../assets/logo2.jpg"),
        require("../assets/logo3.jpg"),
        require("../assets/logo4.jpg"),
      ],
      currentIndex: 0,
      timer: null,
      intervalTime: 5000, // 5秒
    };
  },
  computed: {
    currentImage() {
      return this.images[this.currentIndex];
    },
  },
  created() {
    this.startTimer();
  },
  // 將 destroyed 改為 unmounted
  unmounted() {
    this.stopTimer();
  },
  methods: {
    startTimer() {
      this.timer = setInterval(() => {
        this.changeImage();
      }, this.intervalTime);
    },
    stopTimer() {
      clearInterval(this.timer);
    },
    changeImage() {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    },
  },
};
</script>

<style scoped>
.centered-image {
  position: relative; /* 讓控制按鈕可以準確定位 */
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh; /* 根據需要調整容器高度 */
}

.centered-image img {
  max-width: 100%;
  max-height: 100%;
  height: auto;
  width: auto;
}

.controls {
  position: absolute;
  bottom: 20px; /* 距離底部的距離 */
  left: 50%; /* 讓控制按鈕居中 */
  transform: translateX(-50%); /* 水平居中 */
}

.controls button {
  padding: 20px 40px;
  background-color: #0000003d;
  color: rgb(230, 222, 222);
  border: none;
  cursor: pointer;
  border-radius: 20px; /* 圓角設置 */

}
</style>
