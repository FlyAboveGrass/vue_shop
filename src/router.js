import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './components/login.vue'
import Home from './components/home/home.vue'
import Users from './components/users/users.vue'
import Rights from './components/power/right.vue'
import Role from './components/power/role'

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
            { path: '/roles', component: Role }
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
