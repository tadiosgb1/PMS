import { createRouter, createWebHistory } from "vue-router";
import Home from '../views/opened/landing/Home.vue'
import Login from '../views/opened/auth/login.vue'
import Registration from '../views/opened/auth/login.vue'
import ForgotPassword from '../views/opened/auth/forgotPassword.vue';
import Reset from '../views/opened/auth/reset.vue';
import AccessDenied from "../views/opened/auth/accessDenied.vue";
import first_dash from '../views/closed/first_dash.vue'
import dashboard from '../views/closed/dashboard.vue'
import  Properties  from '../views/closed/proporty/view.vue';
import  PropertyDetail from  '../views/closed/proporty/PropertyDetail.vue'
import  PropertyZone  from '../views/closed/Zones/view.vue';
import  PropertyPicture  from '../views/closed/proportyPicture/view.vue';

const Tenants = { template: '<div class="p-6 text-gray-800">Tenants Page</div>' };
const Payments = { template: '<div class="p-6 text-gray-800">Payments Page</div>' };
const Maintenance = { template: '<div class="p-6 text-gray-800">Maintenance Page</div>' };
const Leases = { template: '<div class="p-6 text-gray-800">Leases Page</div>' };
const Reports = { template: '<div class="p-6 text-gray-800">Reports Page</div>' };
const Messages = { template: '<div class="p-6 text-gray-800">Messages Page</div>' };
const Settings = { template: '<div class="p-6 text-gray-800">Settings Page</div>' };

import User_add from '../views/closed/users/add.vue';
import Permissions_add from '../views/closed/permissions/add.vue';
import permissions_view from '../views/closed/permissions/view.vue';
import plans_view from '../views/closed/plans/view.vue';
import subscriptions_view  from '../views/closed/subscriptions/view.vue'
import view_groups from '../views/closed/groups/view.vue'

const routes = [
  {
    path: "/", name: "/",
    component: Home,
    meta:
      { requiresGuest: true }
  },

  {
    path: "/login", name: "login",
    component: Login,
    meta:
      { requiresGuest: true }
  },

  {
    path: "/register", name: "register",
    component: Registration,
    meta:
      { requiresGuest: true }
  },
  {
    path: "/dashboard", name: "dashboard",
    component: dashboard,
    meta:
      { requiresGuest: true },
    children: [
      {
        path: "first-dash", name: "first-dash",
        component: first_dash,
      },
      { path: '/properties', name: 'properties', component: Properties },
      { path: 'properties/:id', name: 'PropertyDetail', component: PropertyDetail, props: true },
      { path: '/zones', name: 'zones', component: PropertyZone },
      { path: '/pictures', name: 'pictures', component: PropertyPicture },
      { path: '/tenants', name: 'tenants', component: Tenants },
      { path: '/payments', name: 'payments', component: Payments },
      { path: '/maintenance', name: 'maintenance', component: Maintenance },
      { path: '/leases', name: 'leases', component: Leases },
      { path: '/reports', name: 'reports', component: Reports },
      { path: '/messages', name: 'messages', component: Messages },
      { path: '/settings', name: 'settings', component: Settings },
      { path: '/user_add', name: 'user_add', component: User_add },
      { path: '/permission_add', name: 'permission_add', component: Permissions_add },
      { path: '/permissions_view', name: 'permissions_view', component: permissions_view },
      { path: '/plans_view', name: 'plans_view', component: plans_view },
      { path: '/subscriptions_view', name: 'subscriptions_view', component: subscriptions_view },
      { path: '/groups', name: 'groups', component: view_groups },
    ]
  },
  { path: "/forgot-password", name: "forgotPassword", component: ForgotPassword },
  { path: "/reset/:token", name: "reset", component: Reset, meta: { requiresGuest: true } },
  { path: "/:pathMatch(.*)*", name: "accessDenied", component: AccessDenied, meta: { requiresGuest: true } },
];

const router = createRouter({
  // mode: 'hash',
  history: createWebHistory(),
  routes, // ✅ no spread needed
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest);
  const requiredRole = to.meta.role;

  if (requiresAuth) {
    if (!isAuthenticated) {
      next("/login");
    } else if (requiredRole && userRole !== requiredRole) {
      localStorage.clear();
      next("/login");
    } else {
      next();
    }
  } else if (requiresGuest) {
    next();
  } else {
    next();
  }
});

export default router;
