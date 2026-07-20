import request from '@/utils/request'
import type { Result, PageResult } from '@/types/common'
import type { ArticleVO, ArticleQuery, ArticleStatusUpdateDTO } from '@/types/article'

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
