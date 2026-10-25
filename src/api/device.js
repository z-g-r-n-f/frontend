import request from "./request"



export function getDevices(userId){

return request.get(

"/devices",

{

params:{
userId
}

}

)

}



export function addDevice(userId,data){

return request.post(

`/devices?userId=${userId}`,

data

)

}




export function updateDevice(id,data){

return request.put(

`/devices/${id}`,

data

)

}



export function deleteDevice(id){

return request.delete(

`/devices/${id}`

)

}



export function getDevice(id){

return request.get(

`/devices/${id}`

)

}
