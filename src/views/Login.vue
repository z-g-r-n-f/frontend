<template>
    <div class="auth-page">
        <div class="orb orb-one"></div>
        <div class="orb orb-two"></div>

        <div class="lang-corner">
            <LangSwitch />
        </div>

        <div class="auth-shell">
            <section class="brand">
                <div class="brand-mark">💻</div>
                <p class="eyebrow">DEVICE LIFECYCLE</p>
                <h1>{{ $t("app.name") }}</h1>
                <h2>{{ $t("app.subtitle") }}</h2>
                <p class="slogan">{{ $t("app.slogan") }}</p>

                <ul class="brand-points">
                    <li><span>01</span> {{ $t("app.point1") }}</li>
                    <li><span>02</span> {{ $t("app.point2") }}</li>
                    <li><span>03</span> {{ $t("app.point3") }}</li>
                </ul>
            </section>

            <section class="auth-card">
                <div class="card-heading">
                    <h2>{{ $t("login.title") }}</h2>
                    <p>{{ $t("login.subtitle") }}</p>
                </div>

                <el-form
                    ref="formRef"
                    :model="form"
                    :rules="rules"
                    label-position="top"
                    @submit.prevent="submit"
                >
                    <el-form-item :label="$t('login.username')" prop="username">
                        <el-input
                            v-model="form.username"
                            size="large"
                            :placeholder="$t('login.username')"
                            autocomplete="username"
                            @keyup.enter="submit"
                        />
                    </el-form-item>

                    <el-form-item :label="$t('login.password')" prop="password">
                        <el-input
                            v-model="form.password"
                            size="large"
                            type="password"
                            show-password
                            :placeholder="$t('login.password')"
                            autocomplete="current-password"
                            @keyup.enter="submit"
                        />
                    </el-form-item>

                    <el-alert
                        v-if="errorMessage"
                        :title="errorMessage"
                        type="error"
                        :closable="false"
                        show-icon
                        class="login-error"
                    />

                    <el-button
                        type="primary"
                        size="large"
                        class="submit-button"
                        :loading="loading"
                        @click="submit"
                    >
                        {{ loading ? $t("common.loading") : $t("login.submit") }}
                    </el-button>
                </el-form>

                <div class="switch-line">
                    {{ $t("login.noAccount") }}
                    <router-link to="/register">{{ $t("login.toRegister") }}</router-link>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup>
import { computed, reactive, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import { ElMessage } from "element-plus"

import LangSwitch from "../components/LangSwitch.vue"
import { useUserStore } from "../store/user"

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const formRef = ref(null)
const loading = ref(false)
const errorMessage = ref("")

const form = reactive({
    username: "",
    password: ""
})

const rules = computed(() => ({
    username: [
        { required: true, message: t("login.usernameRequired"), trigger: "blur" }
    ],
    password: [
        { required: true, message: t("login.passwordRequired"), trigger: "blur" }
    ]
}))

async function submit() {
    if (loading.value || !formRef.value) return

    try {
        await formRef.value.validate()
    } catch (e) {
        return
    }

    loading.value = true
    errorMessage.value = ""

    try {
        await userStore.login({
            username: form.username.trim(),
            password: form.password
        })

        ElMessage.success(t("login.success"))

        const redirect = route.query.redirect
        const target =
            typeof redirect === "string" && redirect.startsWith("/")
                ? redirect
                : "/dashboard"

        router.replace(target)
    } catch (error) {
        errorMessage.value = error.message || t("login.failed")
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.auth-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 24px;
    background:
        radial-gradient(circle at 18% 14%, rgba(255, 255, 255, 0.18), transparent 34%),
        linear-gradient(135deg, #16264c 0%, #315efb 58%, #7c5cff 100%);
    position: relative;
    overflow: hidden;
}

.lang-corner {
    position: absolute;
    top: 28px;
    right: 34px;
    z-index: 5;
}

.auth-shell {
    width: min(1080px, 100%);
    display: grid;
    grid-template-columns: 1.1fr 420px;
    gap: 70px;
    align-items: center;
    position: relative;
    z-index: 2;
}

.brand {
    color: #fff;
}

.brand-mark {
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    background: rgba(255, 255, 255, 0.14);
    border: 1px solid rgba(255, 255, 255, 0.24);
    border-radius: 20px;
    backdrop-filter: blur(10px);
    margin-bottom: 22px;
}

.eyebrow {
    font-size: 12px;
    letter-spacing: 3px;
    font-weight: 700;
    opacity: 0.7;
    margin-bottom: 8px;
}

.brand h1 {
    font-size: clamp(46px, 6vw, 68px);
    line-height: 1;
    letter-spacing: -2px;
    font-weight: 800;
}

.brand h2 {
    margin-top: 18px;
    font-size: clamp(19px, 2vw, 24px);
    font-weight: 500;
    line-height: 1.5;
    opacity: 0.94;
}

.slogan {
    margin-top: 12px;
    font-size: 14px;
    letter-spacing: 0.4px;
    opacity: 0.66;
}

.brand-points {
    list-style: none;
    margin: 34px 0 0;
    padding: 0;
    display: grid;
    gap: 12px;
}

.brand-points li {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    opacity: 0.86;
}

.brand-points span {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 9px;
    font-size: 11px;
    font-weight: 700;
    background: rgba(255, 255, 255, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.18);
}

.auth-card {
    background: rgba(255, 255, 255, 0.96);
    border-radius: 26px;
    padding: 40px 36px;
    box-shadow: 0 30px 70px rgba(8, 20, 48, 0.35);
    backdrop-filter: blur(18px);
}

.card-heading {
    margin-bottom: 24px;
}

.card-heading h2 {
    font-size: 28px;
    font-weight: 750;
    letter-spacing: -0.5px;
}

.card-heading p {
    margin-top: 6px;
    font-size: 14px;
    color: var(--text-muted);
}

.login-error {
    margin-bottom: 14px;
}

.submit-button {
    width: 100%;
    height: 46px;
    border-radius: 12px;
    font-weight: 650;
    margin-top: 6px;
}

.switch-line {
    text-align: center;
    margin-top: 22px;
    font-size: 14px;
    color: var(--text-muted);
}

.switch-line a {
    font-weight: 650;
    margin-left: 4px;
}

.orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(10px);
    pointer-events: none;
}

.orb-one {
    width: 420px;
    height: 420px;
    top: -180px;
    left: -130px;
    background: rgba(255, 255, 255, 0.12);
}

.orb-two {
    width: 520px;
    height: 520px;
    bottom: -280px;
    right: -140px;
    background: rgba(255, 215, 120, 0.13);
}

@media (max-width: 900px) {
    .auth-shell {
        grid-template-columns: 1fr;
        gap: 34px;
        width: min(440px, 100%);
    }

    .brand {
        text-align: center;
    }

    .brand-mark {
        margin: 0 auto 18px;
    }

    .brand-points {
        display: none;
    }

    .brand h1 {
        font-size: 46px;
    }

    .auth-page {
        padding: 72px 20px 36px;
        align-items: flex-start;
    }
}

@media (max-width: 520px) {
    .auth-card {
        padding: 28px 22px;
        border-radius: 20px;
    }

    .lang-corner {
        top: 20px;
        right: 20px;
    }
}
</style>
