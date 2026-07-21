import request from '@/utils/request'
import type { Result, PageResult } from '@/types/common'
import type { ArticleVO, ArticleQuery, ArticleStatusUpdateDTO, ArticleSaveDTO, ArticleUpdateDTO, ArticleDetailVO } from '@/types/article'

/**
 * 分页获取文章数据
 */
export function getArticleList(params: ArticleQuery) {
  return request.get<Result<PageResult<ArticleVO>>>('/article', { params })
}

/**
 * 批量删除文章
 */
export function deleteArticle(ids: number[]) {
  return request.delete<Result<object>>('/article', {
    data: ids
  })
}

/**
 * 修改文章状态
 */
export function updateArticleStatus(data: ArticleStatusUpdateDTO) {
  return request.patch<Result<object>>('/article', data)
}

/**
 * 新增文章
 */
export function addArticle(data: ArticleSaveDTO) {
  return request.post<Result<object>>('/article', data)
}

/**
 * 修改文章
 */
export function editArticle(data: ArticleUpdateDTO) {
  return request.put<Result<object>>('/article', data)
}

/**
 * 根据ID获取文章数据
 */
export function getArticleById(id: number) {
  return request.get<Result<ArticleDetailVO>>(`/article/${id}`)
}
