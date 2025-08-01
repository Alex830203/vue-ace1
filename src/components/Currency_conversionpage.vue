<template>
  <div class="eating-history">
    <h2>{{ currentYear }} 年 {{ currentMonth + 1 }} 月</h2>
    <button @click="prevMonth">上個月</button>
    <button @click="nextMonth">下個月</button>
    <button @click="toggleStatistics">
      {{ showStatistics ? "隱藏統計" : "顯示統計" }}
    </button>
    <!-- <button @click="refreshData">
      刷新
      <span v-if="lastUpdated"> (最近刷新時間: {{ lastUpdated }})</span>
    </button> -->

    <div v-if="showStatistics" class="statistics">
      <table>
        <thead>
          <tr>
            <th>類型</th>
            <th>數量</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>❤️</td>
            <td>{{ statistics[`${currentYear}-${currentMonth + 1}`]?.together || 0 }}</td>
          </tr>
          <tr>
            <td>🐱</td>
            <td>{{ statistics[`${currentYear}-${currentMonth + 1}`]?.cat || 0 }}</td>
          </tr>
          <tr>
            <td>🐶</td>
            <td>{{ statistics[`${currentYear}-${currentMonth + 1}`]?.dog || 0 }}</td>
          </tr>
          <tr>
            <td>未知</td>
            <td>{{ statistics[`${currentYear}-${currentMonth + 1}`]?.unknown || 0 }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="calendar">
      <div
        class="day"
        v-for="(day, index) in daysInMonth"
        :key="index"
        @click="showEntryModal(day.date)"
      >
        <div class="date">
          {{ day.date ? day.date.getDate() + " (" + getDayOfWeek(day.date) + ")" : "" }}
        </div>
        <div class="entries">
          <div
            v-for="(entry, entryIndex) in day.entries"
            :key="entryIndex"
            :class="getEntryClass(entry)"
          >
            <div>{{ entry.name }}</div>
            <button class="clear-button" @click.stop="deleteEntry(day.date, entry.name)">
              X
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="modalDate !== null" class="modal">
      <h3>{{ modalDate.toLocaleDateString() }}</h3>
      <div class="radio-group">
        <label>
          ❤️<input type="radio" name="pet" value="together" v-model="selectedOption" />
        </label>
        <label>
          🐱<input type="radio" name="pet" value="cat" v-model="selectedOption" />
        </label>
        <label>
          🐶<input type="radio" name="pet" value="dog" v-model="selectedOption" />
        </label>
      </div>
      <input v-model="newEntryModal" placeholder="新增店家名稱" />
      <button @click="postEntryModal">新增</button>
      <button @click="closeModal">取消</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { toast } from "vue3-toastify"; // 導入 toast 函數

export default {
  data() {
    return {
      newEntryModal: "",
      history: [],
      daysInMonth: [],
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth(),
      modalDate: null,
      selectedOption: "together",
      lastUpdated: "",
      statistics: {},
      showStatistics: false,
    };
  },

  methods: {
    async postEntryModal() {
      if (this.newEntryModal.trim() === "") return;

      const entry = {
        date: this.modalDate.toLocaleDateString(),
        name: this.newEntryModal.trim(),
        type: this.selectedOption,
      };

      try {
        const response = await axios.post("https://alex666.xyz/api/addfood", entry, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status !== 200) {
          throw new Error("新增項目失敗");
        }

        this.history.push(entry);
        this.newEntryModal = "";
        this.selectedOption = "together";
        this.saveHistory();
        this.updateDaysInMonth();
        this.closeModal();

        // 顯示成功提示
        toast.success("添加成功👌", {
          position: "bottom-center",
          autoClose: 3000,
        });
      } catch (error) {
        console.error("錯誤發生:", error);
        toast.error("添加失敗😱", {
          position: "bottom-center",
          autoClose: 3000,
        });
      }
    },

    async refreshData() {
      try {
        const response = await axios.get("https://alex666.xyz/api/foodlist");
        const data = response.data;

        // 先進行資料分組和統計
        const groupedData = this.groupAndCountByType(data);

        // 更新歷史資料和統計數據
        this.history = data.map((item) => ({
          date: item.date || new Date(item.createdtime).toLocaleDateString(),
          name: item.name,
          type: item.type || "未知",
        }));

        this.statistics = groupedData;
        this.updateDaysInMonth();
        this.saveHistory();
        this.lastUpdated = new Date().toLocaleString();
      } catch (error) {
        console.error("獲取數據時發生錯誤:", error);
      }
    },

    async deleteEntry(date, name) {
      const confirmDelete = confirm(
        `確定要刪除 ${date.toLocaleDateString()} 的 ${name} 嗎？`
      );
      if (!confirmDelete) return;

      const entryToDelete = {
        date: date.toLocaleDateString(),
        name: name,
      };

      try {
        const response = await axios.post(
          "https://alex666.xyz/api/deletefood",
          entryToDelete,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          this.history = this.history.filter((entry) => {
            return !(
              entry.date === entryToDelete.date && entry.name === entryToDelete.name
            );
          });
          this.updateDaysInMonth();
          this.saveHistory();

          // 顯示成功提示
          toast.success("刪除成功👌", {
            position: "bottom-center",
            autoClose: 3000,
          });
        } else {
          throw new Error("刪除項目失敗");
        }
      } catch (error) {
        console.error("刪除項目時發生錯誤:", error);
        toast.error("刪除失敗😱", {
          position: "bottom-center",
          autoClose: 3000,
        });
      }
    },

    groupAndCountByType(data) {
      const grouped = {};
      data.forEach((item) => {
        const date = new Date(item.date);
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // JavaScript 的月份從 0 開始

        const key = `${year}-${month}`;
        if (!grouped[key]) {
          grouped[key] = {
            together: 0,
            cat: 0,
            dog: 0,
            unknown: 0,
          };
        }

        if (item.type === "together") {
          grouped[key].together += 1;
        } else if (item.type === "cat") {
          grouped[key].cat += 1;
        } else if (item.type === "dog") {
          grouped[key].dog += 1;
        } else {
          grouped[key].unknown += 1;
        }
      });

      return grouped;
    },

    saveHistory() {
      localStorage.setItem("eatingHistory", JSON.stringify(this.history));
    },
    loadHistory() {
      const savedHistory = localStorage.getItem("eatingHistory");
      if (savedHistory) {
        this.history = JSON.parse(savedHistory);
      }
      this.updateDaysInMonth();
    },
    updateDaysInMonth() {
      const year = this.currentYear;
      const month = this.currentMonth;

      // 計算本月天數
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      this.daysInMonth = [];

      // 計算本月第一天是星期幾
      const firstDay = new Date(year, month, 1).getDay();

      // 在本月第一天之前添加空白天數
      if (firstDay !== 1) {
        for (let i = 1; i < firstDay; i++) {
          this.daysInMonth.push({ date: null, entries: [] });
        }
      }

      // 添加有項目的日期
      for (let i = 0; i < daysInMonth; i++) {
        const date = new Date(year, month, i + 1);
        const entries = this.history.filter((entry) => {
          const entryDate = new Date(entry.date);
          return (
            entryDate.getFullYear() === year &&
            entryDate.getMonth() === month &&
            entryDate.getDate() === date.getDate()
          );
        });
        this.daysInMonth.push({ date, entries });
      }
    },
    getDayOfWeek(date) {
      if (!date) return "";
      const daysOfWeek = ["日", "一", "二", "三", "四", "五", "六"];
      return daysOfWeek[date.getDay()];
    },
    prevMonth() {
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.currentYear -= 1;
      } else {
        this.currentMonth -= 1;
      }
      this.updateDaysInMonth();
    },
    nextMonth() {
      if (this.currentMonth === 11) {
        this.currentMonth = 0;
        this.currentYear += 1;
      } else {
        this.currentMonth += 1;
      }
      this.updateDaysInMonth();
    },
    showEntryModal(date) {
      this.modalDate = date;
      this.newEntryModal = "";
    },
    closeModal() {
      this.modalDate = null;
      this.newEntryModal = "";
    },
    getEntryClass(entry) {
      if (entry.type === "dog") {
        return "entry-dog";
      } else if (entry.type === "cat") {
        return "entry-cat";
      } else {
        return "entry-together";
      }
    },
    toggleStatistics() {
      this.showStatistics = !this.showStatistics;
    },
  },
  async mounted() {
    await this.refreshData(); // 確保先從伺服器獲取最新數據
    this.loadHistory(); // 然後再載入本地儲存的數據
  },
};
</script>

<style scoped>
.eating-history {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, Helvetica, sans-serif;
}

h2 {
  margin-top: 6%;
  font-size: 1.5em;
  text-align: center;
  margin-bottom: 20px;
}

button {
  background-color: #82abd6;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  margin: 0 5px;
}

.clear-button {
  background-color: #d9534f;
  color: white;
  border: none;
  padding: 2px 6px;
  cursor: pointer;
  border-radius: 50%; /* 添加圓角 */
}

button:hover {
  background-color: #6d9ed3;
}

.calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
}

.day {
  border: 1px solid #ddd;
  padding: 10px;
  min-height: 100px;
  cursor: pointer;
  transition: background-color 0.3s;
  position: relative;
}

.day:hover {
  background-color: #f0f0f0;
}

.date {
  font-weight: bold;
  margin-bottom: 5px;
}

.entries {
  margin-top: 10px;
}

.entry-dog {
  background-color: #a6b2dade;
  margin-bottom: 5px;
  padding: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  border-radius: 10px; /* 添加圓角 */
}

.entry-cat {
  background-color: #d8abc4d5;
  margin-bottom: 5px;
  padding: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  border-radius: 10px; /* 添加圓角 */
}

.entry-together {
  background-color: #e6ffe6d0;
  margin-bottom: 5px;
  padding: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  border-radius: 10px; /* 添加圓角 */
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border: 1px solid #ddd;
  z-index: 1000;
  max-width: 400px;
  width: 100%;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px; /* 添加圓角 */
}

.modal h3 {
  font-size: 1.2em;
  margin-bottom: 10px;
}

.modal input {
  width: calc(100% - 20px);
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
}

.modal button {
  background-color: #82abd6;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  margin-right: 10px;
}

.modal button:hover {
  background-color: #6a9cd1;
}

.radio-group {
  display: flex;
  gap: 15px;
  margin-bottom: 10px; /* 增加底部間距 */
}

.radio-group label {
  display: flex;
  align-items: center;
  gap: 5px;
}

.statistics {
  margin-top: 20px;
}

.statistics table {
  width: 100%;
  border-collapse: collapse;
}

.statistics th,
.statistics td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

.statistics th {
  background-color: #f4f4f4;
}

.statistics tr:nth-child(even) {
  background-color: #f9f9f9;
}
</style>
