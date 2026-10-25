<template>


<div class="register-page">


<div class="background-circle circle1"></div>

<div class="background-circle circle2"></div>


<div class="register-card">


<h1>
创建账号
</h1>


<p>
开始管理你的设备空间
</p>


<el-input

v-model="form.username"

placeholder="用户名"

/>


<el-input

v-model="form.password"

type="password"

show-password

placeholder="密码"

/>


<el-input

v-model="confirmPassword"

type="password"

show-password

placeholder="确认密码"

:status="passwordMismatch ? 'error' : ''"

/>


<div class="password-error" v-if="passwordMismatch">

两次输入的密码不一致

</div>


<el-input

v-model="form.email"

placeholder="邮箱"

/>


<el-button

type="primary"

@click="submit"

>

注册

</el-button>



<div class="to-login">

已有账号？

<span @click="$router.push('/login')">

去登录

</span>


</div>



</div>


</div>

</template>




<script setup>


import {reactive, ref, computed} from "vue"


import {register}
from "../api/user"


const form=reactive({

username:"",

password:"",

email:""

})


// 确认密码栏（只在前端校验用，不发给后端）
const confirmPassword=ref("")


// 实时判断两次密码是否不一致（确认密码栏有内容且和密码不同时才提示）
const passwordMismatch=computed(()=>{

return confirmPassword.value!=="" && confirmPassword.value!==form.password

})



async function submit(){


// 检查两次密码是否一致
if(form.password!==confirmPassword.value){

alert("两次输入的密码不一致，请重新输入")

return

}


// 后端接口需要 name 参数，这里用用户名代替
await register({

...form,

name:form.username

})


alert("注册成功")

}



</script>



<style scoped>


.password-error{


color:#f56c6c;

font-size:12px;

margin-top:-8px;

margin-bottom:8px;

}


</style>



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
