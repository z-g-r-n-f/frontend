import axios from "axios"


const request=axios.create({

baseURL:"http://localhost:8080/api",

timeout:5000

})



request.interceptors.response.use(

response=>{


let res=response.data


if(res.code!==200){

return Promise.reject(res.message)

}


return res.data


},


error=>{


return Promise.reject(error)

}

)



export default request