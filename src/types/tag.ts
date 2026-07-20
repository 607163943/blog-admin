export interface TagVO {
  id: number
  tagName: string
  createTime: string
  updateTime: string
}

export interface TagQuery {
  page: number
  pageSize: number
  tagName?: string
}

export interface TagUpdateDTO {
  id?: number
  tagName: string
}
