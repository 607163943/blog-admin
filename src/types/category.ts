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
