<template>
    <div class="page dashboard">
        <section class="hero-panel">
            <div class="hero-copy">
                <p class="eyebrow">OVERVIEW</p>
                <h1>{{ greeting }}</h1>
                <p class="hero-subtitle">{{ $t("dashboard.subtitle") }}</p>

                <div class="hero-actions">
                    <el-button type="primary" size="large" @click="$router.push('/devices/new')">
                        ＋ {{ $t("dashboard.addDevice") }}
                    </el-button>
                    <el-button size="large" plain @click="$router.push('/devices')">
                        {{ $t("dashboard.viewDevices") }}
                    </el-button>
                </div>
            </div>

            <div class="hero-art" aria-hidden="true">
                <div class="art-ring"></div>
                <div class="art-device">💻</div>
                <span class="art-chip chip-one">CPU</span>
                <span class="art-chip chip-two">SSD</span>
                <span class="art-chip chip-three">100%</span>
            </div>
        </section>

        <section class="stat-grid">
            <article class="stat-card">
                <div class="stat-top">
                    <span class="stat-icon blue">▤</span>
                    <span class="stat-label">{{ $t("dashboard.deviceCount") }}</span>
                </div>
                <strong class="stat-value">{{ devices.length }}</strong>
                <span class="stat-foot">{{ $t("device.listSubtitle") }}</span>
            </article>

            <article class="stat-card">
                <div class="stat-top">
                    <span class="stat-icon amber">¥</span>
                    <span class="stat-label">{{ $t("dashboard.purchaseValue") }}</span>
                </div>
                <strong class="stat-value">{{ currency(totalPrice) }}</strong>
                <span class="stat-foot">{{ $t("device.purchasePrice") }}</span>
            </article>

            <article class="stat-card">
                <div class="stat-top">
                    <span class="stat-icon green">↗</span>
                    <span class="stat-label">{{ $t("dashboard.currentValue") }}</span>
                </div>
                <strong class="stat-value">{{ currency(currentValue) }}</strong>
                <span class="stat-foot">{{ $t("device.currentValue") }}</span>
            </article>

            <article class="stat-card accent-card">
                <div class="stat-top">
                    <span class="stat-icon white">◈</span>
                    <span class="stat-label">{{ $t("dashboard.statusTitle") }}</span>
                </div>
                <strong class="stat-value">{{ activeCount }}</strong>
                <span class="stat-foot">{{ $t("status.ACTIVE") }}</span>
            </article>
        </section>

        <div class="dashboard-grid">
            <section class="panel chart-panel" v-loading="loading">
                <div class="panel-header">
                    <div>
                        <h2 class="panel-title">{{ $t("dashboard.statusTitle") }}</h2>
                        <p class="panel-hint">{{ $t("device.listSubtitle") }}</p>
                    </div>
                    <el-tag round effect="plain">{{ devices.length }} {{ $t("dashboard.deviceCount") }}</el-tag>
                </div>

                <div v-if="devices.length" ref="chartDom" class="chart"></div>
                <div v-else class="chart-empty">
                    <div class="empty-icon">◔</div>
                    <p>{{ $t("dashboard.statusEmpty") }}</p>
                </div>

                <div v-if="devices.length" class="status-legend">
                    <span v-for="item in statusSummary" :key="item.key" class="legend-item">
                        <i :style="{ background: item.color }"></i>
                        {{ item.label }}
                        <b>{{ item.value }}</b>
                    </span>
                </div>
            </section>

            <section class="panel quick-panel">
                <div class="panel-header">
                    <h2 class="panel-title">{{ $t("dashboard.quickActions") }}</h2>
                </div>

                <button class="quick-item" type="button" @click="$router.push('/devices/new')">
                    <span class="quick-icon">＋</span>
                    <span class="quick-copy">
                        <strong>{{ $t("dashboard.addDevice") }}</strong>
                        <small>{{ $t("device.addSubtitle") }}</small>
                    </span>
                    <span class="quick-arrow">→</span>
                </button>

                <button class="quick-item" type="button" @click="$router.push('/devices')">
                    <span class="quick-icon">▤</span>
                    <span class="quick-copy">
                        <strong>{{ $t("dashboard.viewDevices") }}</strong>
                        <small>{{ $t("device.listSubtitle") }}</small>
                    </span>
                    <span class="quick-arrow">→</span>
                </button>

                <button class="quick-item" type="button" @click="$router.push('/profile')">
                    <span class="quick-icon">◉</span>
                    <span class="quick-copy">
                        <strong>{{ $t("dashboard.profile") }}</strong>
                        <small>{{ $t("profile.basicHint") }}</small>
                    </span>
                    <span class="quick-arrow">→</span>
                </button>
            </section>
        </div>

        <section class="panel recent-panel">
            <div class="panel-header">
                <h2 class="panel-title">{{ $t("dashboard.recentTitle") }}</h2>
                <el-button text type="primary" @click="$router.push('/devices')">
                    {{ $t("dashboard.viewAll") }} →
                </el-button>
            </div>

            <el-table
                v-if="recentDevices.length"
                :data="recentDevices"
                class="recent-table"
                @row-click="row => $router.push(`/devices/${row.deviceId}`)"
            >
                <el-table-column :label="$t('device.name')" min-width="190">
                    <template #default="{ row }">
                        <div class="device-cell">
                            <span class="device-avatar">{{ deviceEmoji(row.deviceType) }}</span>
                            <div>
                                <strong>{{ row.deviceName }}</strong>
                                <small>{{ row.manufacturer || "-" }} {{ row.model || "" }}</small>
                            </div>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column :label="$t('device.type')" width="130">
                    <template #default="{ row }">{{ typeLabel(row.deviceType) }}</template>
                </el-table-column>

                <el-table-column :label="$t('device.status')" width="120">
                    <template #default="{ row }">
                        <el-tag :type="statusType(row.status)" effect="light" round>
                            {{ statusLabel(row.status) }}
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column :label="$t('device.currentValue')" width="150" align="right">
                    <template #default="{ row }">{{ currency(row.currentValue) }}</template>
                </el-table-column>

                <el-table-column :label="$t('device.createdAt')" width="170">
                    <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
                </el-table-column>
            </el-table>

            <div v-else class="empty-tip">
                <p class="empty-title">{{ $t("dashboard.noDevices") }}</p>
                <p>{{ $t("dashboard.noDevicesHint") }}</p>
                <el-button type="primary" class="empty-button" @click="$router.push('/devices/new')">
                    {{ $t("device.addFirst") }}
                </el-button>
            </div>
        </section>
    </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import { ElMessage } from "element-plus"
import * as echarts from "echarts"

import { getDevices } from "../api/device"
import { useUserStore } from "../store/user"

const { t, locale } = useI18n()
const userStore = useUserStore()

const devices = ref([])
const loading = ref(false)
const chartDom = ref(null)
let chart = null

const statusColors = {
    ACTIVE: "#315efb",
    IDLE: "#f59e0b",
    REPAIR: "#ef4444",
    SOLD: "#10b981",
    RETIRED: "#8a94a6"
}

const statusOrder = ["ACTIVE", "IDLE", "REPAIR", "SOLD", "RETIRED"]

const displayName = computed(() => userStore.displayName || userStore.user?.username || "")
const greeting = computed(() => t("dashboard.greeting", { name: displayName.value }))
const totalPrice = computed(() =>
    devices.value.reduce((sum, item) => sum + Number(item.purchasePrice || 0), 0)
)
const currentValue = computed(() =>
    devices.value.reduce((sum, item) => sum + Number(item.currentValue || 0), 0)
)
const activeCount = computed(
    () => devices.value.filter(item => item.status === "ACTIVE").length
)

const recentDevices = computed(() =>
    [...devices.value]
        .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))
        .slice(0, 5)
)

const statusSummary = computed(() =>
    statusOrder
        .map(key => ({
            key,
            label: t(`status.${key}`),
            color: statusColors[key],
            value: devices.value.filter(item => item.status === key).length
        }))
        .filter(item => item.value > 0)
)

function currency(value) {
    const number = Number(value || 0)
    return `¥${number.toLocaleString(locale.value, {
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

function drawChart() {
    if (!chartDom.value || !devices.value.length) return

    if (!chart) {
        chart = echarts.init(chartDom.value)
    }

    chart.setOption(
        {
            tooltip: {
                trigger: "item",
                formatter: "{b}: {c} ({d}%)"
            },
            series: [
                {
                    type: "pie",
                    radius: ["55%", "78%"],
                    center: ["50%", "50%"],
                    avoidLabelOverlap: true,
                    itemStyle: {
                        borderColor: "#fff",
                        borderWidth: 4,
                        borderRadius: 8
                    },
                    label: {
                        show: true,
                        formatter: "{b}\n{c}",
                        color: "#4b5563",
                        fontSize: 12,
                        lineHeight: 18
                    },
                    labelLine: {
                        length: 12,
                        length2: 10
                    },
                    data: statusSummary.value.map(item => ({
                        name: item.label,
                        value: item.value,
                        itemStyle: { color: item.color }
                    }))
                }
            ]
        },
        true
    )
}

function resizeChart() {
    chart?.resize()
}

async function loadDevices() {
    if (!userStore.userId) return

    loading.value = true
    try {
        devices.value = (await getDevices(userStore.userId)) || []
    } catch (error) {
        devices.value = []
        ElMessage.error(error.message || t("dashboard.loadFailed"))
    } finally {
        loading.value = false
        await nextTick()
        drawChart()
    }
}

watch(locale, async () => {
    await nextTick()
    drawChart()
})

onMounted(async () => {
    await loadDevices()
    window.addEventListener("resize", resizeChart)
})

onBeforeUnmount(() => {
    window.removeEventListener("resize", resizeChart)
    chart?.dispose()
    chart = null
})
</script>

<style scoped>
.hero-panel {
    position: relative;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    gap: 24px;
    padding: 34px 36px;
    border-radius: 24px;
    background:
        radial-gradient(circle at 82% 20%, rgba(126, 160, 255, 0.32), transparent 36%),
        linear-gradient(120deg, #16264c 0%, #274aa6 62%, #4b6ee8 100%);
    color: #fff;
    box-shadow: 0 18px 40px rgba(29, 60, 130, 0.22);
}

.eyebrow {
    font-size: 10px;
    letter-spacing: 3px;
    font-weight: 700;
    opacity: 0.55;
    margin-bottom: 10px;
}

.hero-copy h1 {
    font-size: clamp(26px, 3.4vw, 38px);
    line-height: 1.2;
    font-weight: 750;
    letter-spacing: -0.6px;
    color: #fff;
}

.hero-subtitle {
    margin-top: 8px;
    font-size: 14px;
    opacity: 0.7;
    max-width: 520px;
    line-height: 1.7;
}

.hero-actions {
    display: flex;
    gap: 12px;
    margin-top: 24px;
    flex-wrap: wrap;
}

.hero-actions :deep(.el-button--primary) {
    background: #fff;
    border-color: #fff;
    color: #1e3c72;
    font-weight: 650;
}

.hero-actions :deep(.el-button--primary:hover) {
    background: #eef3ff;
    border-color: #eef3ff;
    color: #1e3c72;
}

.hero-actions :deep(.el-button.is-plain) {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.24);
    color: #fff;
}

.hero-actions :deep(.el-button.is-plain:hover) {
    background: rgba(255, 255, 255, 0.16);
    border-color: rgba(255, 255, 255, 0.4);
    color: #fff;
}

.hero-art {
    position: relative;
    width: 230px;
    flex: 0 0 230px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.art-ring {
    width: 170px;
    height: 170px;
    border-radius: 50%;
    border: 1px dashed rgba(255, 255, 255, 0.3);
    position: absolute;
    animation: spin 26s linear infinite;
}

.art-device {
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 42px;
    background: rgba(255, 255, 255, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 28px;
    backdrop-filter: blur(8px);
}

.art-chip {
    position: absolute;
    font-size: 10px;
    letter-spacing: 0.6px;
    padding: 5px 9px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.14);
    border: 1px solid rgba(255, 255, 255, 0.16);
    backdrop-filter: blur(6px);
}

.chip-one {
    top: 24px;
    left: 8px;
}

.chip-two {
    bottom: 28px;
    right: 8px;
}

.chip-three {
    bottom: 44px;
    left: 0;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.stat-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-top: 20px;
}

.stat-card {
    padding: 20px;
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 18px;
    box-shadow: var(--shadow-card);
    display: flex;
    flex-direction: column;
    min-height: 142px;
}

.stat-top {
    display: flex;
    align-items: center;
    gap: 9px;
}

.stat-icon {
    width: 30px;
    height: 30px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 9px;
    font-size: 13px;
    font-weight: 700;
}

.stat-icon.blue {
    background: #eef3ff;
    color: #315efb;
}

.stat-icon.amber {
    background: #fff7e6;
    color: #d97706;
}

.stat-icon.green {
    background: #e9fbf3;
    color: #059669;
}

.stat-icon.white {
    background: rgba(255, 255, 255, 0.18);
    color: #fff;
}

.stat-label {
    font-size: 13px;
    color: var(--text-muted);
}

.stat-value {
    margin-top: auto;
    padding-top: 16px;
    font-size: 28px;
    line-height: 1.15;
    font-weight: 750;
    letter-spacing: -0.8px;
    color: var(--text-main);
}

.stat-foot {
    margin-top: 6px;
    font-size: 11px;
    color: #a3adbd;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.accent-card {
    background: linear-gradient(145deg, #315efb, #5b7bff);
    border-color: transparent;
    color: #fff;
}

.accent-card .stat-label,
.accent-card .stat-foot {
    color: rgba(255, 255, 255, 0.7);
}

.accent-card .stat-value {
    color: #fff;
}

.dashboard-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.55fr) minmax(280px, 1fr);
    gap: 20px;
    margin-top: 20px;
}

.chart-panel {
    padding: 24px;
    min-height: 390px;
}

.chart {
    height: 280px;
    width: 100%;
}

.chart-empty {
    height: 280px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    font-size: 14px;
    gap: 10px;
}

.empty-icon {
    font-size: 38px;
    color: #d7deea;
}

.status-legend {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    padding-top: 14px;
    border-top: 1px solid var(--border);
}

.legend-item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--text-muted);
}

.legend-item i {
    width: 8px;
    height: 8px;
    border-radius: 3px;
    display: inline-block;
}

.legend-item b {
    color: var(--text-main);
    margin-left: 2px;
}

.panel-hint {
    margin-top: 5px;
    font-size: 12px;
    color: var(--text-muted);
}

.quick-panel {
    padding: 24px;
}

.quick-item {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 12px;
    margin-bottom: 8px;
    border: 1px solid transparent;
    border-radius: 14px;
    background: #f8faff;
    text-align: left;
    cursor: pointer;
    transition: 0.2s ease;
}

.quick-item:hover {
    background: #fff;
    border-color: #d8e2ff;
    box-shadow: 0 8px 20px rgba(49, 94, 251, 0.08);
    transform: translateY(-1px);
}

.quick-icon {
    width: 38px;
    height: 38px;
    flex: 0 0 38px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 11px;
    background: #eef3ff;
    color: var(--brand);
    font-size: 17px;
}

.quick-copy {
    display: flex;
    flex-direction: column;
    min-width: 0;
    flex: 1;
}

.quick-copy strong {
    font-size: 13px;
    font-weight: 650;
    color: var(--text-main);
}

.quick-copy small {
    margin-top: 3px;
    font-size: 11px;
    color: var(--text-muted);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.quick-arrow {
    color: #b3bdcc;
    font-size: 14px;
}

.recent-panel {
    padding: 24px;
    margin-top: 20px;
}

.device-cell {
    display: flex;
    align-items: center;
    gap: 10px;
}

.device-avatar {
    width: 34px;
    height: 34px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background: #f2f5fb;
    font-size: 16px;
    flex: 0 0 34px;
}

.device-cell div {
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.device-cell strong {
    font-size: 13px;
    font-weight: 650;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.device-cell small {
    margin-top: 2px;
    font-size: 11px;
    color: var(--text-muted);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.empty-title {
    font-size: 15px;
    font-weight: 650;
    color: var(--text-main);
    margin-bottom: 6px;
}

.empty-button {
    margin-top: 16px;
}

:deep(.recent-table .el-table__row) {
    cursor: pointer;
}

@media (max-width: 1100px) {
    .stat-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .dashboard-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 760px) {
    .hero-panel {
        padding: 26px 22px;
    }

    .hero-art {
        display: none;
    }

    .stat-grid {
        grid-template-columns: 1fr;
        gap: 12px;
    }

    .stat-card {
        min-height: 124px;
    }

    .chart-panel,
    .quick-panel,
    .recent-panel {
        padding: 18px;
    }

    .chart,
    .chart-empty {
        height: 240px;
    }

    .recent-panel {
        overflow-x: auto;
    }
}
</style>
