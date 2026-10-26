<template>


<div class="lang-switch">


<span

v-for="item in languages"

:key="item.key"

:class="{active:locale===item.key}"

@click="change(item.key)"

>

{{item.label}}

</span>


</div>


</template>



<script setup>


import {useI18n} from "vue-i18n"

import {languages} from "../i18n"


const {locale}=useI18n()


function change(key){

locale.value=key

localStorage.setItem("lang", key)

}



</script>



<style scoped>


.lang-switch{


display:inline-flex;

align-items:center;

gap:4px;


background:rgba(255,255,255,.85);

border-radius:20px;

padding:4px;


box-shadow:0 4px 15px rgba(0,0,0,.12);


backdrop-filter:blur(6px);


}



.lang-switch span{


font-size:13px;

padding:4px 10px;

border-radius:16px;

cursor:pointer;

color:#555;

white-space:nowrap;

transition:.2s;


}



.lang-switch span:hover{


color:#409eff;


}



.lang-switch span.active{


background:linear-gradient(135deg,#667eea,#764ba2);

color:white;

font-weight:bold;


}



</style>
