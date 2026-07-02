<script setup lang="ts">
import { ref } from 'vue'
import { DataAnalysis, Document, Folder, Collection } from '@element-plus/icons-vue'
import { useLayoutStore } from '@/stores/modules/layout'

defineOptions({
  name: 'LayoutSidebar'
})
const layoutStore = useLayoutStore()
const activeMenu = ref('/dashboard')
</script>

<template>
  <div class="sidebar-wrapper">
    <div class="logo-container" :class="{ 'is-collapse': layoutStore.isCollapse }">
      <img src="@/assets/logo.svg" alt="logo" class="logo-icon" />
      <span class="logo-text" v-show="!layoutStore.isCollapse">Blog Admin</span>
    </div>
    <el-menu
      :default-active="activeMenu"
      class="sidebar-menu"
      :collapse="layoutStore.isCollapse"
      router
    >
      <el-menu-item index="/dashboard">
      <el-icon><DataAnalysis /></el-icon>
      <template #title>数据统计</template>
    </el-menu-item>
    <el-menu-item index="/article">
      <el-icon><Document /></el-icon>
      <template #title>文章管理</template>
    </el-menu-item>
    <el-menu-item index="/category">
      <el-icon><Folder /></el-icon>
      <template #title>分类管理</template>
    </el-menu-item>
    <el-menu-item index="/tag">
      <el-icon><Collection /></el-icon>
      <template #title>标签管理</template>
    </el-menu-item>
  </el-menu>
  </div>
</template>

<style scoped>
.sidebar-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #fff;
}
.logo-container {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #dcdfe6;
  overflow: hidden;
  white-space: nowrap;
  transition: all 0.3s;
}
.logo-container.is-collapse {
  padding: 0;
}
.logo-icon {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
}
.logo-text {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
  margin-left: 12px;
}
.sidebar-menu {
  border-right: none;
  flex: 1;
}
</style>
