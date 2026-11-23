<template>
    <div class="page detail-page">
        <button class="back-link" type="button" @click="$router.push('/devices')">
            ← {{ $t("device.backToList") }}
        </button>

        <div v-if="loading" class="panel loading-panel" v-loading="true">
            <div class="loading-placeholder"></div>
        </div>

        <div v-else-if="loadError" class="panel error-panel">
            <div class="error-icon">!</div>
            <p>{{ loadError }}</p>
            <div class="error-actions">
                <el-button @click="$router.push('/devices')">{{ $t("device.backToList") }}</el-button>
                <el-button type="primary" @click="loadDevice">{{ $t("common.refresh") }}</el-button>
            </div>
        </div>

        <template v-else>
            <section class="device-hero">
                <div class="hero-main">
                    <div class="hero-avatar">{{ deviceEmoji(device.deviceType) }}</div>
                    <div class="hero-copy">
                        <div class="title-line">
                            <h1>{{ device.deviceName }}</h1>
                            <el-tag :type="statusType(device.status)" effect="light" round>
                                {{ statusLabel(device.status) }}
                            </el-tag>
                        </div>
                        <p class="hero-meta-line">
                            {{ typeLabel(device.deviceType) }}
                            <span>·</span>
                            {{ device.manufacturer || "-" }}
                            <span>·</span>
                            {{ device.model || "-" }}
                        </p>
                        <div class="hero-tags">
                            <span v-if="device.serialNumber">SN {{ device.serialNumber }}</span>
                            <span>{{ $t("device.createdAt") }} {{ formatDate(device.createdAt) }}</span>
                        </div>
                    </div>
                </div>

                <div class="hero-side">
                    <div class="hero-value">
                        <span>{{ $t("device.currentValue") }}</span>
                        <strong>{{ currency(device.currentValue) }}</strong>
                    </div>
                    <div class="hero-actions">
                        <el-button
                            v-if="supportsPowerShell"
                            type="warning"
                            plain
                            @click="powerShellDialogVisible = true"
                        >
                            {{ $t("device.powerShellCollect") }}
                        </el-button>
                        <el-button @click="$router.push(`/devices/${device.deviceId}/edit`)">
                            {{ $t("common.edit") }}
                        </el-button>
                        <el-button type="danger" plain @click="removeDevice">
                            {{ $t("common.delete") }}
                        </el-button>
                    </div>
                </div>
            </section>

            <div class="detail-grid">
                <div class="detail-main">
                    <section class="panel info-panel">
                        <div class="panel-header">
                            <h2 class="panel-title">{{ $t("device.basicInfo") }}</h2>
                        </div>

                        <el-descriptions :column="2" border class="detail-descriptions">
                            <el-descriptions-item :label="$t('device.type')">
                                {{ typeLabel(device.deviceType) }}
                            </el-descriptions-item>
                            <el-descriptions-item :label="$t('device.status')">
                                {{ statusLabel(device.status) }}
                            </el-descriptions-item>
                            <el-descriptions-item :label="$t('device.manufacturer')">
                                {{ device.manufacturer || "-" }}
                            </el-descriptions-item>
                            <el-descriptions-item :label="$t('device.model')">
                                {{ device.model || "-" }}
                            </el-descriptions-item>
                            <el-descriptions-item :label="$t('device.serialNumber')">
                                {{ device.serialNumber || "-" }}
                            </el-descriptions-item>
                            <el-descriptions-item :label="$t('device.os')">
                                {{ device.operatingSystem || "-" }}
                            </el-descriptions-item>
                            <el-descriptions-item :label="$t('device.cpu')">
                                {{ device.cpu || "-" }}
                            </el-descriptions-item>
                            <el-descriptions-item :label="$t('device.ram')">
                                {{ device.ramGb != null ? `${device.ramGb} GB` : "-" }}
                            </el-descriptions-item>
                            <el-descriptions-item :label="$t('device.storage')">
                                {{ device.storageGb != null ? `${device.storageGb} GB` : "-" }}
                            </el-descriptions-item>
                            <el-descriptions-item :label="$t('device.purchaseDate')">
                                {{ device.purchaseDate || "-" }}
                            </el-descriptions-item>
                            <el-descriptions-item :label="$t('device.purchasePrice')">
                                {{ currency(device.purchasePrice) }}
                            </el-descriptions-item>
                            <el-descriptions-item :label="$t('device.updatedAt')">
                                {{ formatDate(device.updatedAt) }}
                            </el-descriptions-item>
                        </el-descriptions>
                    </section>

                    <section class="panel events-panel">
                        <div class="panel-header">
                            <div>
                                <h2 class="panel-title">{{ $t("device.eventsTitle") }}</h2>
                                <p class="panel-hint">
                                    {{ $t("device.totalCost") }}:
                                    <strong>{{ currency(totalCost) }}</strong>
                                </p>
                            </div>
                            <el-button type="primary" plain @click="openEventDialog">
                                ＋ {{ $t("device.addEvent") }}
                            </el-button>
                        </div>

                        <el-table v-if="events.length" :data="events" class="events-table">
                            <el-table-column :label="$t('device.eventType')" width="110">
                                <template #default="{ row }">
                                    <el-tag :type="eventTagType(row.eventType)" effect="light" round>
                                        {{ eventTypeLabel(row.eventType) }}
                                    </el-tag>
                                </template>
                            </el-table-column>

                            <el-table-column :label="$t('device.eventTitle')" min-width="180">
                                <template #default="{ row }">
                                    <div class="event-title-cell">
                                        <strong>{{ row.title || "-" }}</strong>
                                        <small v-if="row.description">{{ row.description }}</small>
                                    </div>
                                </template>
                            </el-table-column>

                            <el-table-column :label="$t('device.eventDate')" width="130">
                                <template #default="{ row }">{{ row.eventDate || "-" }}</template>
                            </el-table-column>

                            <el-table-column :label="$t('device.eventCost')" width="130" align="right">
                                <template #default="{ row }">{{ currency(row.cost) }}</template>
                            </el-table-column>

                            <el-table-column :label="$t('common.actions')" width="90" align="right">
                                <template #default="{ row }">
                                    <el-button text type="danger" size="small" @click="removeEvent(row)">
                                        {{ $t("common.delete") }}
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>

                        <div v-else class="events-empty">
                            <span class="empty-icon">◷</span>
                            <p>{{ $t("device.noEvents") }}</p>
                            <el-button text type="primary" @click="openEventDialog">
                                ＋ {{ $t("device.addEvent") }}
                            </el-button>
                        </div>
                    </section>
                </div>

                <aside class="detail-side">
                    <section class="panel health-panel">
                        <div class="panel-header">
                            <div>
                                <h2 class="panel-title">{{ $t("device.healthTitle") }}</h2>
                                <p class="panel-hint">{{ $t("device.healthSubtitle") }}</p>
                            </div>
                            <el-button text type="primary" @click="openHealthDialog">
                                {{ $t("device.recordHealth") }}
                            </el-button>
                        </div>

                        <template v-if="health">
                            <div class="health-score-row">
                                <div
                                    class="score-ring"
                                    :style="{ background: scoreGradient }"
                                >
                                    <div class="score-inner">
                                        <strong>{{ scoreValue }}</strong>
                                        <span>{{ $t("device.score") }}</span>
                                    </div>
                                </div>
                                <div class="score-copy">
                                    <strong>{{ $t("device.healthScore") }}</strong>
                                    <span>{{ formatDate(health.checkedAt) }}</span>
                                    <small>{{ $t("device.checkedAt") }}</small>
                                </div>
                            </div>

                            <div class="metric-list">
                                <div class="metric-row">
                                    <div class="metric-head">
                                        <span>{{ $t("device.cpuUsage") }}</span>
                                        <b>{{ percent(health.cpuUsage) }}</b>
                                    </div>
                                    <el-progress
                                        :percentage="clampPercent(health.cpuUsage)"
                                        :stroke-width="6"
                                        :show-text="false"
                                        color="#315efb"
                                    />
                                </div>

                                <div class="metric-row">
                                    <div class="metric-head">
                                        <span>{{ $t("device.memoryUsage") }}</span>
                                        <b>{{ percent(health.memoryUsage) }}</b>
                                    </div>
                                    <el-progress
                                        :percentage="clampPercent(health.memoryUsage)"
                                        :stroke-width="6"
                                        :show-text="false"
                                        color="#7c5cff"
                                    />
                                </div>

                                <div class="metric-row">
                                    <div class="metric-head">
                                        <span>{{ $t("device.diskUsage") }}</span>
                                        <b>{{ percent(health.diskUsage) }}</b>
                                    </div>
                                    <el-progress
                                        :percentage="clampPercent(health.diskUsage)"
                                        :stroke-width="6"
                                        :show-text="false"
                                        color="#0ea5e9"
                                    />
                                </div>
                            </div>

                            <div class="health-meta">
                                <div>
                                    <span>{{ $t("device.cpuTemp") }}</span>
                                    <strong>{{ health.cpuTemperature != null ? `${health.cpuTemperature} ℃` : "-" }}</strong>
                                </div>
                                <div>
                                    <span>{{ $t("device.batteryHealth") }}</span>
                                    <strong>{{ percent(health.batteryHealth) }}</strong>
                                </div>
                                <div>
                                    <span>{{ $t("device.batteryCycles") }}</span>
                                    <strong>{{ health.batteryCycleCount ?? "-" }}</strong>
                                </div>
                            </div>
                        </template>

                        <div v-else class="health-empty">
                            <div class="empty-icon">♡</div>
                            <p>{{ $t("device.noHealth") }}</p>
                            <el-button size="small" type="primary" plain @click="openHealthDialog">
                                {{ $t("device.recordHealth") }}
                            </el-button>
                        </div>
                    </section>

                    <section class="panel value-panel">
                        <div class="panel-header">
                            <h2 class="panel-title">{{ $t("device.purchaseInfo") }}</h2>
                        </div>

                        <div class="value-row">
                            <span>{{ $t("device.purchasePrice") }}</span>
                            <strong>{{ currency(device.purchasePrice) }}</strong>
                        </div>
                        <div class="value-row">
                            <span>{{ $t("device.currentValue") }}</span>
                            <strong>{{ currency(device.currentValue) }}</strong>
                        </div>
                        <div class="value-row">
                            <span>{{ $t("device.purchaseDate") }}</span>
                            <strong>{{ device.purchaseDate || "-" }}</strong>
                        </div>
                        <div class="value-row">
                            <span>{{ $t("device.totalCost") }}</span>
                            <strong>{{ currency(totalCost) }}</strong>
                        </div>
                    </section>
                </aside>
            </div>
        </template>

        <el-dialog
            v-model="eventDialogVisible"
            :title="$t('device.addEvent')"
            width="520px"
            class="event-dialog"
            destroy-on-close
        >
            <el-form ref="eventFormRef" :model="eventForm" :rules="eventRules" label-position="top">
                <el-row :gutter="14">
                    <el-col :span="12">
                        <el-form-item :label="$t('device.eventType')" prop="eventType">
                            <el-select v-model="eventForm.eventType" style="width: 100%">
                                <el-option
                                    v-for="item in eventTypeOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('device.eventDate')" prop="eventDate">
                            <el-date-picker
                                v-model="eventForm.eventDate"
                                type="date"
                                value-format="YYYY-MM-DD"
                                format="YYYY-MM-DD"
                                style="width: 100%"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item :label="$t('device.eventTitle')" prop="title">
                    <el-input
                        v-model="eventForm.title"
                        :placeholder="$t('device.eventTitlePlaceholder')"
                        maxlength="200"
                    />
                </el-form-item>

                <el-form-item :label="$t('device.eventCost')" prop="cost">
                    <el-input-number
                        v-model="eventForm.cost"
                        :min="0"
                        :precision="2"
                        :step="50"
                        :controls="false"
                        style="width: 100%"
                    />
                </el-form-item>

                <el-form-item :label="$t('device.eventDescription')" prop="description">
                    <el-input
                        v-model="eventForm.description"
                        type="textarea"
                        :rows="3"
                        maxlength="2000"
                        show-word-limit
                    />
                </el-form-item>
            </el-form>

            <template #footer>
                <el-button @click="eventDialogVisible = false">{{ $t("common.cancel") }}</el-button>
                <el-button type="primary" :loading="eventSaving" @click="saveEvent">
                    {{ $t("common.save") }}
                </el-button>
            </template>
        </el-dialog>

        <el-dialog
            v-model="healthDialogVisible"
            :title="$t('device.recordHealth')"
            width="560px"
            destroy-on-close
        >
            <el-form ref="healthFormRef" :model="healthForm" label-position="top">
                <el-row :gutter="14">
                    <el-col :span="12">
                        <el-form-item :label="$t('device.cpuUsage')">
                            <el-input-number
                                v-model="healthForm.cpuUsage"
                                :min="0"
                                :max="100"
                                :precision="2"
                                :controls="false"
                                style="width: 100%"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('device.memoryUsage')">
                            <el-input-number
                                v-model="healthForm.memoryUsage"
                                :min="0"
                                :max="100"
                                :precision="2"
                                :controls="false"
                                style="width: 100%"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('device.diskUsage')">
                            <el-input-number
                                v-model="healthForm.diskUsage"
                                :min="0"
                                :max="100"
                                :precision="2"
                                :controls="false"
                                style="width: 100%"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('device.cpuTemp')">
                            <el-input-number
                                v-model="healthForm.cpuTemperature"
                                :min="0"
                                :precision="2"
                                :controls="false"
                                style="width: 100%"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('device.batteryHealth')">
                            <el-input-number
                                v-model="healthForm.batteryHealth"
                                :min="0"
                                :max="100"
                                :precision="2"
                                :controls="false"
                                style="width: 100%"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('device.batteryCycles')">
                            <el-input-number
                                v-model="healthForm.batteryCycleCount"
                                :min="0"
                                :precision="0"
                                :controls="false"
                                style="width: 100%"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item :label="$t('device.healthScore')">
                    <el-input-number
                        v-model="healthForm.healthScore"
                        :min="0"
                        :max="100"
                        :precision="2"
                        :controls="false"
                        style="width: 100%"
                    />
                </el-form-item>
            </el-form>

            <template #footer>
                <el-button @click="healthDialogVisible = false">{{ $t("common.cancel") }}</el-button>
                <el-button type="primary" :loading="healthSaving" @click="saveHealth">
                    {{ $t("common.save") }}
                </el-button>
            </template>
        </el-dialog>

        <el-dialog
            v-model="powerShellDialogVisible"
            :title="$t('device.powerShellTitle')"
            width="760px"
            destroy-on-close
        >
            <el-alert
                :title="$t('device.powerShellIntro')"
                type="info"
                :closable="false"
                show-icon
            />
            <ol class="powershell-steps">
                <li>{{ $t("device.powerShellStep1") }}</li>
                <li>{{ $t("device.powerShellStep2") }}</li>
                <li>{{ $t("device.powerShellStep3") }}</li>
            </ol>
            <el-input
                :model-value="powerShellCommand"
                type="textarea"
                :rows="4"
                readonly
            />
            <p class="powershell-note">{{ $t("device.powerShellPasswordNote") }}</p>

            <template #footer>
                <el-button @click="powerShellDialogVisible = false">{{ $t("common.cancel") }}</el-button>
                <el-button @click="copyPowerShellCommand">{{ $t("device.powerShellCopy") }}</el-button>
                <el-button type="primary" @click="refreshAfterPowerShell">
                    {{ $t("device.powerShellRefresh") }}
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import { ElMessage, ElMessageBox } from "element-plus"

import {
    addDeviceEvent,
    deleteDevice,
    deleteDeviceEvent,
    getDevice,
    getDeviceEvents,
    getDeviceHealth,
    getDeviceTotalCost,
    saveDeviceHealth
} from "../api/device"
import { getCurrentUserId } from "../utils/session"

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()

const deviceId = route.params.id

const device = ref({})
const health = ref(null)
const events = ref([])
const totalCost = ref(0)
const loading = ref(false)
const loadError = ref("")

const eventDialogVisible = ref(false)
const eventSaving = ref(false)
const eventFormRef = ref(null)
const eventForm = reactive({
    eventType: "REPAIR",
    title: "",
    eventDate: today(),
    cost: null,
    description: ""
})

const healthDialogVisible = ref(false)
const healthSaving = ref(false)
const healthFormRef = ref(null)
const powerShellDialogVisible = ref(false)
const healthForm = reactive({
    cpuUsage: null,
    memoryUsage: null,
    diskUsage: null,
    cpuTemperature: null,
    batteryHealth: null,
    batteryCycleCount: null,
    healthScore: null
})

const PUBLIC_API_BASE_URL = "https://frp-air.com:40538/api"

const supportsPowerShell = computed(() =>
    ["LAPTOP", "DESKTOP"].includes(device.value.deviceType)
)

const powerShellCommand = computed(() => {
    const userId = getCurrentUserId() || "<登录后自动填充>"
    const type = device.value.deviceType || "LAPTOP"
    return `powershell -NoProfile -ExecutionPolicy Bypass -File ".\\Collect-DeviceInfo.ps1" -UserId ${userId} -DeviceId ${deviceId} -ApiBaseUrl "${PUBLIC_API_BASE_URL}" -DeviceType ${type}`
})

const eventTypeOptions = computed(() =>
    ["PURCHASE", "REPAIR", "UPGRADE", "MAINTENANCE", "SALE"].map(value => ({
        value,
        label: t(`device.eventTypes.${value}`)
    }))
)

const eventRules = computed(() => ({
    eventType: [{ required: true, message: t("device.eventType"), trigger: "change" }],
    eventDate: [{ required: true, message: t("device.eventDate"), trigger: "change" }],
    title: [{ required: true, message: t("device.eventTitle"), trigger: "blur" }]
}))

const scoreValue = computed(() => {
    const score = Number(health.value?.healthScore)
    return Number.isFinite(score) ? Math.round(score) : "-"
})

const scoreColor = computed(() => {
    const score = Number(health.value?.healthScore)
    if (!Number.isFinite(score)) return "#94a3b8"
    if (score >= 80) return "#10b981"
    if (score >= 60) return "#f59e0b"
    return "#ef4444"
})

const scoreGradient = computed(() => {
    const score = Math.min(Math.max(Number(health.value?.healthScore) || 0, 0), 100)
    return `conic-gradient(${scoreColor.value} ${score * 3.6}deg, #eef1f6 0deg)`
})

function today() {
    const date = new Date()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${date.getFullYear()}-${month}-${day}`
}

function currency(value) {
    return `¥${Number(value || 0).toLocaleString(locale.value, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`
}

function typeLabel(type) {
    return type ? t(`deviceType.${type}`) : "-"
}

function statusLabel(status) {
    return status ? t(`status.${status}`) : "-"
}

function statusType(status) {
    return {
        ACTIVE: "primary",
        IDLE: "warning",
        REPAIR: "danger",
        SOLD: "success",
        RETIRED: "info"
    }[status] || "info"
}

function eventTypeLabel(type) {
    return type ? t(`device.eventTypes.${type}`) : "-"
}

function eventTagType(type) {
    return {
        PURCHASE: "primary",
        REPAIR: "danger",
        UPGRADE: "warning",
        MAINTENANCE: "success",
        SALE: "info"
    }[type] || "info"
}

function deviceEmoji(type) {
    return {
        LAPTOP: "💻",
        PHONE: "📱",
        DESKTOP: "🖥️",
        TABLET: "📟",
        CAMERA: "📷",
        OTHER: "📦"
    }[type] || "📦"
}

function formatDate(value) {
    if (!value) return "-"
    const date = new Date(String(value).replace(" ", "T"))
    if (Number.isNaN(date.getTime())) return String(value)
    return date.toLocaleString(locale.value, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    })
}

function percent(value) {
    return value == null ? "-" : `${Number(value)}${t("device.percent")}`
}

function clampPercent(value) {
    const number = Number(value)
    if (!Number.isFinite(number)) return 0
    return Math.min(Math.max(number, 0), 100)
}

function sumEventsCost(list) {
    return list.reduce((sum, item) => sum + Number(item.cost || 0), 0)
}

async function loadDevice() {
    loading.value = true
    loadError.value = ""

    try {
        device.value = await getDevice(deviceId)
    } catch (error) {
        loadError.value = error.message || t("device.loadDetailFailed")
        loading.value = false
        return
    }

    const [healthResult, eventsResult, costResult] = await Promise.allSettled([
        getDeviceHealth(deviceId),
        getDeviceEvents(deviceId),
        getDeviceTotalCost(deviceId)
    ])

    health.value = healthResult.status === "fulfilled" ? healthResult.value : null

    if (eventsResult.status === "fulfilled") {
        events.value = eventsResult.value || []
    } else {
        events.value = []
        ElMessage.warning(t("device.eventLoadFailed"))
    }

    if (costResult.status === "fulfilled") {
        totalCost.value = Number(costResult.value || 0)
    } else {
        totalCost.value = sumEventsCost(events.value)
    }

    loading.value = false
}

function openEventDialog() {
    eventForm.eventType = "REPAIR"
    eventForm.title = ""
    eventForm.eventDate = today()
    eventForm.cost = null
    eventForm.description = ""
    eventDialogVisible.value = true
}

async function saveEvent() {
    if (!eventFormRef.value) return

    try {
        await eventFormRef.value.validate()
    } catch (e) {
        return
    }

    eventSaving.value = true
    try {
        await addDeviceEvent(deviceId, {
            eventType: eventForm.eventType,
            title: eventForm.title.trim(),
            eventDate: eventForm.eventDate,
            cost: eventForm.cost,
            description: eventForm.description.trim() || null
        })
        ElMessage.success(t("device.eventSaved"))
        eventDialogVisible.value = false
        await refreshEvents()
    } catch (error) {
        ElMessage.error(error.message || t("errors.unknown"))
    } finally {
        eventSaving.value = false
    }
}

async function refreshEvents() {
    try {
        const [eventList, cost] = await Promise.all([
            getDeviceEvents(deviceId),
            getDeviceTotalCost(deviceId)
        ])
        events.value = eventList || []
        totalCost.value = Number(cost || 0)
    } catch (error) {
        ElMessage.error(error.message || t("device.eventLoadFailed"))
    }
}

async function removeEvent(row) {
    try {
        await ElMessageBox.confirm(
            t("device.deleteEventConfirm"),
            t("device.confirmDeleteEvent"),
            {
                confirmButtonText: t("common.confirm"),
                cancelButtonText: t("common.cancel"),
                type: "warning"
            }
        )
    } catch (e) {
        return
    }

    try {
        await deleteDeviceEvent(deviceId, row.eventId)
        ElMessage.success(t("device.eventDeleteSuccess"))
        await refreshEvents()
    } catch (error) {
        ElMessage.error(error.message || t("device.deleteEventFailed"))
    }
}

function openHealthDialog() {
    healthForm.cpuUsage = health.value?.cpuUsage != null ? Number(health.value.cpuUsage) : null
    healthForm.memoryUsage = health.value?.memoryUsage != null ? Number(health.value.memoryUsage) : null
    healthForm.diskUsage = health.value?.diskUsage != null ? Number(health.value.diskUsage) : null
    healthForm.cpuTemperature =
        health.value?.cpuTemperature != null ? Number(health.value.cpuTemperature) : null
    healthForm.batteryHealth =
        health.value?.batteryHealth != null ? Number(health.value.batteryHealth) : null
    healthForm.batteryCycleCount = health.value?.batteryCycleCount ?? null
    healthForm.healthScore =
        health.value?.healthScore != null ? Number(health.value.healthScore) : null
    healthDialogVisible.value = true
}

async function saveHealth() {
    healthSaving.value = true
    try {
        health.value = await saveDeviceHealth(deviceId, { ...healthForm })
        ElMessage.success(t("device.healthSaved"))
        healthDialogVisible.value = false
    } catch (error) {
        ElMessage.error(error.message || t("errors.unknown"))
    } finally {
        healthSaving.value = false
    }
}

async function copyPowerShellCommand() {
    try {
        await navigator.clipboard.writeText(powerShellCommand.value)
        ElMessage.success(t("device.powerShellCopied"))
    } catch {
        ElMessage.warning(t("device.powerShellCopyFailed"))
    }
}

async function refreshAfterPowerShell() {
    powerShellDialogVisible.value = false
    await loadDevice()
    ElMessage.success(t("device.powerShellRefreshDone"))
}

async function removeDevice() {
    try {
        await ElMessageBox.confirm(
            t("device.deleteConfirm", { name: device.value.deviceName }),
            t("common.delete"),
            {
                confirmButtonText: t("common.confirm"),
                cancelButtonText: t("common.cancel"),
                type: "warning"
            }
        )
    } catch (e) {
        return
    }

    try {
        await deleteDevice(deviceId)
        ElMessage.success(t("device.deleteSuccess"))
        router.replace("/devices")
    } catch (error) {
        ElMessage.error(error.message || t("errors.unknown"))
    }
}

onMounted(loadDevice)
</script>

<style scoped>
.back-link {
    background: none;
    border: none;
    padding: 0;
    margin-bottom: 14px;
    font-size: 13px;
    color: var(--text-muted);
    cursor: pointer;
}

.back-link:hover {
    color: var(--brand);
}

.loading-panel {
    min-height: 400px;
    padding: 30px;
}

.loading-placeholder {
    height: 340px;
}

.error-panel {
    padding: 54px 30px;
    text-align: center;
    color: var(--text-muted);
}

.error-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 14px;
    border-radius: 50%;
    background: #fef2f2;
    color: #ef4444;
    font-size: 22px;
    font-weight: 700;
}

.error-actions {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-top: 20px;
}

.device-hero {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    padding: 28px 30px;
    border-radius: 22px;
    background:
        radial-gradient(circle at 88% 12%, rgba(255, 255, 255, 0.22), transparent 34%),
        linear-gradient(120deg, #172a55, #2c54b7 68%, #4f72e8);
    color: #fff;
    box-shadow: 0 18px 40px rgba(29, 60, 130, 0.2);
}

.hero-main {
    display: flex;
    gap: 18px;
    min-width: 0;
}

.hero-avatar {
    width: 72px;
    height: 72px;
    flex: 0 0 72px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.14);
    border: 1px solid rgba(255, 255, 255, 0.2);
    font-size: 32px;
    backdrop-filter: blur(8px);
}

.hero-copy {
    min-width: 0;
}

.title-line {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
}

.title-line h1 {
    font-size: clamp(23px, 2.6vw, 31px);
    font-weight: 750;
    letter-spacing: -0.5px;
    color: #fff;
    word-break: break-word;
}

.hero-meta-line {
    margin-top: 7px;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.66);
}

.hero-meta-line span {
    margin: 0 5px;
    opacity: 0.5;
}

.hero-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 14px;
}

.hero-tags span {
    font-size: 11px;
    padding: 5px 9px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.75);
}

.hero-side {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-between;
    gap: 18px;
    flex: 0 0 auto;
}

.hero-value {
    text-align: right;
}

.hero-value span {
    display: block;
    font-size: 11px;
    letter-spacing: 0.6px;
    color: rgba(255, 255, 255, 0.55);
}

.hero-value strong {
    display: block;
    margin-top: 4px;
    font-size: 25px;
    font-weight: 750;
    letter-spacing: -0.5px;
}

.hero-actions {
    display: flex;
    gap: 8px;
}

.hero-actions :deep(.el-button) {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.22);
    color: #fff;
}

.hero-actions :deep(.el-button:hover) {
    background: rgba(255, 255, 255, 0.18);
    border-color: rgba(255, 255, 255, 0.4);
    color: #fff;
}

.hero-actions :deep(.el-button--danger) {
    background: rgba(239, 68, 68, 0.18);
    border-color: rgba(255, 255, 255, 0.22);
}

.powershell-steps {
    margin: 18px 0;
    padding-left: 22px;
    line-height: 1.9;
}

.powershell-note {
    margin: 12px 0 0;
    color: #64748b;
    font-size: 13px;
    line-height: 1.6;
}

.detail-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.55fr) minmax(300px, 1fr);
    gap: 20px;
    margin-top: 20px;
}

.detail-main,
.detail-side {
    display: flex;
    flex-direction: column;
    gap: 20px;
    min-width: 0;
}

.info-panel,
.events-panel,
.health-panel,
.value-panel {
    padding: 24px;
}

.panel-hint {
    margin-top: 5px;
    font-size: 12px;
    color: var(--text-muted);
}

.panel-hint strong {
    color: var(--text-main);
}

.detail-descriptions :deep(.el-descriptions__label) {
    width: 118px;
    color: var(--text-muted);
    font-weight: 500;
}

.detail-descriptions :deep(.el-descriptions__content) {
    color: var(--text-main);
}

.event-title-cell {
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.event-title-cell strong {
    font-size: 13px;
    font-weight: 600;
}

.event-title-cell small {
    margin-top: 3px;
    font-size: 11px;
    color: var(--text-muted);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 300px;
}

.events-empty,
.health-empty {
    padding: 36px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    color: var(--text-muted);
    font-size: 13px;
}

.empty-icon {
    font-size: 32px;
    color: #d5dce8;
}

.health-score-row {
    display: flex;
    align-items: center;
    gap: 18px;
    padding: 6px 0 20px;
    border-bottom: 1px dashed var(--border);
}

.score-ring {
    width: 110px;
    height: 110px;
    flex: 0 0 110px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.score-ring::after {
    content: "";
    position: absolute;
    inset: 9px;
    background: #fff;
    border-radius: 50%;
}

.score-inner {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: baseline;
    gap: 2px;
}

.score-inner strong {
    font-size: 29px;
    font-weight: 750;
    letter-spacing: -1px;
    color: var(--text-main);
}

.score-inner span {
    font-size: 11px;
    color: var(--text-muted);
}

.score-copy {
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.score-copy strong {
    font-size: 14px;
    font-weight: 650;
}

.score-copy span {
    margin-top: 5px;
    font-size: 12px;
    color: var(--text-regular);
}

.score-copy small {
    margin-top: 3px;
    font-size: 10px;
    color: var(--text-muted);
}

.metric-list {
    padding: 18px 0 6px;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.metric-head {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: var(--text-muted);
    margin-bottom: 6px;
}

.metric-head b {
    color: var(--text-main);
    font-weight: 600;
}

.health-meta {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    padding-top: 14px;
    border-top: 1px dashed var(--border);
}

.health-meta div {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.health-meta span {
    font-size: 10px;
    color: var(--text-muted);
}

.health-meta strong {
    font-size: 13px;
    font-weight: 650;
}

.value-row {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding: 11px 0;
    font-size: 12px;
    color: var(--text-muted);
    border-bottom: 1px dashed var(--border);
}

.value-row:last-child {
    border-bottom: none;
    padding-bottom: 0;
}

.value-row strong {
    color: var(--text-main);
    font-weight: 650;
    text-align: right;
}

@media (max-width: 1080px) {
    .detail-grid {
        grid-template-columns: 1fr;
    }

    .detail-side {
        display: grid;
        grid-template-columns: 1fr 1fr;
        align-items: start;
    }
}

@media (max-width: 760px) {
    .device-hero {
        flex-direction: column;
        padding: 22px;
    }

    .hero-avatar {
        width: 58px;
        height: 58px;
        flex-basis: 58px;
        font-size: 26px;
    }

    .hero-side {
        align-items: flex-start;
        flex-direction: row;
        flex-wrap: wrap;
        width: 100%;
    }

    .hero-value {
        text-align: left;
    }

    .hero-actions {
        margin-left: auto;
    }

    .detail-side {
        grid-template-columns: 1fr;
    }

    .info-panel,
    .events-panel,
    .health-panel,
    .value-panel {
        padding: 18px;
    }

    .detail-descriptions :deep(.el-descriptions__label) {
        width: 92px;
    }

    .events-panel {
        overflow-x: auto;
    }
}
</style>
