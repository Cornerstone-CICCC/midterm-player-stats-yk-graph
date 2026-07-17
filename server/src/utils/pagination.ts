export interface PaginationParams {
  limit: number
  offset: number
  page: number
}

const ALLOWED_LIMITS = [10, 25, 50, 100]
const DEFAULT_LIMIT = 10

export function parsePagination(query: { page?: unknown; limit?: unknown }): PaginationParams {
  const rawLimit = Number(query.limit)
  const limit = ALLOWED_LIMITS.includes(rawLimit) ? rawLimit : DEFAULT_LIMIT

  const rawPage = Number(query.page)
  const page = Number.isInteger(rawPage) && rawPage >= 1 ? rawPage : 1

  const offset = (page - 1) * limit
  return { limit, offset, page }
}

export { ALLOWED_LIMITS }
