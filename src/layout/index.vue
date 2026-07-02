<script setup lang="ts">
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'
import Breadcrumb from './Breadcrumb.vue'
import { useLayoutStore } from '@/stores/modules/layout'

const layoutStore = useLayoutStore()
</script>

<template>
  <el-container class="app-wrapper">
    <el-aside :width="layoutStore.isCollapse ? '64px' : '200px'" class="sidebar-container">
      <Sidebar />
    </el-aside>
    
    <!-- 右侧主体 -->
    <el-container class="main-container">
      <!-- 顶部 -->
      <el-header height="auto" class="header-wrapper">
        <Header />
        <Breadcrumb />
      </el-header>
      
      <!-- 内容区 -->
      <el-main class="app-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.app-wrapper {
  height: 100vh;
  width: 100vw;
}

.sidebar-container {
  background-color: #fff;
  border-right: 1px solid #dcdfe6;
  transition: width 0.3s;
  display: flex;
  flex-direction: column;
}

.header-wrapper {
  padding: 0;
  background-color: #fff;
}

.app-main {
  background-color: #f0f2f5;
  padding: 20px;
}
</style>
