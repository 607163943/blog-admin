<script setup lang="ts">
import { Expand, Fold, ArrowDown } from '@element-plus/icons-vue'
import { useLayoutStore } from '@/stores/modules/layout'

const layoutStore = useLayoutStore()
defineOptions({
  name: 'LayoutHeader'
})
</script>

<template>
  <div class="header-container">
    <div class="left">
      <el-icon class="toggle-icon" @click="layoutStore.toggleCollapse">
        <component :is="layoutStore.isCollapse ? Expand : Fold" />
      </el-icon>
    </div>
    <div class="right">
      <el-dropdown>
        <span class="user-dropdown">
          <el-avatar
            :size="30"
            src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
          />
          <span class="username">管理员十三</span>
          <el-icon class="el-icon--right"><ArrowDown /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item divided>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  padding: 0 20px;
  border-bottom: 1px solid #dcdfe6;
}
.left {
  display: flex;
  align-items: center;
}
.toggle-icon {
  font-size: 20px;
  cursor: pointer;
}
.user-dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.username {
  margin-left: 10px;
}
</style>
