import request from '@/utils/request'
import type { Result } from '@/types/common'
import type { ArticleTrendVO, DataTotalVO } from '@/types/data'

export function getArticleTrend(months?: number) {
  return request.get<any, { data: Result<ArticleTrendVO> }>('/data/newArticleTrend', {
    params: { months }
  })
}

export function getDataTotal() {
  return request.get<any, { data: Result<DataTotalVO> }>('/data/total')
}
