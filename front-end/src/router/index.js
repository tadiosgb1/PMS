import { createRouter, createWebHistory } from "vue-router";
import Home from '../views/opened/landing/Home.vue'
import Login from '../views/opened/auth/login.vue'
import ResetPassword from '../views/opened/auth/ResetPassword.vue'
import ForgotPasssword from '../views/opened/auth/forgotPassword.vue'

import Registration from '../views/opened/auth/login.vue'
import ForgotPassword from '../views/opened/auth/forgotPassword.vue';
import Reset from '../views/opened/auth/reset.vue';
import AccessDenied from "../views/opened/auth/accessDenied.vue";
import first_dash from '../views/closed/first_dash.vue'
import dashboard from '../views/closed/dashboard.vue'
import Properties from '../views/closed/proporty/view.vue';
import PropertyDetail from '../views/closed/proporty/PropertyDetail.vue'
import rentPay from '../views/closed/rent/view.vue'
import PropertyZoneDetail from '../views/closed/Zones/propertyZoneDetail.vue';

import PropertyZone from '../views/closed/Zones/view.vue';
import PropertyPicture from '../views/closed/proportyPicture/view.vue';

import Payments from '../views/closed/payments/view.vue';
const Maintenance = { template: '<div class="p-6 text-gray-800">Maintenance Page</div>' };
const Leases = { template: '<div class="p-6 text-gray-800">Leases Page</div>' };
const Messages = { template: '<div class="p-6 text-gray-800">Messages Page</div>' };
const Settings = { template: '<div class="p-6 text-gray-800">Settings Page</div>' };

import Rents from '../views/closed/rent/view.vue';
import RentDetail from '../views/closed/rent/rentDetail.vue';

import MaintenanceRequests from '../views/closed/maintenanceRequests/view1.vue';

import User_view from '../views/closed/users/view.vue';

import User_add from '../views/closed/users/add.vue';
import UserEdit from '../views/closed/users/edit.vue';
import UserDetail from '../views/closed/users/detail.vue';
import Tenants from '../views/closed/tenant/view.vue';
import Permissions_add from '../views/closed/permissions/add.vue';
import permissions_view from '../views/closed/permissions/view.vue';
import plans_view from '../views/closed/plans/view.vue';
import subscriptions_view from '../views/closed/subscriptions/view.vue'
import subscriptionsPayment_view from '../views/closed/subscriptions/SubscriptionPayment/view.vue'
import view_groups from '../views/closed/groups/view.vue'
import view_managers from '../views/closed/managers/view.vue'
import view_owners from '../views/closed/owners/view.vue'
import Property_sales from '../views/closed/PropertySales/view.vue'
import Sales_Payments from '../views/closed/SalesPayment/view.vue'
import Rent_Payments from '../views/closed/rent/RentPayments.vue'
import staffs from '../views/closed/stafs/view.vue'
import Notifications from '../views/closed/notifications/view.vue'
import notificationDetail from '../views/closed/notifications/notificationDeatil.vue'
import Reports from '../views/closed/report/view.vue'
import CowrkingSpaces from '../views/closed/coworkingSpace/view.vue'
import CowrkingSpaceRental from '../views/closed/workspaceRental/view.vue'
import saleCommissions from '../views/closed/saleCommissions/view.vue'
import rentCommissions from '../views/closed/rentCommissions/view.vue'
import Transactions from '../views/closed/transactions/transactions_view.vue'

import Configurations from '../views/closed/Configurations/view.vue'
import CoworkspacePayments from '../views/closed/workspacePayment/view.vue'
import brokers from '../views/closed/brokers/view.vue'
import brokerDetail from '../views/closed/brokers/brokerDetail.vue'


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

  // router/index.js
   {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPasssword,
    props: true
  },
    {
      path: "/:lang/reset-password",
      name: "ResetPassword",
      component: ResetPassword,
      props: true, // passes route params as props
    },

  ,
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
      {
        path: '/rent-detail/:id',   // Route param :id
        name: 'rent-detail',
        component: RentDetail,
        props: true,              // optional: allows you to receive `id` as a prop
      },
      { path: '/properties', name: 'properties', component: Properties },

      { path: 'properties/:id', name: 'PropertyDetail', component: PropertyDetail, props: true },
      
      { path: '/zones/:id', name: 'zoneDetail', component: PropertyZoneDetail, props: true },

      { path: 'properties/rentPay/:id', name: 'rentPay', component: rentPay, props: true },
      { path: '/zones', name: 'zones', component: PropertyZone },
      { path: '/pictures', name: 'pictures', component: PropertyPicture },
      { path: '/tenants', name: 'tenants', component: Tenants },
      { path: '/payments', name: 'payments', component: Payments },
      { path: '/maintenance', name: 'maintenance', component: Maintenance },
      { path: '/leases', name: 'leases', component: Leases },
      { path: '/reports', name: 'reports', component: Reports },
      { path: '/messages', name: 'messages', component: Messages },
      { path: '/settings', name: 'settings', component: Settings },
      { path: '/notifications', name: 'notifications', component: Notifications },
      { path: 'notification/:id', name: 'notificationDetail', component: notificationDetail },
      { path: '/sale-commissions', name: 'sale-commissions', component:saleCommissions },
      { path: '/rent-commissions', name: 'rent-commissions', component:rentCommissions },
      
    { path: '/transactions', name: 'transactions', component:Transactions },
      
      { path: '/configurations', name: 'configurations', component:Configurations },
      { path: '/rents', name: 'rents', component: Rents },
      { path: '/property_sales', name: 'property_sales', component: Property_sales },
      { path: '/sales_payments', name: 'sales_payments', component: Sales_Payments },
      { path: '/rents_payments', name: 'rents_payments', component: Rent_Payments },
      { path: '/rents_payments/:id',name: 'rents_payment_detail',component: Rent_Payments,props: true, // optional, so you can use props instead of $route.params.id
  },
      { path: '/maintenance-requests', name: 'maintenance-requests', component: MaintenanceRequests },
      { path: '/user_view', name: 'user_view', component: User_view },
      { path: '/coworking-spaces', name: 'coworking-spaces', component: CowrkingSpaces },
      { path: '/coworking-space-rentals', name: 'coworking-space-rentals', component:CowrkingSpaceRental },
      { path: '/coworking-payments', name: 'coworking-payments', component:CoworkspacePayments },
      { path: '/coworking-payments/:id', name: 'coworking-payments-detail', component:CoworkspacePayments, props:true },
      { path: '/user_add', name: 'user_add', component: User_add },

      {
        path: "/user_edit/:id",
        name: "UserEdit",
        component: UserEdit,
        props: true,
      },
      {
        path: "/user_detail/:id",
        name: "UserDetail",
        component: UserDetail,
        props: true, // Pass :id as a prop
      },
      { path: '/permission_add', name: 'permission_add', component: Permissions_add },
      { path: '/permissions_view', name: 'permissions_view', component: permissions_view },
      { path: '/plans_view', name: 'plans_view', component: plans_view },
      { path: '/subscriptions_view', name: 'subscriptions_view', component: subscriptions_view },
      { path: '/subscriptions_view/payment/:id', name: 'subscriptionsPayment_view', component: subscriptionsPayment_view },
      { path: '/groups', name: 'groups', component: view_groups },
      { path: '/managers', name: 'managers', component: view_managers },
      { path: '/owners', name: 'owners', component: view_owners },
      { path: '/staffs', name: 'staffs', component: staffs },
       { path: '/brokers', name: 'brokers', component: brokers },
       { path: '/brokerDetail/:id', name: 'brokerDetail', component: brokerDetail, props:true },
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
