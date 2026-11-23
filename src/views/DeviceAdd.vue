<template>
    <div class="page">
        <div class="page-header">
            <div>
                <button class="back-link" type="button" @click="$router.push('/devices')">
                    ← {{ $t("device.backToList") }}
                </button>
                <h1 class="page-title">{{ $t("device.addTitle") }}</h1>
                <p class="page-subtitle">{{ $t("device.addSubtitle") }}</p>
            </div>
        </div>

        <DeviceForm
            mode="create"
            :loading="saving"
            @submit="submit"
            @cancel="$router.push('/devices')"
        />
    </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import { ElMessage } from "element-plus"

import DeviceForm from "../components/DeviceForm.vue"
import { addDevice } from "../api/device"
import { useUserStore } from "../store/user"

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()

const saving = ref(false)

async function submit(payload) {
    if (saving.value) return

    if (!userStore.userId) {
        ElMessage.error(t("profile.sessionTip"))
        return
    }

    saving.value = true
    try {
        const device = await addDevice(userStore.userId, payload)
        ElMessage.success(t("device.addSuccess"))
        router.push(`/devices/${device.deviceId}`)
    } catch (error) {
        ElMessage.error(error.message || t("errors.unknown"))
    } finally {
        saving.value = false
    }
}
</script>

<style scoped>
.back-link {
    background: none;
    border: none;
    padding: 0;
    margin-bottom: 10px;
    font-size: 13px;
    color: var(--text-muted);
    cursor: pointer;
}

.back-link:hover {
    color: var(--brand);
}
</style>
