<template>
    <div class="page profile-page">
        <div class="page-header">
            <div>
                <h1 class="page-title">{{ $t("profile.title") }}</h1>
                <p class="page-subtitle">{{ $t("profile.subtitle") }}</p>
            </div>
        </div>

        <div class="profile-grid">
            <aside class="panel identity-card">
                <div class="identity-cover">
                    <span class="cover-grid"></span>
                </div>

                <div class="identity-body">
                    <div class="avatar-large">{{ userStore.initials }}</div>
                    <h2>{{ displayName || $t("profile.noName") }}</h2>
                    <p class="identity-username">@{{ user?.username || "-" }}</p>
                    <p class="identity-email">{{ user?.email || "-" }}</p>

                    <div class="identity-meta">
                        <div>
                            <span>{{ $t("profile.userId") }}</span>
                            <strong>#{{ user?.userId || "-" }}</strong>
                        </div>
                        <div>
                            <span>{{ $t("profile.memberSince") }}</span>
                            <strong>{{ formatDate(user?.createdAt) }}</strong>
                        </div>
                    </div>

                    <el-button class="logout-button" @click="logout">
                        ⏻ {{ $t("profile.logout") }}
                    </el-button>
                </div>
            </aside>

            <div class="profile-main">
                <section class="stats-grid">
                    <article class="mini-stat">
                        <span class="mini-icon blue">▤</span>
                        <div>
                            <span>{{ $t("profile.deviceCount") }}</span>
                            <strong>{{ devices.length }}</strong>
                        </div>
                    </article>

                    <article class="mini-stat">
                        <span class="mini-icon amber">¥</span>
                        <div>
                            <span>{{ $t("profile.purchaseTotal") }}</span>
                            <strong>{{ currency(totalPurchase) }}</strong>
                        </div>
                    </article>

                    <article class="mini-stat">
                        <span class="mini-icon green">↗</span>
                        <div>
                            <span>{{ $t("profile.currentTotal") }}</span>
                            <strong>{{ currency(totalCurrent) }}</strong>
                        </div>
                    </article>
                </section>

                <section class="panel settings-panel" v-loading="loading">
                    <el-tabs v-model="activeTab" class="profile-tabs">
                        <el-tab-pane :label="$t('profile.basicInfo')" name="basic">
                            <div class="tab-heading">
                                <h3>{{ $t("profile.basicInfo") }}</h3>
                                <p>{{ $t("profile.basicHint") }}</p>
                            </div>

                            <el-form
                                ref="profileFormRef"
                                :model="profileForm"
                                :rules="profileRules"
                                label-position="top"
                                class="settings-form"
                            >
                                <el-row :gutter="18">
                                    <el-col :xs="24" :sm="12">
                                        <el-form-item :label="$t('profile.username')">
                                            <el-input :model-value="user?.username" disabled />
                                        </el-form-item>
                                    </el-col>

                                    <el-col :xs="24" :sm="12">
                                        <el-form-item :label="$t('profile.name')" prop="name">
                                            <el-input
                                                v-model="profileForm.name"
                                                :placeholder="$t('profile.namePlaceholder')"
                                                maxlength="50"
                                            />
                                        </el-form-item>
                                    </el-col>

                                    <el-col :xs="24" :sm="12">
                                        <el-form-item :label="$t('profile.email')" prop="email">
                                            <el-input
                                                v-model="profileForm.email"
                                                :placeholder="$t('profile.emailPlaceholder')"
                                                maxlength="100"
                                            />
                                        </el-form-item>
                                    </el-col>
                                </el-row>

                                <div class="form-actions">
                                    <el-button
                                        type="primary"
                                        :loading="profileSaving"
                                        @click="saveProfile"
                                    >
                                        {{ $t("profile.saveProfile") }}
                                    </el-button>
                                </div>
                            </el-form>
                        </el-tab-pane>

                        <el-tab-pane :label="$t('profile.security')" name="security">
                            <div class="tab-heading">
                                <h3>{{ $t("profile.passwordTitle") }}</h3>
                                <p>{{ $t("profile.passwordSubtitle") }}</p>
                            </div>

                            <el-alert
                                :title="$t('profile.securityTip')"
                                type="info"
                                :closable="false"
                                show-icon
                                class="security-tip"
                            />

                            <el-form
                                ref="passwordFormRef"
                                :model="passwordForm"
                                :rules="passwordRules"
                                label-position="top"
                                class="settings-form"
                            >
                                <el-row :gutter="18">
                                    <el-col :xs="24" :sm="12">
                                        <el-form-item
                                            :label="$t('profile.currentPassword')"
                                            prop="currentPassword"
                                        >
                                            <el-input
                                                v-model="passwordForm.currentPassword"
                                                type="password"
                                                show-password
                                                autocomplete="current-password"
                                            />
                                        </el-form-item>
                                    </el-col>
                                </el-row>

                                <el-row :gutter="18">
                                    <el-col :xs="24" :sm="12">
                                        <el-form-item
                                            :label="$t('profile.newPassword')"
                                            prop="password"
                                        >
                                            <el-input
                                                v-model="passwordForm.password"
                                                type="password"
                                                show-password
                                                autocomplete="new-password"
                                            />
                                        </el-form-item>
                                    </el-col>

                                    <el-col :xs="24" :sm="12">
                                        <el-form-item
                                            :label="$t('profile.confirmPassword')"
                                            prop="confirmPassword"
                                        >
                                            <el-input
                                                v-model="passwordForm.confirmPassword"
                                                type="password"
                                                show-password
                                                autocomplete="new-password"
                                            />
                                        </el-form-item>
                                    </el-col>
                                </el-row>

                                <div class="form-actions">
                                    <el-button
                                        type="primary"
                                        :loading="passwordSaving"
                                        @click="changePassword"
                                    >
                                        {{ $t("profile.changePassword") }}
                                    </el-button>
                                </div>
                            </el-form>
                        </el-tab-pane>

                        <el-tab-pane :label="$t('profile.accountInfo')" name="account">
                            <div class="tab-heading">
                                <h3>{{ $t("profile.accountInfo") }}</h3>
                                <p>{{ $t("profile.accountHint") }}</p>
                            </div>

                            <el-descriptions :column="1" border class="account-descriptions">
                                <el-descriptions-item :label="$t('profile.userId')">
                                    {{ user?.userId || "-" }}
                                </el-descriptions-item>
                                <el-descriptions-item :label="$t('profile.username')">
                                    {{ user?.username || "-" }}
                                </el-descriptions-item>
                                <el-descriptions-item :label="$t('profile.name')">
                                    {{ user?.name || $t("profile.noName") }}
                                </el-descriptions-item>
                                <el-descriptions-item :label="$t('profile.email')">
                                    {{ user?.email || "-" }}
                                </el-descriptions-item>
                                <el-descriptions-item :label="$t('profile.memberSince')">
                                    {{ formatDate(user?.createdAt) }}
                                </el-descriptions-item>
                                <el-descriptions-item :label="$t('common.actions')">
                                    <el-button text type="primary" @click="activeTab = 'basic'">
                                        {{ $t("common.edit") }}
                                    </el-button>
                                </el-descriptions-item>
                            </el-descriptions>

                            <p class="session-tip">{{ $t("profile.sessionTip") }}</p>
                        </el-tab-pane>
                    </el-tabs>
                </section>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue"
import { useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import { ElMessage, ElMessageBox } from "element-plus"

import { getDevices } from "../api/device"
import { useUserStore } from "../store/user"

const { t, locale } = useI18n()
const router = useRouter()
const userStore = useUserStore()

const user = computed(() => userStore.user)
const displayName = computed(() => userStore.displayName)

const activeTab = ref("basic")
const loading = ref(false)
const profileSaving = ref(false)
const passwordSaving = ref(false)
const devices = ref([])
let logoutTimer = null

const profileFormRef = ref(null)
const passwordFormRef = ref(null)

const profileForm = reactive({
    name: "",
    email: ""
})

const passwordForm = reactive({
    currentPassword: "",
    password: "",
    confirmPassword: ""
})

const profileRules = computed(() => ({
    name: [
        { required: true, message: t("profile.nameRequired"), trigger: "blur" }
    ],
    email: [
        { required: true, message: t("profile.emailRequired"), trigger: "blur" },
        { type: "email", message: t("profile.emailInvalid"), trigger: "blur" }
    ]
}))

const validateConfirm = (rule, value, callback) => {
    if (!value) {
        callback(new Error(t("profile.passwordMismatch")))
    } else if (value !== passwordForm.password) {
        callback(new Error(t("profile.passwordMismatch")))
    } else {
        callback()
    }
}

const passwordRules = computed(() => ({
    currentPassword: [
        { required: true, message: t("profile.currentPasswordRequired"), trigger: "blur" }
    ],
    password: [
        { required: true, message: t("profile.newPasswordRequired"), trigger: "blur" },
        { min: 6, max: 100, message: t("profile.passwordMin"), trigger: "blur" }
    ],
    confirmPassword: [
        { validator: validateConfirm, trigger: "blur" }
    ]
}))

const totalPurchase = computed(() =>
    devices.value.reduce((sum, item) => sum + Number(item.purchasePrice || 0), 0)
)

const totalCurrent = computed(() =>
    devices.value.reduce((sum, item) => sum + Number(item.currentValue || 0), 0)
)

function currency(value) {
    return `¥${Number(value || 0).toLocaleString(locale.value, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`
}

function formatDate(value) {
    if (!value) return "-"
    const date = new Date(String(value).replace(" ", "T"))
    if (Number.isNaN(date.getTime())) return String(value)
    return date.toLocaleDateString(locale.value, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    })
}

function syncProfileForm() {
    profileForm.name = user.value?.name || ""
    profileForm.email = user.value?.email || ""
}

async function loadData() {
    loading.value = true

    try {
        if (!userStore.userId) return

        const [profile, deviceList] = await Promise.allSettled([
            userStore.fetchProfile(),
            getDevices(userStore.userId)
        ])

        if (profile.status === "rejected") {
            console.warn("用户资料加载失败", profile.reason)
        }

        devices.value = deviceList.status === "fulfilled" ? deviceList.value || [] : []
        syncProfileForm()
    } finally {
        loading.value = false
    }
}

async function saveProfile() {
    if (!profileFormRef.value || profileSaving.value) return

    try {
        await profileFormRef.value.validate()
    } catch (e) {
        return
    }

    profileSaving.value = true
    try {
        await userStore.saveProfile({
            name: profileForm.name.trim(),
            email: profileForm.email.trim()
        })
        syncProfileForm()
        ElMessage.success(t("profile.profileSaved"))
    } catch (error) {
        ElMessage.error(error.message || t("errors.unknown"))
    } finally {
        profileSaving.value = false
    }
}

async function changePassword() {
    if (!passwordFormRef.value || passwordSaving.value) return

    try {
        await passwordFormRef.value.validate()
    } catch (e) {
        return
    }

    passwordSaving.value = true
    try {
        await userStore.saveProfile({
            currentPassword: passwordForm.currentPassword,
            password: passwordForm.password
        })

        ElMessage.success(t("profile.passwordChanged"))
        passwordForm.currentPassword = ""
        passwordForm.password = ""
        passwordForm.confirmPassword = ""

        logoutTimer = setTimeout(() => {
            userStore.logout()
            router.replace("/login")
        }, 1000)
    } catch (error) {
        ElMessage.error(error.message || t("errors.unknown"))
    } finally {
        passwordSaving.value = false
    }
}

async function logout() {
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

onMounted(async () => {
    await loadData()
    syncProfileForm()
})

onBeforeUnmount(() => {
    if (logoutTimer) clearTimeout(logoutTimer)
})
</script>

<style scoped>
.profile-grid {
    display: grid;
    grid-template-columns: 300px minmax(0, 1fr);
    gap: 20px;
    align-items: start;
}

.identity-card {
    overflow: hidden;
    position: sticky;
    top: 96px;
}

.identity-cover {
    height: 112px;
    background:
        radial-gradient(circle at 82% 24%, rgba(255, 255, 255, 0.26), transparent 32%),
        linear-gradient(130deg, #1c3568, #315efb 72%, #7c5cff);
    position: relative;
    overflow: hidden;
}

.cover-grid {
    position: absolute;
    inset: 0;
    background-image:
        linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
    background-size: 22px 22px;
    mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.8), transparent);
}

.identity-body {
    padding: 0 24px 24px;
    text-align: center;
}

.avatar-large {
    width: 84px;
    height: 84px;
    margin: -44px auto 14px;
    border-radius: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #7aa2ff, #b58cff);
    color: #fff;
    font-size: 32px;
    font-weight: 750;
    border: 4px solid #fff;
    box-shadow: 0 10px 26px rgba(49, 94, 251, 0.24);
    position: relative;
    z-index: 1;
}

.identity-body h2 {
    font-size: 21px;
    font-weight: 750;
    letter-spacing: -0.3px;
    word-break: break-word;
}

.identity-username {
    margin-top: 5px;
    font-size: 12px;
    color: var(--text-muted);
}

.identity-email {
    margin-top: 10px;
    font-size: 12px;
    color: var(--text-regular);
    word-break: break-all;
}

.identity-meta {
    margin-top: 22px;
    padding-top: 16px;
    border-top: 1px dashed var(--border);
    display: grid;
    gap: 12px;
    text-align: left;
}

.identity-meta div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.identity-meta span {
    font-size: 11px;
    color: var(--text-muted);
}

.identity-meta strong {
    font-size: 12px;
    font-weight: 650;
    color: var(--text-main);
}

.logout-button {
    width: 100%;
    margin-top: 22px;
    height: 40px;
    border-radius: 10px;
    color: var(--danger);
    border-color: #fecaca;
    background: #fff7f7;
}

.logout-button:hover {
    background: #fef2f2;
    border-color: #fca5a5;
    color: #dc2626;
}

.profile-main {
    display: flex;
    flex-direction: column;
    gap: 20px;
    min-width: 0;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
}

.mini-stat {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 18px;
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 16px;
    box-shadow: var(--shadow-card);
}

.mini-icon {
    width: 42px;
    height: 42px;
    flex: 0 0 42px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 700;
}

.mini-icon.blue {
    background: #eef3ff;
    color: #315efb;
}

.mini-icon.amber {
    background: #fff7e6;
    color: #d97706;
}

.mini-icon.green {
    background: #e9fbf3;
    color: #059669;
}

.mini-stat div {
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.mini-stat div span {
    font-size: 11px;
    color: var(--text-muted);
}

.mini-stat div strong {
    margin-top: 4px;
    font-size: 19px;
    font-weight: 750;
    letter-spacing: -0.4px;
    color: var(--text-main);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.settings-panel {
    padding: 10px 26px 28px;
    min-height: 420px;
}

.profile-tabs :deep(.el-tabs__header) {
    margin-bottom: 24px;
}

.profile-tabs :deep(.el-tabs__item) {
    height: 52px;
    font-size: 14px;
    font-weight: 600;
}

.tab-heading {
    margin-bottom: 20px;
}

.tab-heading h3 {
    font-size: 17px;
    font-weight: 700;
}

.tab-heading p {
    margin-top: 5px;
    font-size: 12px;
    color: var(--text-muted);
}

.settings-form {
    max-width: 680px;
}

.form-actions {
    margin-top: 6px;
}

.security-tip {
    margin-bottom: 20px;
    max-width: 680px;
}

.account-descriptions {
    max-width: 680px;
}

.account-descriptions :deep(.el-descriptions__label) {
    width: 160px;
    color: var(--text-muted);
    font-weight: 500;
}

.session-tip {
    margin-top: 16px;
    font-size: 11px;
    color: var(--text-muted);
}

@media (max-width: 1080px) {
    .profile-grid {
        grid-template-columns: 1fr;
    }

    .identity-card {
        position: static;
    }

    .identity-cover {
        height: 96px;
    }

    .identity-body {
        display: grid;
        grid-template-columns: auto 1fr;
        column-gap: 18px;
        text-align: left;
        padding: 0 22px 22px;
    }

    .avatar-large {
        grid-row: span 3;
        margin: -34px 0 0;
        width: 72px;
        height: 72px;
        font-size: 27px;
    }

    .identity-email {
        margin-top: 4px;
    }

    .identity-meta {
        grid-column: 1 / -1;
        margin-top: 16px;
    }

    .logout-button {
        grid-column: 1 / -1;
    }
}

@media (max-width: 720px) {
    .stats-grid {
        grid-template-columns: 1fr;
    }

    .settings-panel {
        padding: 6px 16px 22px;
    }

    .identity-body {
        display: block;
        text-align: center;
    }

    .avatar-large {
        margin: -34px auto 12px;
    }

    .identity-meta {
        text-align: left;
    }
}
</style>
