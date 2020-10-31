import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './components/login.vue'
import Home from './components/home/home.vue'

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
    { path: '/home', component: Home }
]

const router = new VueRouter({
    routes
})
// 路由导航守卫，如果没有token值，说明没有登录，那么跳转到登录页
router.beforeEach((to, from, next) => {
    console.log('to, from', to, from);
    if(to.path !== '/login' && !window.sessionStorage.getItem('token')){
        return next('/login')
    }
    next()
})
export default router
