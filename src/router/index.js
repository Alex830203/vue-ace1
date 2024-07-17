import { createRouter, createWebHistory } from 'vue-router';
import Homepage from '../components/Homepage.vue';
import Currency_conversionpage from '../components/Currency_conversionpage.vue';
import APIpage from '../components/APIpage.vue';
import Crossbetpage from '../components/Crossbetpage.vue';
import Suspiciousplayerpage from '../components/Suspiciousplayerpage.vue';
import TGBOTpage from '../components/TGBOTpage.vue';
import Playroadpage from '../components/Playroadpage.vue';
import Newspage from '../components/Newspage.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: Homepage,
  },  
  {
    path: '/currency_conversion',
    name: 'currency_conversion',
    component: Currency_conversionpage,
    props: (route) => ({ token: route.query.token }),
    meta: { requiresAuth: true } // 添加 requiresAuth 元信息
  },  
  {
    path: '/api',
    name: 'api',
    component: APIpage,
    props: (route) => ({ token: route.query.token }),
    meta: { requiresAuth: true } // 添加 requiresAuth 元信息
  },  
  {
    path: '/tgbot',
    name: 'tgbot',
    component: TGBOTpage,
    props: (route) => ({ token: route.query.token }),
    meta: { requiresAuth: true } // 添加 requiresAuth 元信息

  },
  {
    path: '/playroad',
    name: 'playroad',
    component: Playroadpage,
    props: (route) => ({ token: route.query.token }),
    meta: { requiresAuth: true } // 添加 requiresAuth 元信息
  },
  {
    path: '/crossbet',
    name: 'crossbet',
    component: Crossbetpage,
    props: (route) => ({ token: route.query.token }),
    meta: { requiresAuth: true } // 添加 requiresAuth 元信息
  },
  {
    path: '/suspiciousplayer',
    name: 'suspiciousplayer',
    component: Suspiciousplayerpage,
    props: (route) => ({ token: route.query.token }),
    meta: { requiresAuth: true } // 添加 requiresAuth 元信息
  },
  {
    path: '/news',
    name: 'news',
    component: Newspage,
    props: (route) => ({ token: route.query.token }),
    meta: { requiresAuth: true } // 添加 requiresAuth 元信息
  },
  // other routes
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 添加導航守衛
router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 如果路由需要驗證
    if (!isLoggedIn) {
      // 如果未登入，導向登入頁面
      next({ name: 'home' });
    } else {
      // 如果已登入，繼續
      next();
    }
  } else {
    // 如果路由不需要驗證，繼續
    next();
  }
});

export default router;
