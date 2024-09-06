import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import Toast from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const userToken = localStorage.getItem('userToken');
const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

const app = createApp(App);

if (userToken) {
  app.config.globalProperties.$isLoggedIn = isLoggedIn;
  app.config.globalProperties.$userToken = userToken;
} else {
  app.config.globalProperties.$isLoggedIn = false;
  app.config.globalProperties.$userToken = null;
}

app.use(Toast);
app.use(router);
app.mount('#app');
