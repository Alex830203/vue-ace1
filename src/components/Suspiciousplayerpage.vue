<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div style="margin-top: 4%">
    <label for="timeFrom" class="custom-label">開始時間：</label>
    <input type="datetime-local" class="custom-input" id="timeFrom" v-model="timeFrom" />

    <label for="timeTo" class="custom-label">結束時間：</label>
    <input type="datetime-local" class="custom-input" id="timeTo" v-model="timeTo" />

    <button class="custom-time" @click="setTimeRange('today')">今日</button>
    <button class="custom-time" @click="setTimeRange('yesterday')">昨日</button>
    <button class="custom-time" @click="setTimeRange('last3days')">三日</button>
    <button class="custom-time" @click="setTimeRange('thisWeek')">本周</button>
    <button class="custom-time" @click="setTimeRange('lastWeek')">上周</button>

    <button @click="submit" class="custom-button" style="margin-left: 20px">確定</button>
    <div v-if="loading" class="loading-spinner">搜尋中...</div>

    <div style="display: flex; justify-content: space-between; align-items: center">
      <h2>可疑玩家名單:</h2>
      <button
        class="custom-button"
        style="margin-left: auto; margin-right: 1%"
        @click="
          () => {
            exportCsv(filteredData, '可疑玩家名單', false);
          }
        "
      >
        導出CSV
      </button>
    </div>
    <h5 class="sub-title">(相同IP，不同用戶名)</h5>

    <table class="custom-table">
      <thead>
        <tr>
          <th style="width: 5%">NO.</th>
          <th>IP ({{ getTotalIPs(filteredData) }})</th>
          <th>代理 ({{ getTotalAgents(filteredData) }})</th>
          <th>用戶名 ({{ getTotalUsernames(filteredData) }})</th>
        </tr>
      </thead>
      <tbody>
        <template
          v-for="(records, userSessionIp, index) in filteredData"
          :key="userSessionIp"
        >
          <tr>
            <td>{{ index + 1 }}</td>
            <td>{{ userSessionIp }}</td>
            <td>
              <ul>
                <li v-for="(agentInfo, index) in records.agentInfo" :key="index">
                  {{ agentInfo.agentCode }}
                </li>
              </ul>
            </td>
            <td>
              <ul>
                <li v-for="(agentInfo, index) in records.agentInfo" :key="index">
                  {{ agentInfo.userCodes.join(", ") }}
                </li>
              </ul>
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <div style="display: flex; justify-content: space-between; align-items: center">
      <h2>可疑牌局名單:</h2>
      <button
        class="custom-button"
        style="margin-left: auto; margin-right: 1%"
        @click="
          () => {
            exportCsv(filteredData2, '可疑牌局名單', true);
          }
        "
      >
        導出CSV
      </button>
    </div>
    <h5 class="sub-title">(相同IP，相同牌局號，不同用戶名)</h5>
    <table class="custom-table">
      <thead>
        <tr>
          <th style="width: 5%">NO.</th>
          <th>IP ({{ getTotalIPs(filteredData2) }})</th>
          <th>牌局號 ({{ getTotalRounds(filteredData2) }})</th>
          <th>用戶名</th>
        </tr>
      </thead>
      <tbody>
        <template
          v-for="(records, userSessionIp, index) in filteredData2"
          :key="userSessionIp"
        >
          <tr>
            <td>{{ index + 1 }}</td>
            <td>{{ userSessionIp }}</td>
            <td>
              <ul>
                <li v-for="(roundInfo, index) in records.roundInfo" :key="index">
                  {{ roundInfo.roundCode }}
                </li>
              </ul>
            </td>
            <td>
              <ul>
                <li v-for="(roundInfo, index) in records.roundInfo" :key="index">
                  {{ roundInfo.userCodes.join(", ") }}
                </li>
              </ul>
            </td>
          </tr>
        </template>
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
      userCode: "",
      roundCode: "",
      timeFrom: "",
      timeTo: "",
      page: 1,
      pageSize: 10000,
      responseData1: null,
      filteredData: {},
      filteredData2: {},
      loading: false,
    };
  },
  computed: {
    // eslint-disable-next-line vue/no-dupe-keys
    filteredData() {
      if (!this.responseData1) {
        return {};
      }

      const filteredData = {};

      this.responseData1.data.forEach((record) => {
        const key = record.sessionIp;

        if (!filteredData[key]) {
          filteredData[key] = {
            agentInfo: [],
            userCodes: new Set(),
          };
        }

        const existingAgentInfo = filteredData[key].agentInfo.find(
          (info) => info.agentCode === record.agentCode
        );

        if (existingAgentInfo) {
          existingAgentInfo.userCodes.add(record.userCode);
        } else {
          filteredData[key].agentInfo.push({
            agentCode: record.agentCode,
            userCodes: new Set([record.userCode]),
          });
        }

        filteredData[key].userCodes.add(record.userCode);
      });

      for (const key in filteredData) {
        filteredData[key].userCodes = Array.from(filteredData[key].userCodes);

        filteredData[key].agentInfo.forEach((info) => {
          info.userCodes = Array.from(info.userCodes);
        });
      }

      for (const key in filteredData) {
        if (filteredData[key].userCodes.length < 2) {
          delete filteredData[key];
        }
      }

      return filteredData;
    },

    // eslint-disable-next-line vue/no-dupe-keys
    filteredData2() {
      if (!this.responseData1) {
        return {};
      }

      const filteredData2 = {};

      this.responseData1.data.forEach((record) => {
        const key = record.sessionIp;

        if (!filteredData2[key]) {
          filteredData2[key] = {
            roundInfo: [],
            userCodes: new Set(),
          };
        }

        const existingRoundInfo = filteredData2[key].roundInfo.find(
          (info) => info.roundCode === record.roundCode
        );

        if (existingRoundInfo) {
          existingRoundInfo.userCodes.add(record.userCode);
        } else {
          filteredData2[key].roundInfo.push({
            roundCode: record.roundCode,
            userCodes: new Set([record.userCode]),
          });
        }

        filteredData2[key].userCodes.add(record.userCode);
      });

      for (const key in filteredData2) {
        filteredData2[key].userCodes = Array.from(filteredData2[key].userCodes);

        filteredData2[key].roundInfo.forEach((info) => {
          info.userCodes = Array.from(info.userCodes);

          // 如果 roundCode 為空，將其更改為 "undefined"
          info.roundCode = info.roundCode || "undefined";
        });

        filteredData2[key].roundInfo = filteredData2[key].roundInfo.filter(
          (info) => info.userCodes.length >= 2
        );
      }

      for (const key in filteredData2) {
        if (filteredData2[key].roundInfo.length === 0) {
          delete filteredData2[key];
        }
      }

      return filteredData2;
    },
  },

  methods: {
    async submit() {
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

      this.filteredData = {};
      this.filteredData2 = {};

      this.loading = true;

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

        // 將API返回的數據保存在responseData1中，以便在模板中顯示
        this.responseData1 = response.data;
        console.log("第一個API的data：", this.responseData1);
        this.loading = false;
      } catch (error) {
        // 請求失敗
        this.loading = false;
        console.error("請求失敗：", error);
      }
    },

    async exportCsv(data, fileName, isData2) {
      try {
        // 确保数据不是 undefined 或 null
        if (!data || Object.keys(data).length === 0) {
          console.error("數據為空，無法導出CSV");
          return;
        }

        // 将数据转换为 CSV 格式字符串
        const csv = this.convertToCsv(data, isData2);

        // 创建一个 Blob 对象
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

        // 创建一个下载链接
        const link = document.createElement("a");
        if (link.download !== undefined) {
          // 支持 download 属性的浏览器
          const url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", fileName + ".csv");
          link.style.visibility = "hidden";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } catch (error) {
        console.error("導出CSV失敗：", error);
      }
    },

    convertToCsv(data, isData2) {
      console.log("isData2:", isData2); // 新增這行
      // 將數據轉換為 CSV 格式字符串
      let header, body;

      if (isData2) {
        header = "IP,Round Code,User Code";
        body = Object.entries(data)
          .map(([ip, info]) =>
            (info.roundInfo || []).map(
              (round) =>
                `${ip},${round.roundCode || ""},${(round.userCodes || []).join(",")}`
            )
          )
          .flat()
          .join("\n");
      } else {
        header = "IP,Agent Code,User Code";
        body = Object.entries(data)
          .map(([ip, info]) =>
            (info.agentInfo || []).map(
              (agent) =>
                `${ip},${agent.agentCode || ""},${(agent.userCodes || []).join(",")}`
            )
          )
          .flat()
          .join("\n");
      }

      return header + "\n" + body;
    },

    getTotalIPs(data) {
      return Object.keys(data).length;
    },

    getTotalAgents(data) {
      return Object.values(data).reduce(
        (sum, info) => sum + (info.agentInfo || []).length,
        0
      );
    },

    getTotalUsernames(data) {
      return Object.values(data).reduce(
        (sum, info) => sum + (info.userCodes || []).length,
        0
      );
    },

    getTotalRounds(data) {
      return Object.values(data).reduce(
        (sum, info) => sum + (info.roundInfo || []).length,
        0
      );
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
</style>
