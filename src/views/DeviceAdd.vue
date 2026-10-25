<template>


<h2>
登记设备
</h2>


<el-form>


<el-input
v-model="form.deviceName"
placeholder="设备名称"
/>



<el-select
v-model="form.deviceType"
>

<option value="LAPTOP">
笔记本
</option>


<option value="PHONE">
手机
</option>


<option value="DESKTOP">
台式机
</option>


</el-select>



<el-input
v-model="form.manufacturer"
placeholder="厂商"
/>


<el-input
v-model="form.model"
placeholder="型号"
/>



<el-button
@click="submit"
>
提交
</el-button>


</el-form>



</template>



<script setup>

import {reactive} from "vue"

import {addDevice}
from "../api/device"



const form=reactive({

deviceName:"",

deviceType:"LAPTOP",

manufacturer:"",

model:"",

status:"ACTIVE"


})



async function submit(){


let userId=
localStorage.getItem("userId")



await addDevice(
userId,
form
)


alert("添加成功")


}



</script>