
<template>
  <el-config-provider :locale="elementLocale">
    <router-view />

    <!-- 教程组件 -->
    <OnboardingGuide ref="guideRef" />

    <!-- 右下角重新打开教程按钮 -->
    <button class="tutorial-entry" @click="openTutorial">
      <span class="tutorial-icon">?</span>
      使用教程
    </button>
  </el-config-provider>
</template>

<script setup>
import { computed, ref, onMounted } from "vue"
import { useI18n } from "vue-i18n"

import zhCn from "element-plus/es/locale/lang/zh-cn"
import en from "element-plus/es/locale/lang/en"
import ja from "element-plus/es/locale/lang/ja"
import ko from "element-plus/es/locale/lang/ko"

import OnboardingGuide from "./components/onboarding/OnboardingGuide.vue"

const { locale } = useI18n()

const guideRef = ref(null)

const localeMap = {
  "zh-CN": zhCn,
  "en-US": en,
  "ja-JP": ja,
  "ko-KR": ko
}

const elementLocale = computed(() => localeMap[locale.value] || zhCn)

// 打开教程
function openTutorial() {
  guideRef.value?.startGuide()
}

// 首次访问自动启动教程
onMounted(() => {
  const completed = localStorage.getItem("tutorialCompleted")

  if (completed !== "true") {
    openTutorial()
  }
})
</script>

<style scoped>
.tutorial-entry {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 9990;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 18px;
  border: none;
  border-radius: 50px;
  background: #2563eb;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.25);
  transition: all 0.2s ease;
}

.tutorial-entry:hover {
  background: #1d4ed8;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.35);
}

.tutorial-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: 2px solid white;
  border-radius: 50%;
  font-weight: 700;
}
</style>
