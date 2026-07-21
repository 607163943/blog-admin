<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getTagList,
  addTag,
  updateTag,
  deleteTag,
  getTagById
} from '@/api/tag'
import type { TagVO, TagQuery } from '@/types/tag'
import { Search, Refresh, Plus, Edit, Delete } from '@element-plus/icons-vue'

// 查询参数
const queryForm = reactive<TagQuery>({
  page: 1,
  pageSize: 10,
  tagName: ''
})
const dateRange = ref([]) // 暂存创建时间，后端接口暂未支持时间过滤

const loading = ref(false)
const tableData = ref<TagVO[]>([])
const total = ref(0)
const selectedIds = ref<number[]>([])

// 弹窗相关
const dialogVisible = ref(false)
const dialogTitle = ref('新增标签')
const formRef = ref()
const formData = reactive({
  id: 0,
  tagName: ''
})
const rules = {
  tagName: [{ required: true, message: '请输入标签名称', trigger: 'blur' }]
}

// 获取数据
const loadData = async () => {
  loading.value = true
  try {
    const res = await getTagList(queryForm)
    if (res.data.code === 200) {
      tableData.value = res.data.data.data
      total.value = res.data.data.total
    } else {
      ElMessage.error(res.data.msg || '获取标签列表失败')
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  queryForm.page = 1
  loadData()
}

// 重置
const handleReset = () => {
  queryForm.tagName = ''
  dateRange.value = []
  handleSearch()
}

// 刷新
const handleRefresh = () => {
  loadData()
}

// 表格多选
const handleSelectionChange = (selection: TagVO[]) => {
  selectedIds.value = selection.map((item) => item.id)
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增标签'
  formData.id = 0
  formData.tagName = ''
  dialogVisible.value = true
  if (formRef.value) {
    formRef.value.clearValidate()
  }
}

// 修改
const handleEdit = async (row: TagVO) => {
  dialogTitle.value = '修改标签'
  dialogVisible.value = true
  if (formRef.value) {
    formRef.value.clearValidate()
  }
  try {
    const res = await getTagById(row.id)
    if (res.data.code === 200) {
      formData.id = res.data.data.id
      formData.tagName = res.data.data.tagName
    } else {
      ElMessage.error(res.data.msg || '获取标签详情失败')
    }
  } catch (error) {
    console.error(error)
  }
}

// 顶部修改（需要选中单条）
const handleTopEdit = () => {
  if (selectedIds.value.length !== 1) {
    ElMessage.warning('请选择一条数据进行修改')
    return
  }
  const row = tableData.value.find((item) => item.id === selectedIds.value[0])
  if (row) {
    handleEdit(row)
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        let res
        if (formData.id) {
          res = await updateTag({ id: formData.id, tagName: formData.tagName })
        } else {
          res = await addTag(formData.tagName)
        }
        if (res.data.code === 200) {
          ElMessage.success(dialogTitle.value + '成功')
          dialogVisible.value = false
          loadData()
        } else {
          ElMessage.error(res.data.msg || dialogTitle.value + '失败')
        }
      } catch (error) {
        console.error(error)
      }
    }
  })
}

// 单个删除
const handleDelete = (row: TagVO) => {
  doDelete([row.id])
}

// 批量删除
const handleBatchDelete = () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请选择要删除的数据')
    return
  }
  doDelete(selectedIds.value)
}

// 执行删除
const doDelete = (ids: number[]) => {
  ElMessageBox.confirm('确认删除选中的标签吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await deleteTag(ids)
      if (res.data.code === 200) {
        ElMessage.success('删除成功')
        // 如果当前页数据全删了且不是第一页，则退回上一页
        if (ids.length === tableData.value.length && queryForm.page > 1) {
          queryForm.page--
        }
        loadData()
      } else {
        ElMessage.error(res.data.msg || '删除失败')
      }
    } catch (error) {
      console.error(error)
    }
  })
}

// 分页处理
const handleSizeChange = (val: number) => {
  queryForm.pageSize = val
  handleSearch()
}
const handleCurrentChange = (val: number) => {
  queryForm.page = val
  loadData()
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="tag-container p-4 h-full flex flex-col bg-gray-50">
    <!-- 顶部搜索 -->
    <div class="search-wrapper bg-white p-4 rounded shadow-sm mb-4">
      <el-form :inline="true" :model="queryForm" class="flex flex-wrap items-center">
        <el-form-item label="标签名称" class="mb-2">
          <el-input
            v-model="queryForm.tagName"
            placeholder="输入标签名称"
            clearable
            class="w-48"
          />
        </el-form-item>
        <el-form-item label="创建时间" class="mb-2">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            class="w-64"
          />
        </el-form-item>
        <el-form-item class="mb-2">
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 主体内容 -->
    <div class="table-wrapper bg-white p-4 rounded shadow-sm flex-1 flex flex-col min-h-0">
      <!-- 操作按钮 -->
      <div class="mb-4 flex gap-2">
        <el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
        <el-button
          type="success"
          :icon="Edit"
          :disabled="selectedIds.length !== 1"
          @click="handleTopEdit"
          >修改</el-button
        >
        <el-button
          type="danger"
          :icon="Delete"
          :disabled="selectedIds.length === 0"
          @click="handleBatchDelete"
          >删除</el-button
        >
        <el-button type="info" :icon="Refresh" @click="handleRefresh">刷新</el-button>
      </div>

      <!-- 数据表格 -->
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        stripe
        class="w-full flex-1"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="tagName" label="标签名" min-width="150" align="center" />
        <el-table-column prop="createTime" label="创建时间" min-width="180" align="center" />
        <el-table-column prop="updateTime" label="修改时间" min-width="180" align="center" />
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link :icon="Edit" @click="handleEdit(row)">修改</el-button>
            <el-button type="danger" link :icon="Delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="mt-4 flex justify-end">
        <el-pagination
          v-model:current-page="queryForm.page"
          v-model:page-size="queryForm.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 新增/修改弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="30%" draggable>
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
        <el-form-item label="标签名称" prop="tagName">
          <el-input v-model="formData.tagName" placeholder="请输入标签名称" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.tag-container {
  /* 使用 Element Plus 变量和 Tailwind，此处可做个性化覆盖 */
  :deep(.el-table) {
    /* 保证表格占满剩余空间 */
    height: 100%;
  }
}
</style>
