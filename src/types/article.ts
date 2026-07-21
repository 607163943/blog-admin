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

export interface ArticleSaveDTO {
  articleContent: string
  articleCover?: string
  articleStatus: number
  articleSummary?: string
  articleTitle: string
  categoryId: number
  tagIds?: number[]
}

export interface ArticleUpdateDTO extends ArticleSaveDTO {
  id: number
}

export interface ArticleDetailVO {
  id: number
  articleTitle: string
  categoryId: number
  articleSummary: string
  articleContent: string
  articleCover: string
  tagIds: number[]
  articleStatus: number // [0]草稿 [1]发布
}
