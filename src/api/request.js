import axios from "axios"

// DeviceLife backend is exposed through the SakuraFrp HTTPS tunnel.
// Keep this address in the frontend so a separately opened frontend can reach
// the backend without depending on the local machine's localhost:8080.
const baseURL = "https://frp-air.com:40538/api"

const request = axios.create({
    baseURL,
    timeout: 12000,
    withCredentials: true
})

request.interceptors.request.use(config => {
    let userId = localStorage.getItem("userId")
    try {
        const stored = JSON.parse(localStorage.getItem("devicelife.user") || "null")
        userId = stored?.userId || userId
    } catch {
        // Keep the legacy userId value when the stored profile is unavailable.
    }

    if (userId) {
        config.params = {
            ...(config.params || {}),
            userId: config.params?.userId ?? userId
        }
        config.headers = config.headers || {}
        config.headers["X-User-Id"] = String(userId)
    }

    return config
})

request.interceptors.response.use(
    response => {
        const res = response.data

        // 后端统一返回 { code, message, data }
        if (res && typeof res === "object" && "code" in res) {
            if (res.code !== 200) {
                const error = new Error(res.message || "请求失败")
                error.code = res.code
                error.payload = res.data
                return Promise.reject(error)
            }
            return res.data
        }

        return res
    },
    error => {
        let message = "网络异常，请检查后端服务是否已启动"

        if (error.code === "ECONNABORTED") {
            message = "请求超时，请稍后重试"
        } else if (error.response) {
            const data = error.response.data
            message = data?.message || `请求失败（HTTP ${error.response.status}）`
            if (data?.data && typeof data.data === "object") {
                const first = Object.values(data.data)[0]
                if (first) message = first
            }
        }

        const wrapped = new Error(message)
        wrapped.status = error.response?.status
        wrapped.original = error
        return Promise.reject(wrapped)
    }
)

export default request
