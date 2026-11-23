import { createRouter, createWebHistory } from "vue-router"

import Login from "../views/Login.vue"
import Register from "../views/Register.vue"
import MainLayout from "../layout/MainLayout.vue"
import Dashboard from "../views/Dashboard.vue"
import DeviceList from "../views/DeviceList.vue"
import DeviceAdd from "../views/DeviceAdd.vue"
import DeviceDetail from "../views/DeviceDetail.vue"
import DeviceEdit from "../views/DeviceEdit.vue"
import UserCenter from "../views/UserCenter.vue"
import { isAuthenticated } from "../utils/session"

const routes = [
    { path: "/", redirect: "/login" },
    { path: "/login", name: "login", component: Login, meta: { public: true, title: "login.title" } },
    { path: "/register", name: "register", component: Register, meta: { public: true, title: "register.title" } },

    {
        path: "/",
        component: MainLayout,
        meta: { requiresAuth: true },
        children: [
            {
                path: "dashboard",
                name: "dashboard",
                component: Dashboard,
                meta: { requiresAuth: true, title: "menu.home" }
            },
            {
                path: "devices",
                name: "devices",
                component: DeviceList,
                meta: { requiresAuth: true, title: "device.listTitle" }
            },
            {
                path: "devices/new",
                name: "device-add",
                component: DeviceAdd,
                meta: { requiresAuth: true, title: "device.addTitle" }
            },
            {
                path: "devices/:id",
                name: "device-detail",
                component: DeviceDetail,
                meta: { requiresAuth: true, title: "device.detailTitle" }
            },
            {
                path: "devices/:id/edit",
                name: "device-edit",
                component: DeviceEdit,
                meta: { requiresAuth: true, title: "device.editTitle" }
            },
            {
                path: "profile",
                name: "profile",
                component: UserCenter,
                meta: { requiresAuth: true, title: "profile.title" }
            },

            // 兼容旧代码里的错误跳转地址
            { path: "device/add", redirect: "/devices/new" },
            { path: "add", redirect: "/devices/new" }
        ]
    },

    { path: "/:pathMatch(.*)*", redirect: "/dashboard" }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior: () => ({ top: 0 })
})

router.beforeEach(to => {
    const loggedIn = isAuthenticated()

    if (to.meta.requiresAuth && !loggedIn) {
        return { path: "/login", query: { redirect: to.fullPath } }
    }

    if (to.meta.public && loggedIn) {
        return { path: "/dashboard" }
    }

    document.title = "DeviceLife"
    return true
})

export default router
