<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus, Back } from '@element-plus/icons-vue'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { addArticle, editArticle, getArticleById } from '@/api/article'
import { getAllCategories } from '@/api/category'
import { getAllTags } from '@/api/tag'
import type { ArticleSaveDTO, ArticleDetailVO } from '@/types/article'
import type { CategoryVO } from '@/types/category'
import type { TagVO } from '@/types/tag'

defineOptions({
  name: 'ArticleEdit'
})

const router = useRouter()
const route = useRoute()
const isEdit = ref(false)
const articleId = ref<number | null>(null)

const formData = ref<ArticleSaveDTO>({
  articleTitle: '',
  categoryId: undefined as any,
  tagIds: [],
  articleCover: '',
  articleSummary: '',
  articleContent: '',
  articleStatus: 0
})

const categoryList = ref<CategoryVO[]>([])
const tagList = ref<TagVO[]>([])
const loading = ref(false)

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

const fetchArticleDetail = async (id: number) => {
  loading.value = true
  try {
    const res = await getArticleById(id)
    if (res.data.code === 200) {
      const data = res.data.data
      formData.value = {
        articleTitle: data.articleTitle,
        categoryId: data.categoryId,
        tagIds: data.tagIds,
        articleCover: data.articleCover || '',
        articleSummary: data.articleSummary || '',
        articleContent: data.articleContent || '',
        articleStatus: data.articleStatus
      }
    } else {
      ElMessage.error(res.data.msg || '获取文章详情失败')
    }
  } catch (error) {
    console.error(error)
    ElMessage.error('获取文章详情失败')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchCategoriesAndTags()
  if (route.params.id) {
    isEdit.value = true
    articleId.value = Number(route.params.id)
    await fetchArticleDetail(articleId.value)
  }
})

const goBack = () => {
  router.push('/article')
}

// 模拟上传图片
const handleUploadSuccess = (response: any, uploadFile: any) => {
  // 这里正常应该接收后端的图片URL，这里用模拟上传，将本地文件转为ObjectURL用于预览
  formData.value.articleCover = URL.createObjectURL(uploadFile.raw!)
}
const beforeUpload = (file: any) => {
  return true
}

const handleSave = async (status: number) => {
  if (!formData.value.articleTitle) {
    ElMessage.warning('请输入文章标题')
    return
  }
  if (!formData.value.categoryId) {
    ElMessage.warning('请选择文章分类')
    return
  }

  formData.value.articleStatus = status
  loading.value = true

  try {
    let res
    if (isEdit.value && articleId.value) {
      res = await editArticle({
        ...formData.value,
        id: articleId.value
      })
    } else {
      res = await addArticle(formData.value)
    }

    if (res.data.code === 200) {
      ElMessage.success(status === 1 ? '发布成功' : '保存草稿成功')
      router.push('/article')
    } else {
      ElMessage.error(res.data.msg || '保存失败')
    }
  } catch (error) {
    console.error(error)
    ElMessage.error('保存失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="app-container p-4" v-loading="loading">
    <el-card shadow="hover" class="mb-4">
      <div class="flex items-center mb-4">
        <el-button :icon="Back" @click="goBack" class="mr-4">返回</el-button>
        <h2 class="text-lg font-bold m-0">{{ isEdit ? '修改文章' : '新增文章' }}</h2>
      </div>

      <el-form :model="formData" label-width="80px">
        <el-form-item label="文章标题" required>
          <el-input
            v-model="formData.articleTitle"
            placeholder="输入文章标题，建议 30 字以内"
            maxlength="30"
            show-word-limit
          />
        </el-form-item>

        <div class="flex gap-4">
          <el-form-item label="文章分类" class="flex-1" required>
            <el-select v-model="formData.categoryId" placeholder="请选择分类" class="w-full">
              <el-option
                v-for="item in categoryList"
                :key="item.id"
                :label="item.categoryName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="文章标签" class="flex-1">
            <el-select
              v-model="formData.tagIds"
              multiple
              :multiple-limit="3"
              placeholder="请选择标签 (多选，最多3个)"
              class="w-full"
            >
              <el-option
                v-for="item in tagList"
                :key="item.id"
                :label="item.tagName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </div>

        <el-form-item label="首页封面">
          <el-upload
            class="cover-uploader"
            action="#"
            :show-file-list="false"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload"
            :auto-upload="false"
            @change="(file) => handleUploadSuccess(null, file)"
          >
            <img v-if="formData.articleCover" :src="formData.articleCover" class="cover-image" />
            <el-icon v-else class="cover-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>

        <el-form-item label="文章简介">
          <el-input
            v-model="formData.articleSummary"
            type="textarea"
            :rows="3"
            placeholder="输入文章简介，作为前台列表页的摘要展示..."
          />
        </el-form-item>

        <el-form-item label="文章内容" required>
          <div class="editor-container w-full">
            <MdEditor v-model="formData.articleContent" style="height: 500px" />
          </div>
        </el-form-item>

        <el-form-item>
          <div class="flex justify-end w-full">
            <el-button @click="handleSave(0)">💾 保存为草稿</el-button>
            <el-button type="primary" @click="handleSave(1)">🚀 发布</el-button>
            <el-button @click="goBack">↩️ 返回</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.app-container {
  height: 100%;
}
.cover-uploader {
  :deep(.el-upload) {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);

    &:hover {
      border-color: var(--el-color-primary);
    }
  }
}

.cover-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

.cover-image {
  width: 178px;
  height: 178px;
  display: block;
  object-fit: cover;
}
.editor-container {
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
}
</style>
