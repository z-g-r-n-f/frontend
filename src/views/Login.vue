<template>


<div class="login-page">


<div class="background-circle circle1"></div>

<div class="background-circle circle2"></div>



<div class="brand">


<h1>
DeviceLife
</h1>


<h2>
个人电子设备生命周期管理系统
</h2>


<p>
Manage your digital assets intelligently
</p>


</div>



<div class="login-card">


<h1>
欢迎回来
</h1>


<p>
登录你的设备空间
</p>



<el-input

v-model="form.username"

placeholder="用户名"

/>


<el-input

v-model="form.password"

type="password"

placeholder="密码"

/>



<el-button

type="primary"

@click="submit"

>

登录

</el-button>



<div class="register">

没有账号？

<span @click="$router.push('/register')">

立即注册

</span>


</div>



</div>


</div>

</template>



<script setup>


import {
reactive
} from "vue"


import {
login
} from "../api/user"


import router from "../router"



const form=reactive({

username:"",

password:""

})



async function submit(){


let data=await login(form)


localStorage.setItem(
"userId",
data.userId
)


localStorage.setItem(
"username",
data.username
)


router.push("/dashboard")


}


</script>



<style scoped>


.login-page{


height:100vh;

display:flex;

align-items:center;

justify-content:center;


background:

linear-gradient(
135deg,
#667eea,
#764ba2
);


position:relative;


overflow:hidden;


}



.brand{


color:white;

margin-right:120px;


}



.brand h1{


font-size:60px;


}



.brand h2{


font-size:28px;


}



.login-card{


width:380px;


padding:45px;


background:

rgba(255,255,255,.9);


border-radius:30px;


box-shadow:

0 20px 50px rgba(0,0,0,.2);


}



.login-card .el-input{


margin:15px 0;


}



.el-button{


width:100%;

height:45px;

border-radius:20px;


}



.register{


text-align:center;

margin-top:20px;

color:#666;


}



.register span{


color:#409eff;

cursor:pointer;


}



.background-circle{


position:absolute;

border-radius:50%;

filter:blur(30px);

}



.circle1{


width:300px;

height:300px;

background:#fff;

opacity:.2;

top:-100px;

left:-100px;


}



.circle2{


width:400px;

height:400px;

background:#ff9;

opacity:.15;

bottom:-200px;

right:-100px;


}



</style>