<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowRight } from '@element-plus/icons-vue'

defineOptions({
  name: 'LayoutBreadcrumb'
})

const route = useRoute()

const titleMap: Record<string, string> = {
  '/dashboard': '数据统计',
  '/article': '文章管理',
  '/category': '分类管理',
  '/tag': '标签管理'
}

const currentTitle = computed(() => titleMap[route.path] || '')
</script>

<template>
  <div class="breadcrumb-container">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-if="currentTitle">{{ currentTitle }}</el-breadcrumb-item>
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
