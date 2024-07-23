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
          <router-link
            :to="{ path: '/tgbot', query: { token: isLoggedIn ? userToken : null } }"
            class="router"
            >口袋名單</router-link
          >
          <router-link
            :to="{
              path: '/currency_conversion',
              query: { token: isLoggedIn ? userToken : null },
            }"
            class="router"
            >美食日曆</router-link
          >
          <router-link
            :to="{
              path: '/stock',
              query: { token: isLoggedIn ? userToken : null },
            }"
            class="router"
            >股票</router-link
          >
          <router-link
            :to="{
              path: '/news',
              query: { token: isLoggedIn ? userToken : null },
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
        <H2 style="margin-right: 10px; color: #817777">{{ currentTime }}</H2>
        <button @click="logout" class="button">登出</button>
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
      isLoggedIn: false, //預設登入狀態
      userToken: "",
      currentTime: this.getCurrentTime(),
    };
  },

  mounted() {
    this.isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    this.userToken = localStorage.getItem("userToken");
    this.checkTokenExpiration();

    console.log("登入狀態：", this.isLoggedIn);
    console.log("Token：", this.userToken);

    //更新當前時間
    setInterval(() => {
      this.currentTime = this.getCurrentTime();
      this.checkTokenExpiration();
    }, 1000);
  },

  methods: {
    async login() {
      try {
        const response = await axios.post(
          "https://alex777.xyz/api/adminlogin",
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
        this.$router.push({
          query: { token: this.userToken },
        });
      } catch (error) {
        // 處理登入失敗的情況，例如顯示錯誤訊息
        console.error("登入失敗：", error);
      }
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
</style>
