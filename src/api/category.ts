import request from '@/utils/request'
import type { Result, PageResult } from '@/types/common'
import type { CategoryVO, CategoryQuery, CategoryUpdateDTO } from '@/types/category'

/**
 * 分页获取分类数据
 */
export function getCategoryList(params: CategoryQuery) {
  return request.get<Result<PageResult<CategoryVO>>>('/category', { params })
}

/**
 * 新增分类
 */
export function addCategory(categoryName: string) {
  return request.post<Result<object>>('/category', null, {
    params: { categoryName }
  })
}

/**
 * 修改分类
 */
export function updateCategory(data: CategoryUpdateDTO) {
  return request.put<Result<object>>('/category', data)
}

/**
 * 批量删除分类
 * 注意：接口要求 array in body
 */
export function deleteCategory(ids: number[]) {
  return request.delete<Result<object>>('/category', {
    data: ids
  })
}

/**
 * 获取所有分类数据
 */
export function getAllCategories() {
  return request.get<Result<CategoryVO[]>>('/category/all')
}

/**
 * 根据ID获取分类数据
 */
export function getCategoryById(id: number) {
  return request.get<Result<CategoryVO>>(`/category/${id}`)
}
