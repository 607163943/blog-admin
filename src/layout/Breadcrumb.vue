<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'
defineOptions({
  name: 'LayoutBreadcrumb'
})
</script>

<template>
  <div class="breadcrumb-container">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<style scoped>
.breadcrumb-container {
  height: 34px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid #e4e7ed;
  background-color: #f5f7fa;
}
</style>
