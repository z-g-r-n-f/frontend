const USER_KEY = "devicelife.user"
const LEGACY_ID_KEY = "userId"
const LEGACY_NAME_KEY = "username"

/** 读取本地登录用户；兼容旧版本只存 userId/username 的数据。 */
export function getStoredUser() {
    try {
        const raw = localStorage.getItem(USER_KEY)
        if (raw) {
            const parsed = JSON.parse(raw)
            if (parsed && parsed.userId) return parsed
        }
    } catch (e) {
        console.warn("本地用户信息解析失败", e)
    }

    const userId = localStorage.getItem(LEGACY_ID_KEY)
    if (!userId) return null

    return {
        userId: Number(userId),
        username: localStorage.getItem(LEGACY_NAME_KEY) || "",
        name: localStorage.getItem(LEGACY_NAME_KEY) || ""
    }
}

/** 登录/更新资料后统一写入，避免各页面各存一份。 */
export function setStoredUser(user) {
    if (!user || !user.userId) return
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    localStorage.setItem(LEGACY_ID_KEY, String(user.userId))
    localStorage.setItem(LEGACY_NAME_KEY, user.name || user.username || "")
}

export function clearStoredUser() {
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(LEGACY_ID_KEY)
    localStorage.removeItem(LEGACY_NAME_KEY)
}

export function getCurrentUserId() {
    const user = getStoredUser()
    return user ? user.userId : null
}

export function isAuthenticated() {
    return Boolean(getCurrentUserId())
}

export function displayNameOf(user) {
    if (!user) return ""
    return user.name || user.username || ""
}
