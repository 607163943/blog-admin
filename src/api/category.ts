import request from '@/utils/request'
import type { Result, PageResult } from '@/types/common'

// 分类视图对象
export interface CategoryVO {
  id: number
  categoryName: string
  createTime: string
  updateTime: string
}

// 查询参数
export interface CategoryQuery {
  page: number
  pageSize: number
  categoryName?: string
}

// 新增/修改分类参数
export interface CategoryUpdateDTO {
  id?: number
  categoryName: string
}

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
