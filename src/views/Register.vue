<template>
    <div class="auth-page">
        <div class="orb orb-one"></div>
        <div class="orb orb-two"></div>

        <div class="lang-corner">
            <LangSwitch />
        </div>

        <section class="auth-card">
            <router-link to="/login" class="back-link">← {{ $t("register.toLogin") }}</router-link>

            <div class="card-heading">
                <p class="eyebrow">DEVICE LIFECYCLE</p>
                <h1>{{ $t("register.title") }}</h1>
                <p>{{ $t("register.subtitle") }}</p>
            </div>

            <el-form
                ref="formRef"
                :model="form"
                :rules="rules"
                label-position="top"
                @submit.prevent="submit"
            >
                <el-form-item :label="$t('register.username')" prop="username">
                    <el-input
                        v-model="form.username"
                        size="large"
                        :placeholder="$t('register.username')"
                        autocomplete="username"
                        maxlength="50"
                    />
                </el-form-item>

                <el-form-item :label="$t('register.email')" prop="email">
                    <el-input
                        v-model="form.email"
                        size="large"
                        :placeholder="$t('register.email')"
                        autocomplete="email"
                        maxlength="100"
                    />
                </el-form-item>

                <div class="password-grid">
                    <el-form-item :label="$t('register.password')" prop="password">
                        <el-input
                            v-model="form.password"
                            size="large"
                            type="password"
                            show-password
                            :placeholder="$t('register.password')"
                            autocomplete="new-password"
                        />
                    </el-form-item>

                    <el-form-item :label="$t('register.confirmPassword')" prop="confirmPassword">
                        <el-input
                            v-model="form.confirmPassword"
                            size="large"
                            type="password"
                            show-password
                            :placeholder="$t('register.confirmPassword')"
                            autocomplete="new-password"
                        />
                    </el-form-item>
                </div>

                <el-alert
                    v-if="errorMessage"
                    :title="errorMessage"
                    type="error"
                    :closable="false"
                    show-icon
                    class="register-error"
                />

                <el-button
                    type="primary"
                    size="large"
                    class="submit-button"
                    :loading="loading"
                    @click="submit"
                >
                    {{ loading ? $t("register.submitting") : $t("register.submit") }}
                </el-button>
            </el-form>

            <div class="switch-line">
                {{ $t("register.hasAccount") }}
                <router-link to="/login">{{ $t("register.toLogin") }}</router-link>
            </div>
        </section>
    </div>
</template>

<script setup>
import { computed, onBeforeUnmount, reactive, ref } from "vue"
import { useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import { ElMessage } from "element-plus"

import LangSwitch from "../components/LangSwitch.vue"
import { register } from "../api/user"

const { t } = useI18n()
const router = useRouter()

const formRef = ref(null)
const loading = ref(false)
const errorMessage = ref("")
let redirectTimer = null

const form = reactive({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
})

const validateConfirm = (rule, value, callback) => {
    if (!value) {
        callback(new Error(t("register.mismatch")))
    } else if (value !== form.password) {
        callback(new Error(t("register.mismatch")))
    } else {
        callback()
    }
}

const rules = computed(() => ({
    username: [
        { required: true, message: t("login.usernameRequired"), trigger: "blur" },
        { min: 3, max: 50, message: t("register.usernameLength"), trigger: "blur" }
    ],
    email: [
        { required: true, message: t("register.emailRequired"), trigger: "blur" },
        { type: "email", message: t("register.emailInvalid"), trigger: "blur" }
    ],
    password: [
        { required: true, message: t("login.passwordRequired"), trigger: "blur" },
        { min: 6, max: 100, message: t("register.passwordLength"), trigger: "blur" }
    ],
    confirmPassword: [
        { validator: validateConfirm, trigger: "blur" }
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
        await register({
            username: form.username.trim(),
            password: form.password,
            email: form.email.trim(),
            name: form.username.trim()
        })

        ElMessage.success(t("register.successRedirect"))
        redirectTimer = setTimeout(() => router.push("/login"), 900)
    } catch (error) {
        errorMessage.value = error.message || t("errors.unknown")
    } finally {
        loading.value = false
    }
}

onBeforeUnmount(() => {
    if (redirectTimer) clearTimeout(redirectTimer)
})
</script>

<style scoped>
.auth-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 24px;
    background:
        radial-gradient(circle at 84% 12%, rgba(255, 255, 255, 0.16), transparent 34%),
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

.auth-card {
    width: min(480px, 100%);
    background: rgba(255, 255, 255, 0.97);
    border-radius: 26px;
    padding: 34px 38px 36px;
    box-shadow: 0 30px 70px rgba(8, 20, 48, 0.35);
    position: relative;
    z-index: 2;
}

.back-link {
    display: inline-block;
    font-size: 13px;
    color: var(--text-muted);
    margin-bottom: 18px;
}

.back-link:hover {
    color: var(--brand);
}

.card-heading {
    margin-bottom: 22px;
}

.eyebrow {
    font-size: 11px;
    letter-spacing: 2.6px;
    font-weight: 700;
    color: var(--brand);
    margin-bottom: 6px;
}

.card-heading h1 {
    font-size: 30px;
    font-weight: 750;
    letter-spacing: -0.6px;
}

.card-heading p {
    margin-top: 6px;
    font-size: 14px;
    color: var(--text-muted);
}

.password-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
}

.register-error {
    margin-bottom: 12px;
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
    margin-top: 20px;
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

@media (max-width: 560px) {
    .auth-page {
        padding: 74px 18px 30px;
        align-items: flex-start;
    }

    .auth-card {
        padding: 26px 22px 28px;
        border-radius: 20px;
    }

    .password-grid {
        grid-template-columns: 1fr;
        gap: 0;
    }

    .lang-corner {
        top: 20px;
        right: 20px;
    }
}
</style>
