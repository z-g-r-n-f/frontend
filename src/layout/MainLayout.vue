<template>
    <div class="layout" :class="{ 'sidebar-open': mobileOpen }">
        <div v-if="mobileOpen" class="mobile-mask" @click="mobileOpen = false"></div>

        <aside class="sidebar">
            <router-link to="/dashboard" class="logo">
                <span class="logo-mark">💻</span>
                <span class="logo-copy">
                    <strong>{{ $t("app.name") }}</strong>
                    <small>LIFECYCLE</small>
                </span>
            </router-link>

            <p class="nav-label">NAVIGATION</p>

            <el-menu
                :default-active="activeMenu"
                router
                class="side-menu"
                @select="mobileOpen = false"
            >
                <el-menu-item
    index="/dashboard"
    data-tour="dashboard"
>
                    <span class="nav-icon">◫</span>
                    <span>{{ $t("menu.home") }}</span>
                </el-menu-item>

                <el-menu-item
    index="/devices"
    data-tour="device-management"
>
    <span class="nav-icon">▤</span>
    <span>{{ $t("menu.devices") }}</span>
</el-menu-item>

                <el-menu-item
    index="/devices/new"
    data-tour="add-device"
>
                    <span class="nav-icon">＋</span>
                    <span>{{ $t("menu.addDevice") }}</span>
                </el-menu-item>

                <el-menu-item
    index="/profile"
    data-tour="profile"
>
                    <span class="nav-icon">◉</span>
                    <span>{{ $t("menu.profile") }}</span>
                </el-menu-item>
            </el-menu>

            <div class="sidebar-bottom">
                <div class="tip-card">
                    <span class="tip-icon">✦</span>
                    <p>{{ $t("layout.tip") }}</p>
                </div>

                <div class="mini-profile">
                    <div class="avatar">{{ userStore.initials }}</div>
                    <div class="mini-copy">
                        <strong>{{ displayName || $t("profile.noName") }}</strong>
                        <span>@{{ userStore.user?.username || "-" }}</span>
                    </div>
                </div>
            </div>
        </aside>

        <div class="main-wrap">
            <header class="topbar">
                <div class="topbar-left">
                    <button class="menu-button" type="button" @click="mobileOpen = true">
                        ☰
                    </button>
                    <div class="page-context">
                        <span class="context-root">{{ $t("app.name") }}</span>
                        <span class="context-separator">/</span>
                        <span class="context-current">{{ pageTitle }}</span>
                    </div>
                </div>

                <div class="topbar-right">
                    <LangSwitch />

                    <el-dropdown trigger="click" @command="handleCommand">
                        <button class="user-trigger" type="button">
                            <span class="avatar small">{{ userStore.initials }}</span>
                            <span class="user-copy">
                                <strong>{{ displayName || $t("profile.noName") }}</strong>
                                <small>@{{ userStore.user?.username || "-" }}</small>
                            </span>
                            <span class="chevron">⌄</span>
                        </button>

                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="profile">
                                    ◉ {{ $t("menu.profile") }}
                                </el-dropdown-item>
                                <el-dropdown-item command="devices">
                                    ▤ {{ $t("menu.devices") }}
                                </el-dropdown-item>
                                <el-dropdown-item divided command="logout">
                                    ⏻ {{ $t("menu.logout") }}
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </header>

            <main class="content">
                <router-view />
            </main>

            <footer class="footer">
                <span>DeviceLife · {{ $t("app.subtitle") }}</span>
                <span>© {{ year }}</span>
            </footer>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import { ElMessage, ElMessageBox } from "element-plus"

import LangSwitch from "../components/LangSwitch.vue"
import { useUserStore } from "../store/user"

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const userStore = useUserStore()

const mobileOpen = ref(false)
const year = new Date().getFullYear()

const displayName = computed(() => userStore.displayName)

const pageTitle = computed(() => {
    const key = route.meta?.title
    return key ? t(key) : t("app.name")
})

const activeMenu = computed(() => {
    if (route.path === "/devices/new") return "/devices/new"
    if (route.path.startsWith("/devices")) return "/devices"
    if (route.path.startsWith("/profile")) return "/profile"
    return "/dashboard"
})

async function handleCommand(command) {
    if (command === "profile") {
        router.push("/profile")
        return
    }

    if (command === "devices") {
        router.push("/devices")
        return
    }

    if (command === "logout") {
        try {
            await ElMessageBox.confirm(
                t("profile.logoutConfirm"),
                t("profile.logout"),
                {
                    confirmButtonText: t("common.confirm"),
                    cancelButtonText: t("common.cancel"),
                    type: "warning"
                }
            )
        } catch (e) {
            return
        }

        userStore.logout()
        ElMessage.success(t("profile.logoutSuccess"))
        router.replace("/login")
    }
}

watch(
    () => route.fullPath,
    () => {
        mobileOpen.value = false
    }
)

onMounted(async () => {
    if (!userStore.user) return

    try {
        await userStore.fetchProfile()
    } catch (e) {
        // 后端暂时不可用时保留本地登录态，不阻塞页面渲染
        console.warn("用户资料刷新失败", e.message)
    }
})
</script>

<style scoped>
.layout {
    min-height: 100vh;
    display: flex;
    background: var(--page-bg);
}

.sidebar {
    width: 248px;
    flex: 0 0 248px;
    min-height: 100vh;
    padding: 26px 18px 22px;
    background:
        radial-gradient(circle at 20% 0%, rgba(120, 160, 255, 0.28), transparent 36%),
        linear-gradient(180deg, #14284f 0%, #1b376c 52%, #15284c 100%);
    color: #fff;
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 0;
    z-index: 30;
}

.logo {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 4px 8px 0;
    color: #fff;
}

.logo-mark {
    width: 42px;
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.16);
    font-size: 20px;
}

.logo-copy {
    display: flex;
    flex-direction: column;
    line-height: 1.15;
}

.logo-copy strong {
    font-size: 19px;
    letter-spacing: -0.3px;
}

.logo-copy small {
    margin-top: 3px;
    font-size: 9px;
    letter-spacing: 2.4px;
    opacity: 0.56;
}

.nav-label {
    margin: 36px 10px 10px;
    font-size: 10px;
    letter-spacing: 2.2px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.4);
}

.side-menu {
    border-right: none;
    background: transparent;
}

:deep(.el-menu-item) {
    height: 48px;
    line-height: 48px;
    margin-bottom: 6px;
    border-radius: 12px;
    color: rgba(255, 255, 255, 0.72);
    font-size: 14px;
    transition: background 0.2s, color 0.2s;
}

:deep(.el-menu-item:hover) {
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
}

:deep(.el-menu-item.is-active) {
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.08));
    color: #fff;
    font-weight: 650;
    box-shadow: inset 3px 0 0 #8bb2ff;
}

.nav-icon {
    display: inline-flex;
    width: 24px;
    font-size: 16px;
    opacity: 0.9;
}

.sidebar-bottom {
    margin-top: auto;
}

.tip-card {
    padding: 15px;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.07);
    border: 1px solid rgba(255, 255, 255, 0.09);
    margin-bottom: 18px;
}

.tip-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.1);
    font-size: 12px;
    margin-bottom: 9px;
}

.tip-card p {
    font-size: 12px;
    line-height: 1.7;
    color: rgba(255, 255, 255, 0.6);
}

.mini-profile {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 8px 0;
    border-top: 1px solid rgba(255, 255, 255, 0.09);
}

.avatar {
    width: 38px;
    height: 38px;
    border-radius: 12px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #7aa2ff, #b58cff);
    color: #fff;
    font-size: 15px;
    font-weight: 700;
    flex: 0 0 auto;
}

.avatar.small {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    font-size: 13px;
}

.mini-copy {
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.mini-copy strong {
    font-size: 13px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.mini-copy span {
    margin-top: 2px;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.48);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.main-wrap {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
}

.topbar {
    height: 74px;
    flex: 0 0 74px;
    padding: 0 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    background: rgba(244, 246, 251, 0.86);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 0;
    z-index: 20;
}

.topbar-left,
.topbar-right {
    display: flex;
    align-items: center;
    gap: 14px;
}

.menu-button {
    display: none;
    width: 38px;
    height: 38px;
    border: 1px solid var(--border);
    background: #fff;
    border-radius: 10px;
    cursor: pointer;
    font-size: 17px;
    color: var(--text-main);
}

.context-root {
    font-size: 13px;
    color: var(--text-muted);
}

.context-separator {
    margin: 0 8px;
    color: #c4cbd8;
    font-size: 12px;
}

.context-current {
    font-size: 13px;
    font-weight: 650;
    color: var(--text-main);
}

.user-trigger {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 5px 10px 5px 6px;
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 12px;
    cursor: pointer;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.user-trigger:hover {
    border-color: #c9d5f8;
    box-shadow: 0 4px 14px rgba(49, 94, 251, 0.08);
}

.user-copy {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    line-height: 1.2;
    max-width: 130px;
}

.user-copy strong {
    font-size: 13px;
    font-weight: 650;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 130px;
}

.user-copy small {
    margin-top: 3px;
    font-size: 10px;
    color: var(--text-muted);
}

.chevron {
    font-size: 13px;
    color: var(--text-muted);
    padding: 0 2px;
}

.content {
    flex: 1;
    width: 100%;
    max-width: 1240px;
    margin: 0 auto;
    padding: 30px;
}

.footer {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding: 0 30px 24px;
    font-size: 11px;
    color: #a3adbd;
}

.mobile-mask {
    display: none;
}

@media (max-width: 960px) {
    .sidebar {
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        transform: translateX(-100%);
        transition: transform 0.25s ease;
        box-shadow: 20px 0 50px rgba(15, 27, 52, 0.2);
        z-index: 60;
    }

    .sidebar-open .sidebar {
        transform: translateX(0);
    }

    .mobile-mask {
        display: block;
        position: fixed;
        inset: 0;
        background: rgba(15, 23, 42, 0.4);
        z-index: 50;
        backdrop-filter: blur(2px);
    }

    .menu-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }

    .topbar {
        padding: 0 18px;
    }

    .context-root,
    .context-separator {
        display: none;
    }

    .content {
        padding: 22px 18px;
    }

    .footer {
        padding: 0 18px 20px;
    }
}

@media (max-width: 640px) {
    .user-copy,
    .chevron {
        display: none;
    }

    .user-trigger {
        padding: 4px;
        border-radius: 10px;
    }

    .topbar-right {
        gap: 8px;
    }

    .footer span:first-child {
        display: none;
    }

    .footer {
        justify-content: center;
    }
}
</style>
