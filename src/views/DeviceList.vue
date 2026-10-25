<template>


<h1>
我的设备
</h1>


<el-button
@click="$router.push('/add')"
>
新增设备
</el-button>



<el-table
:data="devices"
>


<el-table-column
prop="deviceName"
label="设备名称"
/>


<el-table-column
prop="deviceType"
label="类型"
/>


<el-table-column
prop="manufacturer"
label="厂商"
/>


<el-table-column
prop="status"
label="状态"
/>



<el-table-column label="操作">


<template #default="scope">


<el-button
@click="remove(scope.row.deviceId)"
>
删除
</el-button>



</template>


</el-table-column>



</el-table>


</template>



<script setup>


import {
ref,
onMounted
}
from "vue"


import {
getDevices,
deleteDevice
}
from "../api/device"



const devices=ref([])



onMounted(async()=>{


let id=localStorage.getItem("userId")


devices.value=
await getDevices(id)


})



async function remove(id){


await deleteDevice(id)


location.reload()


}



</script>