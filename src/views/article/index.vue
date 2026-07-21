<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, RefreshRight, Plus, Edit, Delete, Refresh } from '@element-plus/icons-vue'
import { getArticleList, deleteArticle, updateArticleStatus } from '@/api/article'
import { getAllCategories } from '@/api/category'
import { getAllTags } from '@/api/tag'
import type { ArticleVO, ArticleQuery } from '@/types/article'
import type { CategoryVO } from '@/types/category'
import type { TagVO } from '@/types/tag'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'ArticleManagement'
})

// 查询参数
const queryParams = ref<ArticleQuery>({
  page: 1,
  pageSize: 10,
  articleTitle: '',
  categoryId: '',
  tagId: '',
  articleStatus: ''
})

const router = useRouter()

// 数据状态
const loading = ref(false)
const articleList = ref<ArticleVO[]>([])
const total = ref(0)
const selectedIds = ref<number[]>([])

const categoryList = ref<CategoryVO[]>([])
const tagList = ref<TagVO[]>([])

// 获取分类和标签列表
const fetchCategoriesAndTags = async () => {
  try {
    const [categoryRes, tagRes] = await Promise.all([getAllCategories(), getAllTags()])
    if (categoryRes.data.code === 200) {
      categoryList.value = categoryRes.data.data
    }
    if (tagRes.data.code === 200) {
      tagList.value = tagRes.data.data
    }
  } catch (error) {
    console.error('Failed to fetch categories or tags', error)
  }
}

// 获取文章列表
const fetchArticleList = async () => {
  loading.value = true
  try {
    const res = await getArticleList(queryParams.value)
    if (res.data.code === 200) {
      articleList.value = res.data.data.data
      total.value = res.data.data.total
    } else {
      ElMessage.error(res.data.msg || '获取文章列表失败')
    }
  } catch (error) {
    console.error(error)
    ElMessage.error('获取文章列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索和重置
const handleSearch = () => {
  queryParams.value.page = 1
  fetchArticleList()
}

const handleReset = () => {
  queryParams.value = {
    page: 1,
    pageSize: 10,
    articleTitle: '',
    categoryId: '',
    tagId: '',
    articleStatus: ''
  }
  fetchArticleList()
}

// 表格多选
const handleSelectionChange = (selection: ArticleVO[]) => {
  selectedIds.value = selection.map((item) => item.id)
}

// 新增、修改
const handleAdd = () => {
  router.push('/article/edit')
}

const handleEdit = (row?: ArticleVO) => {
  const id = row ? row.id : selectedIds.value[0]
  if (!id) {
    ElMessage.warning('请选择要修改的文章')
    return
  }
  router.push(`/article/edit/${id}`)
}

// 删除文章
const handleDelete = async (row?: ArticleVO) => {
  const ids = row ? [row.id] : selectedIds.value
  if (ids.length === 0) {
    ElMessage.warning('请选择要删除的文章')
    return
  }

  try {
    await ElMessageBox.confirm(`确认删除选中的 ${ids.length} 篇文章吗？`, '提示', {
      type: 'warning',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })

    const res = await deleteArticle(ids)
    if (res.data.code === 200) {
      ElMessage.success('删除成功')
      fetchArticleList()
    } else {
      ElMessage.error(res.data.msg || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error(error)
      ElMessage.error('删除失败')
    }
  }
}

// 修改状态 (发布/下架)
const handleStatusChange = async (row: ArticleVO) => {
  const newStatus = row.articleStatus === 1 ? 0 : 1
  const actionText = newStatus === 1 ? '发布' : '下架'

  try {
    await ElMessageBox.confirm(`确认${actionText}文章《${row.articleTitle}》吗？`, '提示', {
      type: 'warning',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })

    const res = await updateArticleStatus({ id: row.id, articleStatus: newStatus })
    if (res.data.code === 200) {
      ElMessage.success(`${actionText}成功`)
      fetchArticleList()
    } else {
      ElMessage.error(res.data.msg || `${actionText}失败`)
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error(error)
      ElMessage.error(`${actionText}失败`)
    }
  }
}

// 分页
const handleSizeChange = (val: number) => {
  queryParams.value.pageSize = val
  fetchArticleList()
}

const handleCurrentChange = (val: number) => {
  queryParams.value.page = val
  fetchArticleList()
}

onMounted(() => {
  fetchCategoriesAndTags()
  fetchArticleList()
})
</script>

<template>
  <div class="app-container p-4">
    <!-- 搜索区域 -->
    <el-card class="search-card mb-4" shadow="hover">
      <el-form :model="queryParams" ref="queryFormRef" :inline="true" class="flex flex-wrap">
        <el-form-item label="文章标题:">
          <el-input
            v-model="queryParams.articleTitle"
            placeholder="输入文章标题"
            clearable
            @keyup.enter="handleSearch"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="文章分类:">
          <el-select
            v-model="queryParams.categoryId"
            placeholder="全部分类"
            clearable
            style="width: 200px"
          >
            <el-option
              v-for="item in categoryList"
              :key="item.id"
              :label="item.categoryName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="文章标签:">
          <el-select
            v-model="queryParams.tagId"
            placeholder="全部标签"
            clearable
            style="width: 200px"
          >
            <el-option
              v-for="item in tagList"
              :key="item.id"
              :label="item.tagName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="文章状态:">
          <el-select
            v-model="queryParams.articleStatus"
            placeholder="全部状态"
            clearable
            style="width: 150px"
          >
            <el-option label="发布" :value="1" />
            <el-option label="草稿" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
          <el-button :icon="RefreshRight" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 列表区域 -->
    <el-card class="table-card" shadow="hover">
      <template #header>
        <div class="flex items-center space-x-2">
          <el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
          <el-button
            type="success"
            :icon="Edit"
            :disabled="selectedIds.length !== 1"
            @click="handleEdit()"
            >修改</el-button
          >
          <el-button
            type="danger"
            :icon="Delete"
            :disabled="selectedIds.length === 0"
            @click="handleDelete()"
            >删除</el-button
          >
          <el-button :icon="Refresh" @click="fetchArticleList">刷新</el-button>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="articleList"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column
          prop="articleTitle"
          label="文章标题"
          min-width="180"
          show-overflow-tooltip
        />
        <el-table-column prop="categoryName" label="文章分类" min-width="120" align="center" />
        <el-table-column
          prop="articleSummary"
          label="文章简介"
          min-width="200"
          show-overflow-tooltip
        />
        <el-table-column prop="tags" label="文章标签" min-width="150" align="center">
          <template #default="{ row }">
            <el-tag v-for="(tag, index) in row.tags" :key="index" size="small" class="mr-1 mb-1">
              {{ tag }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="articleStatus" label="文章状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.articleStatus === 1 ? 'success' : 'info'">
              {{ row.articleStatus === 1 ? '已发布' : '草稿箱' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="publishTime" label="首次发布时间" width="170" align="center" />

        <el-table-column label="操作" width="250" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link :icon="Edit" @click="handleEdit(row)">修改</el-button>
            <el-button
              :type="row.articleStatus === 1 ? 'warning' : 'success'"
              link
              @click="handleStatusChange(row)"
            >
              {{ row.articleStatus === 1 ? '下架' : '发布' }}
            </el-button>
            <el-button type="danger" link :icon="Delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <div class="flex justify-end mt-4">
        <el-pagination
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[10, 20, 30, 50]"
          :background="true"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.app-container {
  height: 100%;
}
.search-card {
  margin-bottom: 20px;
}
.el-form-item {
  margin-bottom: 10px;
}
.mr-1 {
  margin-right: 4px;
}
.mb-1 {
  margin-bottom: 4px;
}
</style>
