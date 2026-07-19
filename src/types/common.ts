// 基础响应结构
export interface Result<T> {
  code: number
  data: T
  msg: string
}

// 分页响应结构
export interface PageResult<T> {
  data: T[]
  total: number
}
