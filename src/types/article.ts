export interface ArticleVO {
  id: number
  articleTitle: string
  categoryName: string
  articleSummary: string
  tags: string[]
  articleStatus: number // [0]草稿 [1]发布
  publishTime: string
}

export interface ArticleQuery {
  page: number
  pageSize: number
  articleTitle?: string
  categoryId?: number | ''
  tagId?: number | ''
  articleStatus?: number | ''
}

export interface ArticleStatusUpdateDTO {
  id: number
  articleStatus: number
}
