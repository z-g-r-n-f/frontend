<template>


<div class="layout">


<aside>


<div class="logo">

💻 {{ $t("app.name") }}

</div>



<el-menu>


<el-menu-item index="1"
@click="$router.push('/dashboard')">

🏠 {{ $t("menu.home") }}

</el-menu-item>


<el-menu-item index="2"
@click="$router.push('/devices')">

📱 {{ $t("menu.devices") }}

</el-menu-item>


<el-menu-item index="3"
@click="$router.push('/device/add')">

➕ {{ $t("menu.addDevice") }}

</el-menu-item>


</el-menu>


</aside>



<main>


<header>


<div></div>


<div class="header-right">

<LangSwitch/>

<span class="username">

👤 {{username}}

</span>

</div>


</header>



<router-view/>


</main>



</div>

</template>



<script setup>


import LangSwitch from "../components/LangSwitch.vue"


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
align-items:center;

}



.header-right{

display:flex;
align-items:center;
gap:20px;

}



.username{

color:#333;
font-size:15px;

}



</style>
