<template>


<div>


<h1>

你好，{{username}} 👋

</h1>


<p class="sub">

欢迎回来，这是你的数字设备空间

</p>



<div class="cards">


<div class="card">

<h3>
设备数量
</h3>


<span>
{{devices.length}}
</span>


</div>




<div class="card">

<h3>
购买价值
</h3>


<span>
￥{{totalPrice}}

</span>


</div>




<div class="card">

<h3>
当前价值
</h3>


<span>
￥{{currentValue}}

</span>


</div>


</div>



<div class="panel">


<h2>
设备状态分析
</h2>


<div id="chart">

</div>


</div>



</div>


</template>



<script setup>


import {
onMounted,
ref
}
from "vue"


import * as echarts from "echarts"


import {
getDevices
}
from "../api/device"



const username=
localStorage.getItem("username")



const devices=ref([])


const totalPrice=ref(0)

const currentValue=ref(0)



onMounted(async()=>{


let userId=
localStorage.getItem("userId")


devices.value=
await getDevices(userId)



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



function drawChart(){


let chart=
echarts.init(
document.getElementById("chart")
)



chart.setOption({


tooltip:{},


series:[{


type:"pie",


radius:"60%",


data:[


{
name:"使用中",
value:8
},


{
name:"停用",
value:2
},


{
name:"出售",
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