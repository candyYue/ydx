import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        { path: '/', redirect: '/login' },
        { //登录
            path: '/login',
            component: resolve => require(['@/pages/Login.vue'], resolve),
            children: [{
                path: '/',
                component: resolve => require(['@/components/login/tel.vue'], resolve), 
            },
            {
                path: '/company',
                component: resolve => require(['@/components/login/company.vue'], resolve), 
            },
            {
                path: '/findpassword',
                component: resolve => require(['@/components/login/findpassword.vue'], resolve), 
            },
            {
                path: '/password',
                component: resolve => require(['@/components/login/password.vue'], resolve) 
            }]
        },
        { //引导页
            path: '/bootpage',
            component: resolve => require(['@/pages/Lead.vue'], resolve),
        },
        {
            path: '/Home', //统计中心 头部+侧边栏
            component: resolve => require(['@/components/Home.vue'], resolve),
            children: [{ // 统计概况
                    path: '/summary',
                    component: resolve => require(['@/pages/Summary.vue'], resolve),
                },
                { // 坐席统计
                    path: '/count',
                    component: resolve => require(['@/pages/Count.vue'], resolve)
                },
                { //线索池
                    path: '/link',
                    component: resolve => require(['@/pages/link.vue'], resolve),
                    children: [{
                            path: '/',
                            component: resolve => require(['@/components/link/linkers.vue'], resolve), // 默认线索池组件
                        },
                        {
                            path: '/phoneresult',
                            component: resolve => require(['@/components/link/phoneresult.vue'], resolve) // 通话结果管理组件
                        }]
                },
                { // 坐席管理
                    path: '/manage',
                    component: resolve => require(['@/pages/Manage.vue'], resolve)
                },
                { // 通话记录
                    path: '/callhistory',
                    component: resolve => require(['@/pages/Callhistory.vue'], resolve)
                }
            ]
        }
    ]
})