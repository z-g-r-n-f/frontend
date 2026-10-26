<template>


<div class="register-page">


<div class="background-circle circle1"></div>

<div class="background-circle circle2"></div>


<!-- 右上角语言切换 -->
<div class="lang-corner">

<LangSwitch/>

</div>


<div class="register-card">


<h1>

{{ $t("register.title") }}

</h1>


<p>

{{ $t("register.subtitle") }}

</p>


<el-input

v-model="form.username"

:placeholder="$t('register.username')"

/>


<el-input

v-model="form.password"

type="password"

show-password

:placeholder="$t('register.password')"

/>


<el-input

v-model="confirmPassword"

type="password"

show-password

:placeholder="$t('register.confirmPassword')"

:status="passwordMismatch ? 'error' : ''"

/>


<div class="password-error" v-if="passwordMismatch">

{{ $t("register.mismatch") }}

</div>


<el-input

v-model="form.email"

:placeholder="$t('register.email')"

/>


<el-button

type="primary"

@click="submit"

>

{{ $t("register.submit") }}

</el-button>



<div class="to-login">

{{ $t("register.hasAccount") }}

<span @click="$router.push('/login')">

{{ $t("register.toLogin") }}

</span>


</div>



</div>


</div>

</template>




<script setup>


import {reactive, ref, computed} from "vue"

import {useI18n} from "vue-i18n"


import {register}
from "../api/user"

import LangSwitch from "../components/LangSwitch.vue"


const {t}=useI18n()


const form=reactive({

username:"",

password:"",

email:""

})


// 确认密码栏（只在前端校验用，不发给后端）
const confirmPassword=ref("")


// 实时判断两次密码是否不一致
const passwordMismatch=computed(()=>{

return confirmPassword.value!=="" && confirmPassword.value!==form.password

})



async function submit(){


// 检查两次密码是否一致
if(form.password!==confirmPassword.value){

alert(t("register.mismatchAlert"))

return

}


// 后端接口需要 name 参数，这里用用户名代替
await register({

...form,

name:form.username

})


alert(t("register.success"))

}



</script>



<style scoped>


.register-page{


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



.register-card{


width:380px;


padding:45px;


background:

rgba(255,255,255,.9);


border-radius:30px;


box-shadow:

0 20px 50px rgba(0,0,0,.2);


}



.register-card h1{


text-align:center;

margin:0 0 8px;

}


.register-card p{


text-align:center;

color:#666;

margin:0 0 10px;

font-size:14px;

}


.register-card .el-input{


margin:15px 0;


}



.el-button{


width:100%;

height:45px;

border-radius:20px;

margin-top:10px;


}



.to-login{


text-align:center;

margin-top:20px;

color:#666;


}



.to-login span{


color:#409eff;

cursor:pointer;



}



.to-login span:hover{


text-decoration:underline;

}



.password-error{


color:#f56c6c;

font-size:12px;

margin-top:-8px;

margin-bottom:8px;

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
