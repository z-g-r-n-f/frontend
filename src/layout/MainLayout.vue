<template>


<div class="layout">


<aside>


<div class="logo">

💻 DeviceLife

</div>



<el-menu>


<el-menu-item index="1"
@click="$router.push('/dashboard')">

🏠 首页

</el-menu-item>


<el-menu-item index="2"
@click="$router.push('/devices')">

📱 我的设备

</el-menu-item>


<el-menu-item index="3"
@click="$router.push('/device/add')">

➕ 添加设备

</el-menu-item>


</el-menu>


</aside>



<main>


<header>

<div></div>


<div>

👤 {{username}}

</div>


</header>



<router-view/>


</main>



</div>


</template>



<script setup>


const username=
localStorage.getItem("username")


</script>



<style scoped>


.layout{

display:flex;

height:100vh;

background:#f5f7fb;

}



aside{

width:240px;

background:

linear-gradient(
180deg,
#1e3c72,
#2a5298
);


color:white;

padding:30px 15px;


}



.logo{

font-size:22px;

font-weight:bold;

margin-bottom:40px;

}



main{

flex:1;

padding:30px;

}



header{

height:60px;

display:flex;

justify-content:space-between;

}



</style>