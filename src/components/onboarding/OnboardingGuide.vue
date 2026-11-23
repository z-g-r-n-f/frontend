
<template>
  <!-- Driver.js 会在页面上自动创建引导遮罩和提示框 -->
  <div class="guide-helper">
    <button class="tutorial-entry" @click="startGuide">
      <span class="tutorial-icon">?</span>
      使用教程
    </button>
  </div>
</template>

<script setup>
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'

import { ref, onBeforeUnmount } from 'vue'

const tour = ref(null)

const steps = [
  {
    element: '[data-tour="dashboard"]',
    popover: {
      title: '首页 · Dashboard',
      description: '这里是系统首页，可以查看设备生命周期管理系统的整体概况。'
    }
  },
  {
    element: '[data-tour="device-management"]',
    popover: {
      title: '设备管理',
      description: '在这里查看、管理你的电子设备档案，了解设备的基本信息和状态。'
    }
  },
  {
    element: '[data-tour="add-device"]',
    popover: {
      title: '添加设备',
      description: '点击这里可以添加新的设备，录入名称、品牌、型号、购买时间等信息。'
    }
  },
  {
    element: '[data-tour="profile"]',
    popover: {
      title: '个人资料',
      description: '在这里查看和管理个人账户信息。'
    }
  }
]

function startGuide() {
  // 只引导当前页面中真实存在的目标元素
  const availableSteps = steps.filter(step =>
    document.querySelector(step.element)
  )

  if (availableSteps.length === 0) {
    alert('暂时没有找到教程目标菜单，请检查 data-tour 标识。')
    return
  }

  // 关闭上一次教程实例
  if (tour.value) {
    tour.value.destroy()
  }

  tour.value = driver({
    showProgress: true,
    progressText: '{{current}} / {{total}}',
    nextBtnText: '下一步',
    prevBtnText: '上一步',
    doneBtnText: '完成',
    closeBtnText: '跳过',
    allowClose: true,
    overlayOpacity: 0.65,
    stagePadding: 8,
    stageRadius: 12,
    popoverClass: 'device-tour-popover',
    steps: availableSteps
  })

  tour.value.drive()
}

onBeforeUnmount(() => {
  if (tour.value) {
    tour.value.destroy()
  }
})

defineExpose({
  startGuide
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
