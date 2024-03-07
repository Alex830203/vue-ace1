import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

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

app.use(router);
app.mount('#app');
