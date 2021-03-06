import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './components/login.vue'
import Home from './components/home/home.vue'
import Users from './components/users/users.vue'
import Rights from './components/power/right.vue'
import Role from './components/power/role'
import Cate from './components/goods/Cate'
import Params from './components/goods/params'
import Good from './components/goods/good.vue'
import Add from './components/goods/add.vue'
import Order from './components/orders/order.vue'
import Reports from './components/reports/reports.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: Login
    },
    { 
        path: '/home', 
        component: Home,
        redirect: '/users',
        children: [
            { path: '/users', component: Users },
            { path: '/rights', component: Rights },
            { path: '/roles', component: Role },
            { path: '/categories', component: Cate },
            { path: '/params', component: Params },
            { path: '/goods', component: Good },
            { path: '/goods/add', component: Add },
            { path: '/orders', component: Order },
            { path: '/reports', component: Reports }
        ]
    },
]

const router = new VueRouter({
    routes
})
// 路由导航守卫，如果没有token值，说明没有登录，那么跳转到登录页
router.beforeEach((to, from, next) => {
    if(to.path !== '/login' && !window.sessionStorage.getItem('token')){
        return next('/login')
    }
    next()
})
export default router
