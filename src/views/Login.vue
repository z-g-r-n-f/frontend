<template>


<div class="login-page">


<div class="background-circle circle1"></div>

<div class="background-circle circle2"></div>


<!-- 右上角语言切换 -->
<div class="lang-corner">

<LangSwitch/>

</div>



<div class="brand">


<h1>

{{ $t("app.name") }}

</h1>


<h2>

{{ $t("app.subtitle") }}

</h2>


<p>

{{ $t("app.slogan") }}

</p>


</div>



<div class="login-card">


<h1>

{{ $t("login.title") }}

</h1>


<p>

{{ $t("login.subtitle") }}

</p>



<el-input

v-model="form.username"

:placeholder="$t('login.username')"

/>


<el-input

v-model="form.password"

type="password"

show-password

:placeholder="$t('login.password')"

/>



<el-button

type="primary"

@click="submit"

>

{{ $t("login.submit") }}

</el-button>



<div class="register">

{{ $t("login.noAccount") }}

<span @click="$router.push('/register')">

{{ $t("login.toRegister") }}

</span>


</div>



</div>


</div>
</template>



<script setup>


import {reactive} from "vue"


import {login}
from "../api/user"

import router from "../router"

import LangSwitch from "../components/LangSwitch.vue"


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



.lang-corner{


position:absolute;

top:30px;

right:40px;

z-index:10;


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
