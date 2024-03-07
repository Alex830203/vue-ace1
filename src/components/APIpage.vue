<template>
  <div class="content">
    <div style="height: 80px; margin-top: 4%">
      <button
        @click="postData4"
        style="
          font-weight: bold;
          /* stylelint-disable-next-line order/properties-order */
          background-color: black;
          color: goldenrod;
          /* stylelint-disable-next-line order/properties-order */
          padding: 10px 30px;
          border: none;
          cursor: pointer;
          /* stylelint-disable-next-line order/properties-order */
          border-radius: 20px; /* 設定按鈕邊緣為圓形 */
        "
      >
        開始遊戲 (UAT)
      </button>
    </div>
    <div style="height: 80px">
      <button
        @click="postData1"
        style="
          font-weight: bold;
          /* stylelint-disable-next-line order/properties-order */
          background-color: #61a7f2;
          color: black;
          /* stylelint-disable-next-line order/properties-order */
          padding: 10px 20px;
          border: none;
          cursor: pointer;
          /* stylelint-disable-next-line order/properties-order */
          border-radius: 20px; /* 設定按鈕邊緣為圓形 */
        "
      >
        取得代理資料3.0（PROD）
      </button>
      <input
        v-model="postDataValue1"
        placeholder="agentCode"
        style="margin-left: 5px; padding: 10px"
      />
      OR
      <input
        v-model="postDataValue4"
        placeholder="channelId"
        style="margin-left: 5px; padding: 10px"
      />
      <div v-if="postResponse1" class="top-text">{{ postResponse1 }}</div>
    </div>
    <div style="height: 80px">
      <button
        @click="postData2"
        style="
          font-weight: bold;
          /* stylelint-disable-next-line order/properties-order */
          background-color: #ef9d6d;
          color: black;
          /* stylelint-disable-next-line order/properties-order */
          padding: 10px 20px;
          border: none;
          cursor: pointer;
          /* stylelint-disable-next-line order/properties-order */
          border-radius: 20px; /* 設定按鈕邊緣為圓形 */
        "
      >
        取得代理資料3.0（UAT）
      </button>
      <input
        v-model="postDataValue2"
        placeholder="agentCode"
        style="margin-left: 5px; padding: 10px"
      />
      OR
      <input
        v-model="postDataValue5"
        placeholder="channelId"
        style="margin-left: 5px; padding: 10px"
      />
      <div v-if="postResponse2" class="top-text">{{ postResponse2 }}</div>
    </div>
    <div style="height: 80px">
      <button
        @click="postData5"
        style="
          font-weight: bold;
          /* stylelint-disable-next-line order/properties-order */
          background-color: #e6ed7e;
          color: black;
          /* stylelint-disable-next-line order/properties-order */
          padding: 10px 20px;
          border: none;
          cursor: pointer;
          /* stylelint-disable-next-line order/properties-order */
          border-radius: 20px; /* 設定按鈕邊緣為圓形 */
        "
      >
        取消牌局（PROD）
      </button>
      <input
        v-model="postDataValue6"
        placeholder="OperatorID"
        style="margin-left: 5px; padding: 10px; width: 250px"
      />
      <input
        v-model="postDataValue7"
        placeholder="AppSecret"
        style="margin-left: 5px; padding: 10px; width: 250px"
      />
      <input
        v-model="postDataValue8"
        placeholder="PlayerID"
        style="margin-left: 5px; padding: 10px; width: 250px"
      />
      <input
        v-model="postDataValue9"
        placeholder="BetID"
        style="margin-left: 5px; padding: 10px; width: 250px"
      />
      <div v-if="postResponse4" class="top-text">{{ postResponse4 }}</div>
    </div>
    <div style="height: 80px">
      <button
        @click="postData6"
        style="
          font-weight: bold;
          /* stylelint-disable-next-line order/properties-order */
          background-color: #e067ef;
          color: black;
          /* stylelint-disable-next-line order/properties-order */
          padding: 10px 20px;
          border: none;
          cursor: pointer;
          /* stylelint-disable-next-line order/properties-order */
          border-radius: 20px; /* 設定按鈕邊緣為圓形 */
        "
      >
        取消牌局（UAT）
      </button>
      <input
        v-model="postDataValue10"
        placeholder="OperatorID"
        style="margin-left: 5px; padding: 10px; width: 250px"
      />
      <input
        v-model="postDataValue11"
        placeholder="AppSecret"
        style="margin-left: 5px; padding: 10px; width: 250px"
      />
      <input
        v-model="postDataValue12"
        placeholder="PlayerID"
        style="margin-left: 5px; padding: 10px; width: 250px"
      />
      <input
        v-model="postDataValue13"
        placeholder="BetID"
        style="margin-left: 5px; padding: 10px; width: 250px"
      />
      <div v-if="postResponse5" class="top-text">{{ postResponse5 }}</div>
    </div>
    <div style="height: 80px">
      <button
        @click="postData3"
        style="
          font-weight: bold;
          /* stylelint-disable-next-line order/properties-order */
          background-color: #51d4eb;
          color: black;
          /* stylelint-disable-next-line order/properties-order */
          padding: 10px 20px;
          border: none;
          cursor: pointer;
          /* stylelint-disable-next-line order/properties-order */
          border-radius: 20px; /* 設定按鈕邊緣為圓形 */
        "
      >
        查詢callback（PROD）
      </button>
      <input
        v-model="postDataValue3"
        placeholder="channelId"
        style="margin-left: 5px; padding: 10px"
      />
      OR
      <input
        v-model="postDataValue14"
        placeholder="agentCode"
        style="margin-left: 5px; padding: 10px"
      />
      <div v-if="postResponse3" class="top-text">{{ postResponse3 }}</div>
    </div>
    <div style="height: 80px">
      <button
        @click="postData7"
        style="
          font-weight: bold;
          /* stylelint-disable-next-line order/properties-order */
          background-color: #51d4eb;
          color: black;
          /* stylelint-disable-next-line order/properties-order */
          padding: 10px 20px;
          border: none;
          cursor: pointer;
          /* stylelint-disable-next-line order/properties-order */
          border-radius: 20px; /* 設定按鈕邊緣為圓形 */
        "
      >
        更新callback（PROD）
      </button>
      <input
        v-model="postDataValue15"
        placeholder="channelId"
        style="margin-left: 5px; padding: 10px"
      />
      <input
        v-model="postDataValue16"
        placeholder="operatorCode"
        style="margin-left: 5px; padding: 10px"
      />
      <input
        v-model="postDataValue17"
        placeholder="callbackUrl"
        style="margin-left: 5px; padding: 10px; width: 450px"
      />
      <div v-if="postResponse6" class="top-text">{{ postResponse6 }}</div>
    </div>
    <div style="height: 80px">
      <button
        @click="postData8"
        style="
          font-weight: bold;
          /* stylelint-disable-next-line order/properties-order */
          background-color: #7eec70;
          color: black;
          /* stylelint-disable-next-line order/properties-order */
          padding: 10px 20px;
          border: none;
          cursor: pointer;
          /* stylelint-disable-next-line order/properties-order */
          border-radius: 20px; /* 設定按鈕邊緣為圓形 */
        "
      >
        查詢callback（UAT）
      </button>
      <input
        v-model="postDataValue18"
        placeholder="channelId"
        style="margin-left: 5px; padding: 10px"
      />
      OR
      <input
        v-model="postDataValue19"
        placeholder="agentCode"
        style="margin-left: 5px; padding: 10px"
      />
      <div v-if="postResponse7" class="top-text">{{ postResponse7 }}</div>
    </div>
    <div style="height: 80px">
      <button
        @click="postData9"
        style="
          font-weight: bold;
          /* stylelint-disable-next-line order/properties-order */
          background-color: #7eec70;
          color: black;
          /* stylelint-disable-next-line order/properties-order */
          padding: 10px 20px;
          border: none;
          cursor: pointer;
          /* stylelint-disable-next-line order/properties-order */
          border-radius: 20px; /* 設定按鈕邊緣為圓形 */
        "
      >
        更新callback（UAT）
      </button>
      <input
        v-model="postDataValue20"
        placeholder="channelId"
        style="margin-left: 5px; padding: 10px"
      />
      <input
        v-model="postDataValue21"
        placeholder="operatorCode"
        style="margin-left: 5px; padding: 10px"
      />
      <input
        v-model="postDataValue22"
        placeholder="callbackUrl"
        style="margin-left: 5px; padding: 10px; width: 450px"
      />
      <div v-if="postResponse8" class="top-text">{{ postResponse8 }}</div>
    </div>
    <div class="output-text">
      <div><H2>解析資料：</H2></div>
      <table>
        <tbody>
          <tr v-for="(value, key) in parsedPostResponsedata" :key="key">
            <td style="width: 120px">{{ key }} :</td>
            <td>{{ value }}</td>
            <!-- 在這裡新增更多資料列 -->
          </tr>
        </tbody>
      </table>
    </div>
    <div class="output-text">
      <textarea v-model="postResponseText" readonly></textarea>
    </div>
  </div>
</template>

<script setup>
import md5 from "md5";
import axios from "axios";
import { ref } from "vue";

const postResponse1 = ref("");
const postDataValue1 = ref("");
const postResponse2 = ref("");
const postDataValue2 = ref("");
const postResponse3 = ref("");
const postResponse4 = ref("");
const postResponse5 = ref("");
const postResponse6 = ref("");
const postResponse7 = ref("");
const postResponse8 = ref("");
const postDataValue3 = ref("");
const postDataValue4 = ref("");
const postDataValue5 = ref("");
const postDataValue6 = ref("");
const postDataValue7 = ref("");
const postDataValue8 = ref("");
const postDataValue9 = ref("");
const postDataValue10 = ref("");
const postDataValue11 = ref("");
const postDataValue12 = ref("");
const postDataValue13 = ref("");
const postDataValue14 = ref("");
const postDataValue15 = ref("");
const postDataValue16 = ref("");
const postDataValue17 = ref("");
const postDataValue18 = ref("");
const postDataValue19 = ref("");
const postDataValue20 = ref("");
const postDataValue21 = ref("");
const postDataValue22 = ref("");
const parsedPostResponsedata = ref(); // 將data欄位的資料轉換為鍵值對對象
const postResponseText = ref(""); //將資料放到Text

//取得代理資料3.0(PROD)
const postData1 = async () => {
  if (!postDataValue1.value && !postDataValue4.value) {
    postResponse1.value = "請輸入agentCode或是channelId!!";
    return; //如果輸入框為空，返回提醒
  }
  try {
    postResponse1.value = "請求中";
    const response = await axios.post(
      "https://nc-ugs-supapi.wehosts247.com/supapipb.SupApiService/TaskGetAgentInfo",
      {
        agentCode: postDataValue1.value,
        channelId: postDataValue4.value,
      },
      {
        headers: {
          "SUPAPI-SECRET": "86Wn8vmxZFDFI3YWEjXOKP4pPmEHwhj4",
        },
      }
    );
    postResponseText.value = JSON.stringify(response.data, null, 2);
    parsedPostResponsedata.value = response.data.data; // 將data欄位的資料轉換為鍵值對對象
  } catch (error) {
    postResponseText.value = error.response.data;
    parsedPostResponsedata.value = error.response.data;
  } finally {
    postResponse1.value = "請求完成";
  }
};

//取得代理資料3.0(UAT)
const postData2 = async () => {
  if (!postDataValue2.value && !postDataValue5.value) {
    postResponse2.value = "請輸入agentCode或是channelId!!";
    return; //如果輸入框為空，返回提醒
  }
  try {
    postResponse2.value = "請求中";
    const response = await axios.post(
      "https://uat-weg-ugs-supapi.wehosts247.com/supapipb.SupApiService/TaskGetAgentInfo",
      {
        agentCode: postDataValue2.value,
        channelId: postDataValue5.value,
      },
      {
        headers: {
          "SUPAPI-SECRET": "86Wn8vmxZFDFI3YWEjXOKP4pPmEHwhj4",
        },
      }
    );
    postResponseText.value = JSON.stringify(response.data, null, 2);
    parsedPostResponsedata.value = response.data.data; // 將data欄位的資料轉換為鍵值對對象
  } catch (error) {
    postResponseText.value = error.response.data;
    parsedPostResponsedata.value = error.response.data;
  } finally {
    postResponse2.value = "請求完成";
  }
};

//查詢callback (PROD)
const postData3 = async () => {
  if (!postDataValue3.value && !postDataValue14.value) {
    postResponse3.value = "請輸入agentCode或是channelId!!";
    return; //如果輸入框為空，返回提醒
  }
  try {
    postResponse3.value = "請求中";
    const response = await axios.post(
      "https://nc-ugs-supapi.wehosts247.com/supapipb.SupApiService/TaskGetOperatorCallBack",
      {
        channelId: postDataValue3.value,
        agentCode: postDataValue14.value,
      },
      {
        headers: {
          "SUPAPI-SECRET": "86Wn8vmxZFDFI3YWEjXOKP4pPmEHwhj4",
        },
      }
    );
    postResponseText.value = JSON.stringify(response.data, null, 2);
    parsedPostResponsedata.value = Object.entries(response.data.data); // 將data欄位的資料轉換為鍵值對對象
  } catch (error) {
    postResponseText.value = error.response;
    parsedPostResponsedata.value = error.response;
  } finally {
    postResponse3.value = "請求完成";
  }
};

//更新callback (PROD)
const postData7 = async () => {
  if (!postDataValue15.value || !postDataValue16.value || !postDataValue17.value) {
    postResponse6.value = "請輸入完整資訊!!";
    return; //如果輸入框為空，返回提醒
  }
  try {
    postResponse6.value = "請求中";
    const response = await axios.post(
      "https://nc-ugs-supapi.wehosts247.com/supapipb.SupApiService/TaskUpdateOperatorCallBack",
      {
        channelId: postDataValue15.value,
        operatorCode: postDataValue16.value,
        callbackUrl: postDataValue17.value,
      },
      {
        headers: {
          "SUPAPI-SECRET": "86Wn8vmxZFDFI3YWEjXOKP4pPmEHwhj4",
        },
      }
    );
    postResponseText.value = JSON.stringify(response.data, null, 2);
    parsedPostResponsedata.value = Object.entries(response.data); // 將data欄位的資料轉換為鍵值對對象
  } catch (error) {
    postResponseText.value = error.response;
    parsedPostResponsedata.value = error.response;
  } finally {
    postResponse6.value = "請求完成";
  }
};

//查詢callback (UAT)
const postData8 = async () => {
  if (!postDataValue18.value && !postDataValue19.value) {
    postResponse7.value = "請輸入agentCode或是channelId!!";
    return; //如果輸入框為空，返回提醒
  }
  try {
    postResponse7.value = "請求中";
    const response = await axios.post(
      "https://uat-weg-ugs-supapi.wehosts247.com/supapipb.SupApiService/TaskGetOperatorCallBack",
      {
        channelId: postDataValue18.value,
        agentCode: postDataValue19.value,
      },
      {
        headers: {
          "SUPAPI-SECRET": "86Wn8vmxZFDFI3YWEjXOKP4pPmEHwhj4",
        },
      }
    );
    postResponseText.value = JSON.stringify(response.data, null, 2);
    parsedPostResponsedata.value = Object.entries(response.data.data); // 將data欄位的資料轉換為鍵值對對象
  } catch (error) {
    postResponseText.value = error.response;
    parsedPostResponsedata.value = error.response;
  } finally {
    postResponse7.value = "請求完成";
  }
};

//更新callback (UAT)
const postData9 = async () => {
  if (!postDataValue20.value || !postDataValue21.value || !postDataValue22.value) {
    postResponse8.value = "請輸入完整資訊!!";
    return; //如果輸入框為空，返回提醒
  }
  try {
    postResponse8.value = "請求中";
    const response = await axios.post(
      "https://uat-weg-ugs-supapi.wehosts247.com/supapipb.SupApiService/TaskUpdateOperatorCallBack",
      {
        channelId: postDataValue20.value,
        operatorCode: postDataValue21.value,
        callbackUrl: postDataValue22.value,
      },
      {
        headers: {
          "SUPAPI-SECRET": "86Wn8vmxZFDFI3YWEjXOKP4pPmEHwhj4",
        },
      }
    );
    postResponseText.value = JSON.stringify(response.data, null, 2);
    parsedPostResponsedata.value = Object.entries(response.data); // 將data欄位的資料轉換為鍵值對對象
  } catch (error) {
    postResponseText.value = error.response;
    parsedPostResponsedata.value = error.response;
  } finally {
    postResponse8.value = "請求完成";
  }
};

//啟動遊戲
const postData4 = async () => {
  try {
    const appSecret = "-LnheqBW_HRuxAxzTTb915gZbX-UYvDwlRPBD323yCo=";
    const operatorID = "ace123456-1986mg";
    const playerID = "ace666";
    const requestTime = Math.floor(Date.now() / 1000).toString(); // 使用當前時間的時間戳(除1000)
    const signaturestring = appSecret + operatorID + playerID + requestTime; //簽名組成字串
    const signature = md5(signaturestring).toString(); //MD5

    console.log("appSecret:", appSecret);
    console.log("operatorID:", operatorID);
    console.log("playerID:", playerID);
    console.log("requestTime:", requestTime);
    console.log("signaturestring:", signaturestring);
    console.log("signature(MD5):", signature);

    const params = new URLSearchParams();
    params.append("appSecret", appSecret);
    params.append("operatorID", operatorID);
    params.append("playerID", playerID);
    params.append("requestTime", requestTime);

    const response = await axios.post(
      "https://uat-nc-ugs-weop.ufweg.com/player/login",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          signature: signature,
        },
      }
    );

    postResponseText.value = JSON.stringify(response.data, null, 2);
    parsedPostResponsedata.value = response.data; // 將解析後的資料保存在parsedPostResponsedata中
    console.log("URL:", parsedPostResponsedata.value.url);
    // 對回應數據進行其他處理
  } catch (error) {
    console.error("POST 請求出錯：", error);
  }
  const link = parsedPostResponsedata.value.url; //API 返回的連結在 parsedPostResponsedata 的 value.url 屬性中

  // 使用 window.open 跳轉到連結
  window.open(link, "_blank"); // 在新標籤中打開連結
};

//取消牌局(PROD)
const postData5 = async () => {
  if (
    !postDataValue6.value ||
    !postDataValue7.value ||
    !postDataValue8.value ||
    !postDataValue9.value
  ) {
    postResponse4.value = "請輸入完整資訊!!";
    return; //如果輸入框為空，返回提醒
  }

  // 将输入的值分割成数组（假设输入的值用逗号分隔）
  const operators = postDataValue6.value.split(",");
  const appSecrets = postDataValue7.value.split(",");
  const players = postDataValue8.value.split(",");
  const bets = postDataValue9.value.split(",");

  try {
    postResponse4.value = "請求中";

    // 用于保存所有请求的响应结果
    const responses = [];

    // 遍历输入的值，为每组参数发送请求
    for (let i = 0; i < operators.length; i++) {
      const response = await axios.post(
        "https://nc-ugs-wegoapi.wehosts247.com/wego/rollback",
        {
          OperatorID: operators[i],
          AppSecret: appSecrets[i],
          PlayerID: players[i],
          BetID: bets[i],
          Type: "cancel",
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      // 将当前请求的响应添加到数组中
      responses.push(response.data);
    }
    postResponseText.value = JSON.stringify(responses, null, 2);
  } catch (error) {
    postResponseText.value = error.response.data;
    parsedPostResponsedata.value = error.response.data;
  } finally {
    postResponse4.value = "請求完成";
  }
};

//取消牌局(UAT)
const postData6 = async () => {
  if (
    !postDataValue10.value ||
    !postDataValue11.value ||
    !postDataValue12.value ||
    !postDataValue13.value
  ) {
    postResponse5.value = "請輸入完整資訊!!";
    return; //如果輸入框為空，返回提醒
  }
  try {
    postResponse5.value = "請求中";
    const response = await axios.post(
      "https://uat-weg-ugs-wegoapi.bpweg.com/wego/rollback",
      {
        OperatorID: postDataValue10.value,
        AppSecret: postDataValue11.value,
        PlayerID: postDataValue12.value,
        BetID: postDataValue13.value,
        Type: "cancel",
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    postResponseText.value = JSON.stringify(response.data, null, 2);
    parsedPostResponsedata.value = response.data;
  } catch (error) {
    postResponseText.value = error.response.data;
    parsedPostResponsedata.value = error.response.data;
  } finally {
    postResponse5.value = "請求完成";
  }
};
</script>

<style scoped>
.content {
  padding: 20px;
}

.output-text {
  font-size: 18px;
  /* stylelint-disable-next-line order/properties-order */
  margin-top: 10px;
  /* stylelint-disable-next-line color-function-notation */
  color: rgb(77, 60, 6);
}

.top-text {
  font-size: 18px;
  /* stylelint-disable-next-line order/properties-order */
  margin-top: 10px;
  /* stylelint-disable-next-line color-function-notation */
  color: rgb(80, 28, 4);
}

/* stylelint-disable-next-line rule-empty-line-before */
textarea {
  width: 80%;
  height: 200px;
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #440f0f;
  border-radius: 5px;
  resize: both; /* 允許垂直拉伸 */
}
</style>
