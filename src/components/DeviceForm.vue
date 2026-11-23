<template>
    <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        class="device-form"
        @submit.prevent
    >
        <section class="form-section">
            <div class="section-heading">
                <span class="section-index">01</span>
                <h3>{{ $t("device.basicInfo") }}</h3>
            </div>

            <el-row :gutter="18">
                <el-col :xs="24" :sm="12">
                    <el-form-item :label="$t('device.formName')" prop="deviceName">
                        <el-input
                            v-model="form.deviceName"
                            :placeholder="$t('device.namePlaceholder')"
                            maxlength="100"
                        />
                    </el-form-item>
                </el-col>

                <el-col :xs="24" :sm="12">
                    <el-form-item :label="$t('device.formType')" prop="deviceType">
                        <el-select v-model="form.deviceType" style="width: 100%">
                            <el-option
                                v-for="item in deviceTypes"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :xs="24" :sm="12">
                    <el-form-item :label="$t('device.formManufacturer')" prop="manufacturer">
                        <el-input
                            v-model="form.manufacturer"
                            :placeholder="$t('device.manufacturerPlaceholder')"
                            maxlength="100"
                        />
                    </el-form-item>
                </el-col>

                <el-col :xs="24" :sm="12">
                    <el-form-item :label="$t('device.formModel')" prop="model">
                        <el-input
                            v-model="form.model"
                            :placeholder="$t('device.modelPlaceholder')"
                            maxlength="100"
                        />
                    </el-form-item>
                </el-col>

                <el-col :xs="24" :sm="12">
                    <el-form-item :label="$t('device.formSerial')" prop="serialNumber">
                        <el-input
                            v-model="form.serialNumber"
                            :placeholder="$t('device.serialPlaceholder')"
                            maxlength="100"
                        />
                    </el-form-item>
                </el-col>

                <el-col :xs="24" :sm="12">
                    <el-form-item :label="$t('device.formStatus')" prop="status">
                        <el-select v-model="form.status" style="width: 100%">
                            <el-option
                                v-for="item in statuses"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </section>

        <section class="form-section">
            <div class="section-heading">
                <span class="section-index">02</span>
                <h3>{{ $t("device.specInfo") }}</h3>
            </div>

            <el-row :gutter="18">
                <el-col :xs="24" :sm="12">
                    <el-form-item :label="$t('device.formOs')" prop="operatingSystem">
                        <el-input
                            v-model="form.operatingSystem"
                            :placeholder="$t('device.osPlaceholder')"
                            maxlength="100"
                        />
                    </el-form-item>
                </el-col>

                <el-col :xs="24" :sm="12">
                    <el-form-item :label="$t('device.formCpu')" prop="cpu">
                        <el-input
                            v-model="form.cpu"
                            :placeholder="$t('device.cpuPlaceholder')"
                            maxlength="100"
                        />
                    </el-form-item>
                </el-col>

                <el-col :xs="24" :sm="12">
                    <el-form-item :label="$t('device.formRam')" prop="ramGb">
                        <el-input-number
                            v-model="form.ramGb"
                            :min="0"
                            :precision="0"
                            :controls="false"
                            style="width: 100%"
                        />
                    </el-form-item>
                </el-col>

                <el-col :xs="24" :sm="12">
                    <el-form-item :label="$t('device.formStorage')" prop="storageGb">
                        <el-input-number
                            v-model="form.storageGb"
                            :min="0"
                            :precision="0"
                            :controls="false"
                            style="width: 100%"
                        />
                    </el-form-item>
                </el-col>
            </el-row>
        </section>

        <section class="form-section">
            <div class="section-heading">
                <span class="section-index">03</span>
                <h3>{{ $t("device.purchaseInfo") }}</h3>
            </div>

            <el-row :gutter="18">
                <el-col :xs="24" :sm="8">
                    <el-form-item :label="$t('device.formPurchaseDate')" prop="purchaseDate">
                        <el-date-picker
                            v-model="form.purchaseDate"
                            type="date"
                            value-format="YYYY-MM-DD"
                            format="YYYY-MM-DD"
                            :placeholder="$t('device.formPurchaseDate')"
                            style="width: 100%"
                        />
                    </el-form-item>
                </el-col>

                <el-col :xs="24" :sm="8">
                    <el-form-item :label="$t('device.formPurchasePrice')" prop="purchasePrice">
                        <el-input-number
                            v-model="form.purchasePrice"
                            :min="0"
                            :precision="2"
                            :step="100"
                            :controls="false"
                            style="width: 100%"
                        />
                    </el-form-item>
                </el-col>

                <el-col :xs="24" :sm="8">
                    <el-form-item :label="$t('device.formCurrentValue')" prop="currentValue">
                        <el-input-number
                            v-model="form.currentValue"
                            :min="0"
                            :precision="2"
                            :step="100"
                            :controls="false"
                            style="width: 100%"
                        />
                    </el-form-item>
                </el-col>
            </el-row>
        </section>

        <div class="form-actions">
            <el-button @click="$emit('cancel')">
                {{ $t("common.cancel") }}
            </el-button>
            <el-button type="primary" :loading="loading" @click="submit">
                {{ mode === "edit" ? $t("device.saveDevice") : $t("device.addTitle") }}
            </el-button>
        </div>
    </el-form>
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue"
import { useI18n } from "vue-i18n"

const props = defineProps({
    initial: {
        type: Object,
        default: () => ({})
    },
    mode: {
        type: String,
        default: "create"
    },
    loading: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(["submit", "cancel"])

const { t } = useI18n()
const formRef = ref(null)

const createEmptyForm = () => ({
    deviceName: "",
    deviceType: "LAPTOP",
    manufacturer: "",
    model: "",
    serialNumber: "",
    operatingSystem: "",
    cpu: "",
    ramGb: null,
    storageGb: null,
    purchaseDate: "",
    purchasePrice: null,
    currentValue: null,
    status: "ACTIVE"
})

const form = reactive(createEmptyForm())

watch(
    () => props.initial,
    value => {
        Object.assign(form, createEmptyForm())
        if (value && typeof value === "object") {
            Object.keys(form).forEach(key => {
                if (value[key] !== undefined && value[key] !== null) {
                    form[key] = value[key]
                }
            })
        }
    },
    { immediate: true, deep: true }
)

const deviceTypes = computed(() =>
    ["LAPTOP", "PHONE", "DESKTOP", "TABLET", "CAMERA", "OTHER"].map(value => ({
        value,
        label: t(`deviceType.${value}`)
    }))
)

const statuses = computed(() =>
    ["ACTIVE", "IDLE", "REPAIR", "SOLD", "RETIRED"].map(value => ({
        value,
        label: t(`status.${value}`)
    }))
)

const rules = computed(() => ({
    deviceName: [
        { required: true, message: t("device.requiredName"), trigger: "blur" },
        { max: 100, message: t("device.requiredName"), trigger: "blur" }
    ],
    deviceType: [
        { required: true, message: t("device.requiredType"), trigger: "change" }
    ]
}))

async function submit() {
    if (!formRef.value) return

    try {
        await formRef.value.validate()
    } catch (e) {
        return
    }

    const payload = { ...form }
    Object.keys(payload).forEach(key => {
        if (typeof payload[key] === "string") {
            payload[key] = payload[key].trim()
        }
        if (payload[key] === "") {
            payload[key] = null
        }
    })

    emit("submit", payload)
}
</script>

<style scoped>
.device-form {
    background: #fff;
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-card);
    padding: 30px;
}

.form-section + .form-section {
    margin-top: 10px;
    padding-top: 20px;
    border-top: 1px dashed var(--border);
}

.section-heading {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
}

.section-index {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 9px;
    background: var(--brand-soft);
    color: var(--brand);
    font-size: 12px;
    font-weight: 700;
}

.section-heading h3 {
    font-size: 16px;
    font-weight: 700;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 18px;
    padding-top: 22px;
    border-top: 1px solid var(--border);
}

:deep(.el-form-item__label) {
    font-weight: 600;
    color: var(--text-regular);
}

@media (max-width: 620px) {
    .device-form {
        padding: 20px;
    }

    .form-actions {
        flex-direction: column-reverse;
    }

    .form-actions .el-button {
        width: 100%;
        margin-left: 0;
    }
}
</style>
