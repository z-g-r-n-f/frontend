<template>


<div>


<h1>

{{ $t("dashboard.greeting", {name: username}) }}

</h1>


<p class="sub">

{{ $t("dashboard.subtitle") }}

</p>



<div class="cards">


<div class="card">

<h3>
{{ $t("dashboard.deviceCount") }}
</h3>


<span>
{{devices.length}}
</span>


</div>




<div class="card">

<h3>
{{ $t("dashboard.purchaseValue") }}
</h3>


<span>
￥{{totalPrice}}

</span>


</div>




<div class="card">

<h3>
{{ $t("dashboard.currentValue") }}
</h3>


<span>
￥{{currentValue}}

</span>


</div>


</div>



<div class="panel">


<h2>
{{ $t("dashboard.statusTitle") }}
</h2>


<div id="chart">

</div>


</div>



</div>


</template>



<script setup>


import {
onMounted,
ref,
watch
}
from "vue"

import {useI18n} from "vue-i18n"

import * as echarts from "echarts"


import {
getDevices
}
from "../api/device"



const {t, locale}=useI18n()


const username=
localStorage.getItem("username")



const devices=ref([])


const totalPrice=ref(0)

const currentValue=ref(0)


let chart=null



onMounted(async()=>{


try{


let userId=
localStorage.getItem("userId")


devices.value=
(await getDevices(userId)) || []


}catch(e){


// 后端未启动时接口会失败，这里不中断页面，用空数据展示
console.warn(
"设备数据加载失败（后端可能没有启动）",
e
)


devices.value=[]


}



totalPrice.value=

devices.value.reduce(
(a,b)=>
a+(b.purchasePrice||0),
0
)



currentValue.value=

devices.value.reduce(
(a,b)=>
a+(b.currentValue||0),
0
)



drawChart()


})



// 切换语言时重绘图表，让图例文字跟着变
watch(locale,()=>{

drawChart()

})



function drawChart(){


let dom=
document.getElementById("chart")


if(!dom) return


if(!chart){

chart=echarts.init(dom)

}


chart.setOption({

tooltip:{},

legend:{
bottom:0
},

series:[{

type:"pie",

radius:"60%",

data:[


{
name:t("dashboard.inUse"),
value:8
},


{
name:t("dashboard.idle"),
value:2
},


{
name:t("dashboard.sold"),
value:1
}


]

}]

})


}



</script>




<style scoped>


.sub{

color:#777;

}



.cards{


display:flex;
gap:25px;
margin-top:30px;


}



.card{


flex:1;
background:white;
border-radius:20px;
padding:30px;
box-shadow:
0 10px 30px rgba(0,0,0,.08);


}



.card span{


font-size:32px;
font-weight:bold;

color:#315efb;


}



.panel{


margin-top:40px;

background:white;
border-radius:25px;
padding:30px;


}



#chart{


height:350px;


}



</style>
