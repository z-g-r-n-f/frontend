import {
    createRouter,
    createWebHistory
} from "vue-router"


import Login from "../views/Login.vue"

import Register from "../views/Register.vue"

import MainLayout from "../layout/MainLayout.vue"

import Dashboard from "../views/Dashboard.vue"

import DeviceList from "../views/DeviceList.vue"

import DeviceAdd from "../views/DeviceAdd.vue"



const routes=[


{
    path:"/",
    redirect:"/login"
},


{
    path:"/login",
    component:Login
},



{
    path:"/register",
    component:Register
},



//重点：Layout嵌套路由

{
    path:"/",
    component:MainLayout,

    children:[


        {
            path:"dashboard",
            component:Dashboard
        },


        {
            path:"devices",
            component:DeviceList
        },


        {
            path:"device/add",
            component:DeviceAdd
        }


    ]

}


]



const router=createRouter({

    history:createWebHistory(),

    routes

})


export default router