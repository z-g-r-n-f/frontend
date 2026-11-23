<template>
    <div class="page device-list-page">
        <div class="page-header">
            <div>
                <h1 class="page-title">{{ $t("device.listTitle") }}</h1>
                <p class="page-subtitle">{{ $t("device.listSubtitle") }}</p>
            </div>

            <el-button type="primary" size="large" @click="$router.push('/devices/new')">
                ＋ {{ $t("device.add") }}
            </el-button>
        </div>

        <div class="summary-strip">
            <div class="summary-item">
                <span class="summary-icon">▤</span>
                <span>{{ $t("dashboard.deviceCount") }}</span>
                <strong>{{ devices.length }}</strong>
            </div>
            <div class="summary-item">
                <span class="dot active"></span>
                <span>{{ $t("status.ACTIVE") }}</span>
                <strong>{{ countByStatus("ACTIVE") }}</strong>
            </div>
            <div class="summary-item">
                <span class="dot idle"></span>
                <span>{{ $t("status.IDLE") }}</span>
                <strong>{{ countByStatus("IDLE") }}</strong>
            </div>
            <div class="summary-item">
                <span class="summary-icon">¥</span>
                <span>{{ $t("dashboard.currentValue") }}</span>
                <strong>{{ currency(totalCurrentValue) }}</strong>
            </div>
        </div>

        <section class="panel list-panel">
            <div class="toolbar">
                <div class="toolbar-left">
                    <el-input
                        v-model="keyword"
                        :placeholder="$t('device.searchPlaceholder')"
                        clearable
                        class="search-input"
                    >
                        <template #prefix><span class="search-icon">⌕</span></template>
                    </el-input>

                    <el-select
                        v-model="statusFilter"
                        :placeholder="$t('device.filterStatus')"
                        clearable
                        class="status-select"
                    >
                        <el-option
                            v-for="item in statusOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </div>

                <el-button :loading="loading" @click="loadDevices">
                    ↻ {{ $t("common.refresh") }}
                </el-button>
            </div>

            <el-table
                v-loading="loading"
                :data="filteredDevices"
                class="device-table"
                row-key="deviceId"
                @row-click="openDetail"
            >
                <el-table-column :label="$t('device.name')" min-width="220">
                    <template #default="{ row }">
                        <div class="device-cell">
                            <span class="device-avatar">{{ deviceEmoji(row.deviceType) }}</span>
                            <div class="device-copy">
                                <strong>{{ row.deviceName }}</strong>
                                <small>{{ row.manufacturer || "-" }} · {{ row.model || "-" }}</small>
                            </div>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column :label="$t('device.type')" width="130">
                    <template #default="{ row }">{{ typeLabel(row.deviceType) }}</template>
                </el-table-column>

                <el-table-column :label="$t('device.serialNumber')" min-width="160">
                    <template #default="{ row }">
                        <span class="mono">{{ row.serialNumber || "-" }}</span>
                    </template>
                </el-table-column>

                <el-table-column :label="$t('device.status')" width="120">
                    <template #default="{ row }">
                        <el-tag :type="statusType(row.status)" effect="light" round>
                            {{ statusLabel(row.status) }}
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column :label="$t('device.purchasePrice')" width="130" align="right">
                    <template #default="{ row }">{{ currency(row.purchasePrice) }}</template>
                </el-table-column>

                <el-table-column :label="$t('device.currentValue')" width="130" align="right">
                    <template #default="{ row }">{{ currency(row.currentValue) }}</template>
                </el-table-column>

                <el-table-column :label="$t('device.updatedAt')" width="170">
                    <template #default="{ row }">{{ formatDate(row.updatedAt || row.createdAt) }}</template>
                </el-table-column>

                <el-table-column :label="$t('common.actions')" width="196" fixed="right">
                    <template #default="{ row }">
                        <el-button text type="primary" size="small" @click.stop="openDetail(row)">
                            {{ $t("common.view") }}
                        </el-button>
                        <el-button text size="small" @click.stop="editDevice(row)">
                            {{ $t("common.edit") }}
                        </el-button>
                        <el-button text type="danger" size="small" @click.stop="removeDevice(row)">
                            {{ $t("common.delete") }}
                        </el-button>
                    </template>
                </el-table-column>

                <template #empty>
                    <div class="table-empty">
                        <div class="empty-icon">▤</div>
                        <p class="empty-title">{{ $t("device.empty") }}</p>
                        <p class="empty-desc">{{ $t("device.emptyHint") }}</p>
                        <el-button type="primary" @click="$router.push('/devices/new')">
                            {{ $t("device.addFirst") }}
                        </el-button>
                    </div>
                </template>
            </el-table>
        </section>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import { ElMessage, ElMessageBox } from "element-plus"

import { deleteDevice, getDevices } from "../api/device"
import { useUserStore } from "../store/user"

const { t, locale } = useI18n()
const router = useRouter()
const userStore = useUserStore()

const devices = ref([])
const loading = ref(false)
const keyword = ref("")
const statusFilter = ref("")

const statusOptions = computed(() =>
    ["ACTIVE", "IDLE", "REPAIR", "SOLD", "RETIRED"].map(value => ({
        value,
        label: t(`status.${value}`)
    }))
)

const filteredDevices = computed(() => {
    const word = keyword.value.trim().toLowerCase()
    return devices.value.filter(item => {
        const matchStatus = !statusFilter.value || item.status === statusFilter.value
        if (!matchStatus) return false
        if (!word) return true

        return [
            item.deviceName,
            item.deviceType,
            item.manufacturer,
            item.model,
            item.serialNumber,
            item.operatingSystem
        ]
            .filter(Boolean)
            .some(value => String(value).toLowerCase().includes(word))
    })
})

const totalCurrentValue = computed(() =>
    devices.value.reduce((sum, item) => sum + Number(item.currentValue || 0), 0)
)

function countByStatus(status) {
    return devices.value.filter(item => item.status === status).length
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

function openDetail(row) {
    router.push(`/devices/${row.deviceId}`)
}

function editDevice(row) {
    router.push(`/devices/${row.deviceId}/edit`)
}

async function loadDevices() {
    if (!userStore.userId) return

    loading.value = true
    try {
        devices.value = (await getDevices(userStore.userId)) || []
    } catch (error) {
        devices.value = []
        ElMessage.error(error.message || t("device.loadFailed"))
    } finally {
        loading.value = false
    }
}

async function removeDevice(row) {
    try {
        await ElMessageBox.confirm(
            t("device.deleteConfirm", { name: row.deviceName }),
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
        await deleteDevice(row.deviceId)
        ElMessage.success(t("device.deleteSuccess"))
        await loadDevices()
    } catch (error) {
        ElMessage.error(error.message || t("errors.unknown"))
    }
}

onMounted(loadDevices)
</script>

<style scoped>
.summary-strip {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 18px;
}

.summary-item {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 9px 14px;
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 12px;
    font-size: 12px;
    color: var(--text-muted);
    box-shadow: 0 3px 10px rgba(31, 41, 55, 0.03);
}

.summary-item strong {
    color: var(--text-main);
    font-size: 13px;
}

.summary-icon {
    color: var(--brand);
}

.dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
}

.dot.active {
    background: #315efb;
}

.dot.idle {
    background: #f59e0b;
}

.list-panel {
    padding: 20px 22px 8px;
}

.toolbar {
    display: flex;
    justify-content: space-between;
    gap: 14px;
    margin-bottom: 16px;
    flex-wrap: wrap;
}

.toolbar-left {
    display: flex;
    gap: 10px;
    flex: 1;
    min-width: 260px;
}

.search-input {
    max-width: 380px;
    flex: 1;
}

.status-select {
    width: 160px;
}

.search-icon {
    font-size: 16px;
    color: #a3adbd;
}

.device-table {
    width: 100%;
}

:deep(.device-table .el-table__row) {
    cursor: pointer;
}

.device-cell {
    display: flex;
    align-items: center;
    gap: 11px;
}

.device-avatar {
    width: 38px;
    height: 38px;
    flex: 0 0 38px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 11px;
    background: #f2f5fb;
    font-size: 17px;
}

.device-copy {
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.device-copy strong {
    font-size: 13px;
    font-weight: 650;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.device-copy small {
    margin-top: 3px;
    font-size: 11px;
    color: var(--text-muted);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.mono {
    font-family: ui-monospace, "Cascadia Code", Consolas, monospace;
    font-size: 12px;
    color: var(--text-regular);
}

.table-empty {
    padding: 46px 20px 54px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.empty-icon {
    font-size: 40px;
    color: #d5dce8;
    margin-bottom: 12px;
}

.empty-title {
    font-size: 16px;
    font-weight: 650;
    color: var(--text-main);
}

.empty-desc {
    margin: 7px 0 18px;
    font-size: 13px;
    color: var(--text-muted);
}

@media (max-width: 720px) {
    .list-panel {
        padding: 16px 14px 6px;
    }

    .toolbar-left {
        flex-direction: column;
        width: 100%;
    }

    .search-input,
    .status-select {
        width: 100%;
        max-width: none;
    }

    .toolbar {
        flex-direction: column;
    }
}
</style>
