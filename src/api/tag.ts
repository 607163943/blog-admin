import request from '@/utils/request'
import type { Result, PageResult } from '@/types/common'
import type { TagVO, TagQuery, TagUpdateDTO } from '@/types/tag'

/**
 * 分页获取标签数据
 */
export function getTagList(params: TagQuery) {
  return request.get<Result<PageResult<TagVO>>>('/tag', { params })
}

/**
 * 新增标签
 */
export function addTag(tagName: string) {
  return request.post<Result<object>>('/tag', null, {
    params: { tagName }
  })
}

/**
 * 修改标签
 */
export function updateTag(data: TagUpdateDTO) {
  return request.put<Result<object>>('/tag', data)
}

/**
 * 批量删除标签
 */
export function deleteTag(ids: number[]) {
  return request.delete<Result<object>>('/tag', {
    data: ids
  })
}

/**
 * 获取所有标签数据
 */
export function getAllTags() {
  return request.get<Result<TagVO[]>>('/tag/all')
}
