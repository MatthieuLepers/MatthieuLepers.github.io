import { createWebHistory, createRouter } from 'vue-router';

import HomePage from '@/views/HomePage/index.vue';

const routes = [
  { path: '/', name: 'Home', component: HomePage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
