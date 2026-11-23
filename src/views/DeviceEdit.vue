<template>
    <div class="page">
        <div class="page-header">
            <div>
                <button class="back-link" type="button" @click="goBack">
                    ← {{ $t("device.backToList") }}
                </button>
                <h1 class="page-title">{{ $t("device.editTitle") }}</h1>
                <p class="page-subtitle">{{ $t("device.editSubtitle") }}</p>
            </div>
        </div>

        <div v-if="loading" class="panel loading-panel" v-loading="true">
            <div class="loading-placeholder"></div>
        </div>

        <div v-else-if="loadError" class="panel error-panel">
            <p>{{ loadError }}</p>
            <div class="error-actions">
                <el-button @click="$router.push('/devices')">{{ $t("device.backToList") }}</el-button>
                <el-button type="primary" @click="loadDevice">{{ $t("common.refresh") }}</el-button>
            </div>
        </div>

        <DeviceForm
            v-else
            mode="edit"
            :initial="device"
            :loading="saving"
            @submit="submit"
            @cancel="goBack"
        />
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import { ElMessage } from "element-plus"

import DeviceForm from "../components/DeviceForm.vue"
import { getDevice, updateDevice } from "../api/device"

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const device = ref({})
const loading = ref(false)
const saving = ref(false)
const loadError = ref("")

const deviceId = route.params.id

function goBack() {
    if (deviceId) {
        router.push(`/devices/${deviceId}`)
    } else {
        router.push("/devices")
    }
}

async function loadDevice() {
    loading.value = true
    loadError.value = ""

    try {
        device.value = await getDevice(deviceId)
    } catch (error) {
        loadError.value = error.message || t("device.loadDetailFailed")
    } finally {
        loading.value = false
    }
}

async function submit(payload) {
    if (saving.value) return

    saving.value = true
    try {
        await updateDevice(deviceId, payload)
        ElMessage.success(t("device.updateSuccess"))
        router.push(`/devices/${deviceId}`)
    } catch (error) {
        ElMessage.error(error.message || t("errors.unknown"))
    } finally {
        saving.value = false
    }
}

onMounted(loadDevice)
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

.loading-panel {
    min-height: 360px;
    padding: 30px;
}

.loading-placeholder {
    height: 300px;
}

.error-panel {
    padding: 46px 30px;
    text-align: center;
    color: var(--text-muted);
}

.error-actions {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-top: 20px;
}
</style>
