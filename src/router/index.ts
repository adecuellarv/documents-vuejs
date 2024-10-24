import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginPage from '../views/LoginView.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginPage
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true }
  }
];

const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop()?.split(';').shift();
    }
    return undefined;
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// Route guard
router.beforeEach((to, from, next) => {
  const token = getCookie('token');

  if (token && to.name === 'login') {
    console.log('Redirigiendo a home');
    next({ name: 'home' });
  }

  else if (!token && to.meta.requiresAuth) {
    console.log('Redirigiendo a login');
    next({ name: 'login' });
  }

  else {
    next();
  }
});


export default router;
