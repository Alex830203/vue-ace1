<template>
  <div id="app">
    <div class="menu">
      <div class="page">
        <router-link to="/" class="router">首頁</router-link>
        <div v-if="isLoggedIn">
          <!-- <router-link
            :to="{
              path: '/suspiciousplayer',
              query: { token: isLoggedIn ? userToken : null },
            }"
            class="router"
            >可疑玩家</router-link
          >
          <router-link
            :to="{ path: '/crossbet', query: { token: isLoggedIn ? userToken : null } }"
            class="router"
            >對投查詢</router-link
          >
          <router-link
            :to="{ path: '/playroad', query: { token: isLoggedIn ? userToken : null } }"
            class="router"
            >玩家路書</router-link
          >
          <router-link
            :to="{ path: '/api', query: { token: isLoggedIn ? userToken : null } }"
            class="router"
            >API</router-link
          > -->
          <router-link :to="{ path: '/tgbot' }" class="router">口袋名單</router-link>
          <router-link
            :to="{
              path: '/currency_conversion',
            }"
            class="router"
            >美食日曆</router-link
          >
          <router-link
            :to="{
              path: '/stock',
            }"
            class="router"
            >股票</router-link
          >
          <router-link
            :to="{
              path: '/news',
            }"
            class="router"
            >新聞</router-link
          >
        </div>
      </div>

      <div v-if="!isLoggedIn" class="login">
        <input v-model="username" type="text" placeholder="帳號" class="input" />
        <input v-model="password" type="password" placeholder="密碼" class="input" />
        <button @click="login" class="button">登入</button>
      </div>

      <div v-if="isLoggedIn" class="info">
        <!-- <H2 style="margin-right: 10px; color: #817777">{{ currentTime }}</H2> -->
        <h2
          class="time-text"
          @mouseover="showAlternateText"
          @mouseleave="showCurrentTime"
        >
          {{ displayText }}
        </h2>
        <button @click="logout" class="button">登出</button>
      </div>
    </div>

    <!-- 彈窗 -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h3>最近消息</h3>
        <img
          src="data:image/jpeg;base64,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"
          alt="小圖"
          class="modal-image"
        />
        <p v-html="messageContent" class="modal-message"></p>
        <button @click="closeModal" class="button">關閉</button>
      </div>
    </div>

    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      username: "", // 使用者帳號綁定的資料屬性
      password: "", // 使用者密碼綁定的資料屬性
      isLoggedIn: false, // 預設登入狀態
      userToken: "",
      currentTime: this.getCurrentTime(), // 當前時間
      elapsedTime: "", // 正計時
      startDate: new Date("2022-05-02T08:00:00"), // 起始日期
      alternateText: "2022/05/02~現在", // 滑鼠移入時顯示的文字
      displayText: "", // 用來顯示當前的文字
      isHovering: false, // 用於記錄滑鼠是否在文字上
      hoverTimeout: null, // 用來記錄延遲的計時器
      showModal: false, // 控制彈窗顯示
      messageContent: "歡迎回來！<br>吃飽了嗎?<br>上班加油!<br>祝您今天一切順心~",
    };
  },

  mounted() {
    this.displayText = this.elapsedTime; // 初始顯示當前時間

    this.isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    this.userToken = localStorage.getItem("userToken");
    this.checkTokenExpiration();

    console.log("登入狀態：", this.isLoggedIn);
    console.log("Token：", this.userToken);

    //更新當前時間與正計時
    setInterval(() => {
      this.currentTime = this.getCurrentTime();
      this.elapsedTime = this.getElapsedTime();
      if (!this.isHovering) {
        this.displayText = this.elapsedTime;
      }
      this.checkTokenExpiration();
    }, 1000);
  },

  methods: {
    async login() {
      try {
        const response = await axios.post(
          "http://13.239.135.6:3000/api/adminlogin",
          {
            username: this.username,
            password: this.password,
          },
          {
            headers: {
              "Content-Type": "application/json",
              accept: "application/json",
            },
          }
        );

        // 處理 API 回應的邏輯，可能是導航到其他頁面或顯示成功訊息等
        console.log("登入成功！", response.data.accessToken);

        // 將 accessToken 儲存到 userToken 中
        this.userToken = response.data.accessToken;

        // 設定 isLoggedIn 為 true
        this.isLoggedIn = true;

        // 將登入狀態保存到 localStorage
        localStorage.setItem("isLoggedIn", true);

        // 设置过期时间为半小时后
        const expirationTime = new Date().getTime() + 30 * 60 * 1000; // 半小时后的时间戳
        localStorage.setItem("tokenExpiration", expirationTime);

        // 將Token保存到localStorage
        localStorage.setItem("userToken", this.userToken);

        // 使用 router 的 push 方法導航到其他頁面，並將 token 作為查詢參數傳遞
        // this.$router.push({
        //   query: { token: this.userToken },
        // });

        // 顯示彈窗
        this.showModal = true;
      } catch (error) {
        // 處理登入失敗的情況，例如顯示錯誤訊息
        console.error("登入失敗：", error);
      }
    },

    closeModal() {
      this.showModal = false; // 關閉彈窗
    },

    // 检查 token 是否过期
    checkTokenExpiration() {
      const expirationTime = localStorage.getItem("tokenExpiration");
      if (!expirationTime) {
        // 如果没有过期时间，表示用户未登录或登录已过期
        this.logout();
      } else {
        const currentTime = new Date().getTime();
        if (currentTime > expirationTime) {
          // 过期时间小于当前时间，表示 token 已过期
          this.logout();
        }
      }
    },

    logout() {
      // 清空 localStorage 中的登入狀態和Token
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userToken");
      localStorage.removeItem("tokenExpiration");

      // 設定 isLoggedIn 為 false，清空使用者名稱
      this.isLoggedIn = false;

      // 使用 router 的 push 方法導航回首頁
      this.$router.push({ name: "home" });
    },

    getCurrentTime() {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");
      return `${hours}:${minutes}:${seconds}`;
    },

    getElapsedTime() {
      const now = new Date();
      const diff = now - this.startDate;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return `${days} 天 ${hours} 小時 ${minutes} 分鐘 ${seconds} 秒`;
    },

    showAlternateText() {
      // 清除之前的計時器，避免延遲出現閃爍問題
      clearTimeout(this.hoverTimeout);

      // 設定延遲，讓文字變化平滑
      this.hoverTimeout = setTimeout(() => {
        this.displayText = this.alternateText;
        this.isHovering = true;
      }, 300); // 延遲 300ms
    },

    showCurrentTime() {
      // 清除之前的計時器，防止移出時還有未完成的計時器
      clearTimeout(this.hoverTimeout);

      // 設定延遲，讓文字變化平滑
      this.hoverTimeout = setTimeout(() => {
        this.displayText = this.elapsedTime;
        this.isHovering = false;
      }, 300); // 延遲 300ms
    },
  },
};
</script>

<style>
.menu {
  padding: 10px;
  text-align: center;
  position: fixed;
  top: 0%;
  width: 100%;
  background: linear-gradient(to right, #e4efdc, #aec0c0);
  z-index: 1000; /* 設定層級，確保選單在其他元素上面 */
  display: flex;
  justify-content: space-between; /* 讓內容在 flex 容器中平均分布 */
  align-items: center; /* 垂直置中 */
}

.page {
  display: flex;
  align-items: center; /* 垂直置中 */
}

.input {
  margin-right: 5px;
  padding: 7px;
  width: 100px;
  border-color: #a6c0e8;
  border-radius: 5px; /* 輸入框的圓角 */
}

.login {
  position: fixed;
  right: 1%;
}

.info {
  position: fixed;
  right: 1%;
  display: flex;
  align-items: center; /* 垂直置中 */
}

.user {
  margin-right: 10px;
  font-weight: bold;
}
.button {
  padding: 7px;
  width: 100px;
  font-weight: bold;
  border: none; /* 移除按鈕的邊框 */
  border-radius: 10px; /* 輸入框的圓角 */
  background: linear-gradient(to top, #e4efdc, #84c7e3);
}

.button:hover {
  background-color: #a6c0e8;
  color: white;
  cursor: pointer;
}

.router {
  color: #817777;
  font-weight: bold;
  font-family: Tahoma, sans-serif;
  font-size: 20px;
  margin-right: 40px;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.6s; /* 過渡效果 */
}

.router:hover {
  color: #ffffffc2; /* 滑鼠懸停時改變文字顏色為白色 */
}

.time-text {
  margin-right: 10px;
  font-size: 25px;
  color: #4dffff;
  transition: all 0.6s ease-in-out; /* 過渡效果 */
  opacity: 1;
}

.time-text:hover {
  margin-right: 30px;
  font-size: 30px;
  color: #ff7575;
  opacity: 0.7; /* 讓滑鼠懸停時變得半透明，平滑過渡 */
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.modal-image {
  width: 300px; /* 圖片寬度 */
  height: 180px; /* 圖片高度 */
  margin-bottom: 15px; /* 圖片與文字之間的間距 */
}

.modal-message {
  font-family: "Arial", sans-serif;
  font-size: 18px;
  line-height: 1.6; /* 行高，讓文字間距舒適 */
  color: #333; /* 文字顏色 */
  margin: 0;
}

.modal-message br {
  margin-bottom: 10px; /* 增加換行之後的距離 */
}

.modal-message strong {
  color: #3498db; /* 可以用這個來突出部分文字 */
}
</style>
