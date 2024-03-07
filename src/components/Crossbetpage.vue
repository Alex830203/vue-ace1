<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div style="margin-top: 4%">
    <label for="userCode" class="custom-label">用戶名：</label>
    <input type="text" id="userCode" v-model="userCode" class="custom-input" />

    <label for="timeFrom" class="custom-label">開始時間：</label>
    <input type="datetime-local" id="timeFrom" v-model="timeFrom" class="custom-input" />

    <label for="timeTo" class="custom-label">結束時間：</label>
    <input type="datetime-local" id="timeTo" v-model="timeTo" class="custom-input" />

    <button class="custom-time" @click="setTimeRange('today')">今日</button>
    <button class="custom-time" @click="setTimeRange('yesterday')">昨日</button>
    <button class="custom-time" @click="setTimeRange('last3days')">三日</button>
    <button class="custom-time" @click="setTimeRange('thisWeek')">本周</button>
    <button class="custom-time" @click="setTimeRange('lastWeek')">上周</button>
    <button class="custom-time" @click="setTimeRange('thisMonth')">本月</button>

    <div
      style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 1%;
      "
    >
      <input
        type="checkbox"
        id="BetTypeCheck"
        v-model="checkBettype"
        class="custom-input"
        style="transform: scale(2); margin-left: 15px"
      />
      <label for="BetTypeCheck" class="custom-label" style="margin-right: 30px"
        >下注類型相反</label
      >

      <!-- <input type="checkbox" id="MoneyCheck" v-model="checkMoney" class="custom-input" />
      <label for="MoneyCheck" class="custom-label">金額相近</label> -->

      <input
        type="checkbox"
        id="IPCheck"
        v-model="checkIP"
        class="custom-input"
        style="transform: scale(2)"
      />
      <label for="IPCheck" class="custom-label" style="margin-right: 30px">IP相同</label>

      <input
        type="checkbox"
        id="CurrencyCheck"
        v-model="checkCurrency"
        class="custom-input"
        style="transform: scale(2)"
      />
      <label for="CurrencyCheck" class="custom-label" style="margin-right: 30px"
        >貨幣相同</label
      >

      <input
        type="checkbox"
        id="AgentCodeCheck"
        v-model="checkAgentCode"
        class="custom-input"
        style="transform: scale(2)"
      />
      <label for="AgentCodeCheck" class="custom-label" style="margin-right: 30px"
        >代理相同</label
      >

      <button @click="submit" class="custom-button">確定</button>
      <button
        @click="exportCSV"
        class="custom-button"
        style="margin-left: auto; margin-right: 1%"
      >
        導出CSV
      </button>
    </div>
    <div v-if="loading" class="loading-spinner">搜尋中...</div>
  </div>
  <div>
    <table class="custom-table">
      <thead>
        <tr>
          <th style="width: 5%">NO.</th>
          <th>牌局號 ({{ Object.keys(organizedData).length }})</th>
          <th>投注時間</th>
          <th>用戶名</th>
          <th>貨幣</th>
          <th>下注金額</th>
          <th style="color: #de7777">轉換後金額(USD)</th>
          <th>下注類型</th>
          <th>IP</th>
          <th>代理</th>
          <th>遊戲桌子</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(bets, roundCode, index) in organizedData" :key="roundCode">
          <tr v-for="(bet, betIndex) in bets" :key="bet.betId">
            <td v-if="betIndex === 0" :rowspan="bets.length">{{ index + 1 }}</td>
            <td v-if="betIndex === 0" :rowspan="bets.length">{{ roundCode }}</td>
            <td>{{ formatTime(bet.betTime) }}</td>
            <td :class="{ highlight: bet.userCode === userCode }">
              {{ bet.userCode }}
            </td>
            <td>{{ bet.currencyCode }}</td>
            <td>{{ bet.betAmt }}</td>
            <td style="color: #de7777; font-weight: bold">
              {{ bet.ConbetAmt }}
            </td>
            <td>{{ betCodeMapping[bet.betCode] || bet.betCode }}</td>
            <td>{{ bet.sessionIp }}</td>
            <td>{{ bet.agentCode }}</td>
            <td>{{ gameCodeMapping[bet.gameCode] || bet.gameCode }}</td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";
import dataMapping from "./data.json";

export default {
  props: {
    token: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      userCode: "",
      roundCode: "",
      timeFrom: "",
      timeTo: "",
      page: 1,
      pageSize: 5000,
      responseData: null,
      responseData2: null,
      responseData3: null,
      organizedData: {},
      userSessionIp: null,
      checkBettype: false,
      checkMoney: false,
      checkIP: false,
      checkCurrency: false,
      checkAgentCode: false,
      validPairs: [],
      userSessionIpNoDup: [],
      betCodeMapping: dataMapping.betCode,
      gameCodeMapping: dataMapping.gameCode,
      //匯率表
      exchangeRates: {},
      loading: false,
    };
  },

  methods: {
    async submit() {
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

      (this.organizedData = {}), (this.loading = true);

      try {
        //請求匯率表
        const response3 = await axios.post(
          "https://nc-ugs-bo.ms16618.com/mgtapipb.MgtApiService/CurrencyList",
          {},
          {
            headers: {
              "Content-Type": "application/json",
              accept: "application/json",
              Authorization: `Bearer ${this.token}`, // 在這裡添加 token 到標頭中
            },
          }
        );

        // 將API返回的數據保存在responseData中，以便在模板中顯示
        this.responseData3 = response3.data.data;
        console.log(`請求匯率表：`, this.responseData3);

        // 遍歷 responseData3，構建 exchangeRates 對象
        this.responseData3.forEach((rate) => {
          const currencyCode = rate.currencyCode;
          const currencyRate = rate.currencyRate;

          // 將 currencyCode 和 currencyRate 添加到 exchangeRates 對象
          this.exchangeRates[currencyCode] = currencyRate;
        });
        console.log(`匯率表：`, this.exchangeRates);

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
        console.log(`${this.userCode}的data：`, this.responseData);

        // 過濾重複的 userSessionIp
        const userSessionIpSet = new Set(response.data.data.map((bet) => bet.sessionIp));
        this.userSessionIpNoDup = Array.from(userSessionIpSet);
        console.log("過濾重複的 userSessionIp : ", this.userSessionIpNoDup);

        // 過濾重複的 roundCode
        const roundCodeSet = new Set(response.data.data.map((bet) => bet.roundCode));
        const roundCodeNoDup = Array.from(roundCodeSet);
        console.log("過濾重複的 roundCode : ", roundCodeNoDup);
        console.log("Round Codes: ", roundCodeNoDup.join(","));

        const response2 = await axios.post(
          "https://nc-ugs-bo.ms16618.com/mgtapipb.MgtApiService/RptBetRec",
          {
            page: this.page,
            timeFrom: this.timeFrom + ":00",
            timeTo: this.timeTo + ":00",
            pageSize: this.pageSize,
            roundCode: roundCodeNoDup.join(","), // 使用逗號分隔的字符串
          },
          {
            headers: {
              "Content-Type": "application/json",
              accept: "application/json",
              Authorization: `Bearer ${this.token}`,
            },
          }
        );

        // 处理第二个请求的响应数据
        this.responseData2 = response2.data;
        console.log(`${this.userCode}的data：`, this.responseData2);

        // 重新整理的資料
        this.organizedData = {};

        this.responseData2.data.forEach((bet) => {
          // 使用 bet 中的 `roundCode` 作为 key
          const roundCode = bet.roundCode;

          // 检查该 `roundCode` 在 organizedData 中是否已存在，如果不存在则创建一个数组
          // eslint-disable-next-line no-prototype-builtins
          if (!this.organizedData.hasOwnProperty(roundCode)) {
            this.organizedData[roundCode] = [];
          }

          // 将当前投注记录添加到相应的数组中
          this.organizedData[roundCode].push({
            userCode: bet.userCode,
            betTime: bet.betTime,
            currencyCode: bet.currencyCode,
            betAmt: bet.betAmt,
            betCode: bet.betCode,
            sessionIp: bet.sessionIp,
            agentCode: bet.agentCode,
            gameType: bet.gameType,
            gameCode: bet.gameCode,
            ConbetAmt: this.convertCurrency(bet.betAmt, bet.currencyCode),
          });
        });

        this.handleBetTypeCheck();
        // this.handleMoneyCheck();
        this.handleIPCheck();

        this.handleCurrencyCheck();

        this.handleAgentCodeCheck();

        console.log(`organizedData：`, this.organizedData);

        this.loading = false;
      } catch (error) {
        // 請求失敗
        this.loading = false;
        console.error("請求失敗：", error);
      }
    },

    handleIPCheck() {
      // 处理IP相同的逻辑
      if (this.checkIP) {
        for (const roundCode in this.organizedData) {
          // eslint-disable-next-line no-prototype-builtins
          if (this.organizedData.hasOwnProperty(roundCode)) {
            // 获取当前局的所有投注记录
            const bets = this.organizedData[roundCode];

            // 使用一个 Set 来记录每个 IP 对应的 userCode
            const ipUserCodeSet = new Map();

            // 遍历当前局的所有投注记录
            bets.forEach((bet) => {
              const ip = bet.sessionIp;
              const userCode = bet.userCode;

              // 如果 Set 中不存在该 IP 对应的 userCode，则加入 Set
              if (!ipUserCodeSet.has(ip)) {
                ipUserCodeSet.set(ip, new Set());
              }
              ipUserCodeSet.get(ip).add(userCode);
            });

            // 筛选出符合条件的投注记录
            const filteredBets = bets.filter((bet) => {
              const ip = bet.sessionIp;
              const userCodeSet = ipUserCodeSet.get(ip);

              // 保留同一局有不同userCode的投注记录
              return userCodeSet.size >= 2 && userCodeSet.has(this.userCode);
            });

            // 更新当前局的投注记录
            this.organizedData[roundCode] = filteredBets;

            // 如果该 roundCode 的投注记录被完全过滤掉，移除该 roundCode
            if (filteredBets.length === 0) {
              delete this.organizedData[roundCode];
            }
          }
        }
      }
    },

    handleBetTypeCheck() {
      // 處理下注類型相反的邏輯
      if (this.checkBettype) {
        for (const roundCode in this.organizedData) {
          // eslint-disable-next-line no-prototype-builtins
          if (this.organizedData.hasOwnProperty(roundCode)) {
            // 獲取當前局的所有投注記錄
            const bets = this.organizedData[roundCode];

            // 過濾出符合規定的配對組合的投注記錄
            const filteredBets = bets.filter((currentBet) => {
              const currentBetCode = currentBet.betCode;

              // 檢查是否存在其他玩家的betCode和當前玩家的betCode可以配對
              return bets.some((otherBet) => {
                const otherBetCode = otherBet.betCode;

                // 檢查是否為符合條件的配對組合，且其他玩家是查询的用户或当前玩家
                return (
                  currentBetCode !== otherBetCode && // 不是同一個betCode
                  this.isValidBetCodePair(currentBetCode, otherBetCode) &&
                  (this.userCode === otherBet.userCode ||
                    this.userCode === currentBet.userCode)
                );
              });
            });

            // 更新當前局的投注記錄
            this.organizedData[roundCode] = filteredBets;

            // 如果該 roundCode 的投注記錄被完全過濾掉，移除該 roundCode
            if (filteredBets.length === 0) {
              delete this.organizedData[roundCode];
            }
          }
        }
      }
    },

    handleCurrencyCheck() {
      // 处理货币相同的逻辑
      if (this.checkCurrency) {
        for (const roundCode in this.organizedData) {
          // eslint-disable-next-line no-prototype-builtins
          if (this.organizedData.hasOwnProperty(roundCode)) {
            // 获取当前局的所有投注记录
            const bets = this.organizedData[roundCode];

            // 使用一个 Set 来记录每个 currencyCode 对应的 userCode
            const currencyCodeUserCodeSet = new Map();

            // 遍历当前局的所有投注记录
            bets.forEach((bet) => {
              const currencyCode = bet.currencyCode;
              const userCode = bet.userCode;

              // 如果 Set 中不存在该 currencyCode 对应的 userCode，则加入 Set
              if (!currencyCodeUserCodeSet.has(currencyCode)) {
                currencyCodeUserCodeSet.set(currencyCode, new Set());
              }
              currencyCodeUserCodeSet.get(currencyCode).add(userCode);
            });

            // 筛选出符合条件的投注记录，仅当查询的用户与其他用户具有相同代理时才进行过滤
            const filteredBets = bets.filter((bet) => {
              const currencyCode = bet.currencyCode;
              const userCodeSet = currencyCodeUserCodeSet.get(currencyCode);

              // 保留同一局有查询的用户和其他用户的投注记录
              return userCodeSet.size >= 2 && userCodeSet.has(this.userCode);
            });

            // 更新当前局的投注记录
            this.organizedData[roundCode] = filteredBets;

            // 如果该 roundCode 的投注记录被完全过滤掉，移除该 roundCode
            if (filteredBets.length === 0) {
              delete this.organizedData[roundCode];
            }
          }
        }
      }
    },

    handleAgentCodeCheck() {
      // 处理代理相同的逻辑
      if (this.checkAgentCode) {
        for (const roundCode in this.organizedData) {
          // eslint-disable-next-line no-prototype-builtins
          if (this.organizedData.hasOwnProperty(roundCode)) {
            // 获取当前局的所有投注记录
            const bets = this.organizedData[roundCode];

            // 使用一个 Set 来记录每个 agentCode 对应的 userCode
            const agentCodeUserCodeSet = new Map();

            // 遍历当前局的所有投注记录
            bets.forEach((bet) => {
              const agentCode = bet.agentCode;
              const userCode = bet.userCode;

              // 如果 Set 中不存在该 agentCode 对应的 userCode，则加入 Set
              if (!agentCodeUserCodeSet.has(agentCode)) {
                agentCodeUserCodeSet.set(agentCode, new Set());
              }
              agentCodeUserCodeSet.get(agentCode).add(userCode);
            });

            // 筛选出符合条件的投注记录，仅当查询的用户与其他用户具有相同代理时才进行过滤
            const filteredBets = bets.filter((bet) => {
              const agentCode = bet.agentCode;
              const userCodeSet = agentCodeUserCodeSet.get(agentCode);

              // 保留同一局有查询的用户和其他用户的投注记录
              return userCodeSet.size >= 2 && userCodeSet.has(this.userCode);
            });

            // 更新当前局的投注记录
            this.organizedData[roundCode] = filteredBets;

            // 如果该 roundCode 的投注记录被完全过滤掉，移除该 roundCode
            if (filteredBets.length === 0) {
              delete this.organizedData[roundCode];
            }
          }
        }
      }
    },

    //對投表
    isValidBetCodePair(betCode1, betCode2) {
      // 定義有效的BetCode組合
      this.validPairs = [
        ["PLAYER", "BANKER"],
        ["PLAYER", "SUPER_SIX_BANKER"],
        ["DRAGON", "TIGER"],
        ["ODD", "EVEN"],
        ["BLACK", "RED"],
        ["BIG", "SMALL"],
        ["DRAGON", "PHOENIX"],
        ["KWOK_23", "KWOK_41"],
        ["KWOK_12", "KWOK_34"],
        ["BANKER1_MUL", "PLAYER1_MUL"],
        ["BANKER1_NOR", "PLAYER1_NOR"],
        ["BANKER2_MUL", "PLAYER2_MUL"],
        ["BANKER2_NOR", "PLAYER2_NOR"],
        ["BANKER3_MUL", "PLAYER3_MUL"],
        ["BANKER3_NOR", "PLAYER3_NOR"],
        // 添加更多的組合...
      ];

      // 檢查是否為有效的BetCode組合
      return this.validPairs.some((pair) => {
        return (
          (pair[0] === betCode1 && pair[1] === betCode2) ||
          (pair[0] === betCode2 && pair[1] === betCode1)
        );
      });
    },

    // 匯率換算
    convertCurrency(amount, currencyCode) {
      // 檢查是否有對應的匯率
      // eslint-disable-next-line no-prototype-builtins
      if (this.exchangeRates.hasOwnProperty(currencyCode)) {
        // 使用匯率換算金額
        return (amount * this.exchangeRates[currencyCode]).toFixed(2);
      } else {
        // 如果沒有對應的匯率，返回原始金額
        return amount;
      }
    },

    // 時間轉換
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

    exportCSV() {
      // 获取 organizedData 中所有的 roundCode
      const roundCodes = Object.keys(this.organizedData);

      // 创建CSV内容
      let csvContent =
        "牌局號,投注時間,用戶名,貨幣,下注金額,轉換後金額(USD),下注類型,IP,代理\n";

      // 遍历 organizedData 中的数据
      roundCodes.forEach((roundCode) => {
        const roundData = this.organizedData[roundCode];

        roundData.forEach((bet) => {
          // 添加每一行的数据
          csvContent += `${roundCode},${bet.betTime},${bet.userCode},${bet.currencyCode},${bet.betAmt},${bet.ConbetAmt},${bet.betCode},${bet.sessionIp},${bet.agentCode}\n`;
        });
      });

      // 创建一个Blob对象，用于下载CSV
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

      // 使用URL.createObjectURL创建URL并生成下载链接
      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "對投查詢.csv");

        // 立即触发点击以模拟用户操作
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },

    setTimeRange(range) {
      const now = new Date();
      switch (range) {
        case "today":
          this.timeFrom = this.formatDate(
            new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0)
          );
          this.timeTo = this.formatDate(
            new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0)
          );
          break;
        case "yesterday":
          // eslint-disable-next-line no-case-declarations
          const yesterday = new Date(now);
          yesterday.setDate(now.getDate() - 1);
          this.timeFrom = this.formatDate(
            new Date(
              yesterday.getFullYear(),
              yesterday.getMonth(),
              yesterday.getDate(),
              0,
              0
            )
          );
          this.timeTo = this.formatDate(
            new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0)
          );
          break;
        case "last3days":
          // eslint-disable-next-line no-case-declarations
          const threeDaysAgo = new Date(now);
          threeDaysAgo.setDate(now.getDate() - 2); // 最近三天包括今天，所以减2
          this.timeFrom = this.formatDate(
            new Date(
              threeDaysAgo.getFullYear(),
              threeDaysAgo.getMonth(),
              threeDaysAgo.getDate(),
              0,
              0
            )
          );
          this.timeTo = this.formatDate(
            new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0)
          );
          break;
        case "thisWeek":
          // eslint-disable-next-line no-case-declarations
          const thisMonday = new Date(now);
          thisMonday.setDate(
            now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1)
          );
          this.timeFrom = this.formatDate(
            new Date(
              thisMonday.getFullYear(),
              thisMonday.getMonth(),
              thisMonday.getDate(),
              0,
              0
            )
          );
          this.timeTo = this.formatDate(
            new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0)
          );
          break;
        case "lastWeek":
          // eslint-disable-next-line no-case-declarations
          const lastMonday = new Date(now);
          lastMonday.setDate(now.getDate() - now.getDay() - 6);
          // eslint-disable-next-line no-case-declarations
          const lastSunday = new Date(now);
          lastSunday.setDate(now.getDate() - now.getDay());
          this.timeFrom = this.formatDate(
            new Date(
              lastMonday.getFullYear(),
              lastMonday.getMonth(),
              lastMonday.getDate(),
              0,
              0
            )
          );
          this.timeTo = this.formatDate(
            new Date(
              lastSunday.getFullYear(),
              lastSunday.getMonth(),
              lastSunday.getDate() + 1,
              0,
              0
            )
          );
          break;
        case "thisMonth":
          // eslint-disable-next-line no-case-declarations
          const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          this.timeFrom = this.formatDate(
            new Date(
              firstDayOfMonth.getFullYear(),
              firstDayOfMonth.getMonth(),
              firstDayOfMonth.getDate(),
              0,
              0
            )
          );
          this.timeTo = this.formatDate(
            new Date(
              now.getFullYear(),
              now.getMonth(),
              new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() + 1,
              0,
              0
            )
          );
          break;
      }
    },
    // 格式化日期为适合datetime-local的格式
    formatDate(date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${year}-${month}-${day}T${hours}:${minutes}`;
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
  font-weight: bold;
}

.custom-input {
  padding: 8px;
  border: 1px solid #336699;
  border-radius: 5px;
  font-size: 14px;
  margin-right: 1%;
}

.custom-time {
  background-color: #d2f7f1;
  color: #000000;
  padding: 8px 12px;
  border: none;
  margin: 3px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer; /* 指針樣式 */
}

.custom-time:hover {
  background-color: rgb(204, 238, 189);
  color: white;
  cursor: pointer;
}

.custom-button {
  background-color: #ddebd1;
  color: #000000;
  padding: 8px 12px;
  margin: 3px;

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

.loading-spinner {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.8);
  padding: 30px;
  border-radius: 5px;
}

.highlight {
  color: rgb(75, 179, 71);
  font-weight: bold;
  font-size: 20px;
}
</style>
