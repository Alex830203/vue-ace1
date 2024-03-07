<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div style="margin-top: 4%">
    <label for="userCode" class="custom-label">用戶名：</label>
    <input type="text" id="userCode" v-model="userCode" class="custom-input" />

    <label for="timeFrom" class="custom-label">開始時間：</label>
    <input type="datetime-local" id="timeFrom" v-model="timeFrom" class="custom-input" />

    <label for="timeTo" class="custom-label">結束時間：</label>
    <input type="datetime-local" id="timeTo" v-model="timeTo" class="custom-input" />

    <button @click="submit" class="custom-button">確定</button>
  </div>
  <table class="custom-table">
    <thead>
      <tr>
        <th>總覽</th>
        <th>路書 ➜</th>
      </tr>
    </thead>
    <tbody>
      <td v-if="overviewData">
        <div><strong>用戶名：</strong>{{ userCode }}</div>
        <div><strong>總筆數：</strong>{{ overviewData.total }}</div>
        <div><strong>貨幣：</strong>{{ overviewData.totalCurrencyCode }}</div>
        <div><strong>總投注金額：</strong>{{ overviewData.totalBetAmt }}</div>
        <div><strong>總調整金額：</strong>{{ overviewData.totalBetAdjAmt }}</div>
        <div><strong>總退款金額：</strong>{{ overviewData.totalBetRetAmt }}</div>
        <div><strong>總監管收款金額：</strong>{{ overviewData.totalSupvRecvAmt }}</div>
      </td>
      <td>
        <img
          v-for="(bet, index) in userbetCode"
          :key="index"
          :src="getImagePath(bet.betCode)"
          alt="User Bet Code Image"
          @click="showBetDetails(bet.betId)"
        />
      </td>
    </tbody>
  </table>
  <div v-if="detailedData" class="custom-table">
    <table>
      <tbody>
        <tr>
          <th>前台注單號：</th>
          <th>區域：</th>
          <th>股東：</th>
          <th>IP：</th>
          <th>遊戲類型：</th>
          <th>桌號：</th>
          <th>牌局號：</th>
          <th>牌靴：</th>
          <th>牌號：</th>
          <th>投注時間：</th>
          <th>結算時間：</th>
          <th>投注類型：</th>
          <th>投注金額：</th>
          <th>投注結果：</th>
        </tr>
        <tr>
          <td>{{ detailedData.extBetId }}</td>
          <td>{{ detailedData.parentCode }}</td>
          <td>{{ detailedData.agentCode }}</td>
          <td>{{ detailedData.sessionIp }}</td>
          <td>{{ detailedData.gameType }}</td>
          <td>{{ detailedData.gameCode }}</td>
          <td>{{ detailedData.roundCode }}</td>
          <td>{{ detailedData.roundShoe }}</td>
          <td>{{ detailedData.roundNum }}</td>
          <td>{{ formatTime(detailedData.betTime) }}</td>
          <td>{{ formatTime(detailedData.settleTime) }}</td>
          <td>{{ detailedData.betCode }}</td>
          <td>{{ detailedData.betAmt }}</td>
          <td>{{ detailedData.betResult }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    token: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      userCode: "", // 用戶名綁定的資料屬性
      roundCode: "",
      timeFrom: "",
      timeTo: "",
      page: 1,
      pageSize: 1000,
      responseData: null,
      userbetCode: [], // 新增用於存儲 betCode 的數組
      overviewData: null,
      detailedData: null,
    };
  },

  methods: {
    async submit() {
      this.responseData = null;
      this.overviewData = null;
      this.userbetCode = null;
      this.detailedData = null;

      if (!this.userCode) {
        // 用戶名為空，顯示錯誤信息並中止提交
        alert("用戶名不能為空");
        return;
      }
      if (!this.timeFrom) {
        // 時間為空，顯示錯誤信息並中止提交
        alert("時間不能為空");
        return;
      }
      if (!this.timeTo) {
        // 時間為空，顯示錯誤信息並中止提交
        alert("時間不能為空");
        return;
      }

      try {
        const response = await axios.post(
          "https://nc-ugs-bo.ms16618.com/mgtapipb.MgtApiService/RptBetRec",
          {
            userCode: this.userCode,
            timeFrom: this.timeFrom + ":00",
            timeTo: this.timeTo + ":00",
            page: this.page,
            pageSize: this.pageSize,
            roundCode: this.roundCode,
          },
          {
            headers: {
              "Content-Type": "application/json",
              accept: "application/json",
              Authorization: `Bearer ${this.token}`, // 在這裡添加 token 到標頭中
            },
          }
        );

        // 將API返回的數據保存在responseData中，以便在模板中顯示
        this.responseData = response.data;
        console.log(`responseData：`, this.responseData);

        // 將相關數據賦值給 overviewData
        this.overviewData = {
          total: this.responseData.total,
          totalCurrencyCode: this.responseData.totalCurrencyCode,
          totalBetAmt: this.responseData.totalBetAmt,
          totalBetAdjAmt: this.responseData.totalBetAdjAmt,
          totalBetRetAmt: this.responseData.totalBetRetAmt,
          totalSupvRecvAmt: this.responseData.totalSupvRecvAmt,
        };
        console.log(`overviewData的data：`, this.overviewData);

        this.userbetCode = response.data.data.map((bet) => ({
          betCode: bet.betCode,
          betId: bet.betId,
        }));
        console.log(`betCode：`, this.userbetCode);
      } catch (error) {
        // 請求失敗
        console.error("請求失敗：", error);
      }
    },
    // 創建一個方法來根據 betCode 返回對應的圖片路徑
    getImagePath(betCode) {
      const imageMapping = {
        BANKER: require("@/assets/BANKER.png"),
        PLAYER: require("@/assets/PLAYER.png"),
        TIE: require("@/assets/TIE.png"),

        // 其他 betCode 對應的路徑
      };

      // 如果找到對應的圖片路徑，則返回它；否則，返回默認的圖片路徑
      return imageMapping[betCode] || require("@/assets/default.png");
    },
    //點擊圖片
    showBetDetails(betId) {
      // 找到相應的投注紀錄
      const betDetails = this.responseData.data.find((bet) => bet.betId === betId);

      // 將投注紀錄保存到變數中
      this.detailedData = betDetails;
    },

    formatTime(time) {
      const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false,
        timeZone: "Asia/Taipei",
      };

      return new Date(time).toLocaleString("zh-TW", options);
    },
  },
};
</script>

<style scoped>
.custom-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.custom-table th,
.custom-table td {
  border: 1px solid #dfd8d8;
  padding: 8px;
  text-align: left;
  text-align: center;
}

.custom-table ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.custom-table th {
  background-color: #e8f0e2;
  width: 300px;
}
.custom-table tbody tr:nth-child(odd) {
  background-color: #e9f0f1;
}

.custom-table tbody tr:nth-child(even) {
  background-color: #e7eced;
}

.custom-table tbody tr:hover {
  background-color: #f2f2f2;
}

.custom-label {
  color: #000000;
  font-size: 20px;
  margin-right: 5px;
  font-weight: bold;
}

.custom-input {
  padding: 8px;
  border: 1px solid #336699;
  border-radius: 5px;
  font-size: 14px;
  margin-right: 1%;
}

.custom-button {
  background-color: #ddebd1;
  color: #000000;
  padding: 8px 12px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer; /* 指針樣式 */
}

.custom-button:hover {
  background-color: #a6c0e8;
  color: white;
  cursor: pointer;
}

.sub-title {
  color: #766f6f;
  font-size: 16px;
  margin-top: 1px;
}
</style>
