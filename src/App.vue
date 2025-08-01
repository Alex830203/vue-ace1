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
        <h3>🧨新年快樂🧨</h3>
        <img src="dog.jpg" alt="小圖" class="modal-image" />
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
      startDate: new Date("2022-05-03T08:00:00"), // 起始日期
      alternateText: "2022/05/03現在", // 滑鼠移入時顯示的文字
      displayText: "", // 用來顯示當前的文字
      isHovering: false, // 用於記錄滑鼠是否在文字上
      hoverTimeout: null, // 用來記錄延遲的計時器
      showModal: false, // 控制彈窗顯示
      messageContent: "𝙒𝙞𝙨𝙝𝙞𝙣𝙜 𝙮𝙤𝙪 𝙖 𝙮𝙚𝙖𝙧 𝙛𝙞𝙡𝙡𝙚𝙙 𝙬𝙞𝙩𝙝 𝙡𝙪𝙘𝙠, 𝙡𝙤𝙫𝙚, 𝙖𝙣𝙙 𝙚𝙣𝙙𝙡𝙚𝙨𝙨 𝙟𝙤𝙮!",
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
          "https://alex666.xyz/api/adminlogin",
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

        // 捕捉錯誤訊息和狀態碼
        const errorMessage = error.response ? error.response.data.message : "未知錯誤";
        const errorStatus = error.response ? error.response.status : "無狀態碼";

        // 使用系統彈窗顯示錯誤訊息
        alert(`⚠️ 登入失敗！\n錯誤訊息：${errorMessage}\n狀態碼：${errorStatus}`);
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
  height: 400px; /* 圖片高度 */
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
