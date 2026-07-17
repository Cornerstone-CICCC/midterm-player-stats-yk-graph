export interface PerformanceListRow {
  id: number
  player_name: string
  nationality: string | null
  position: string | null
  match_date: string
  opponent_team: string | null
  goals: number | null
  assists: number | null
  player_rating: number | null
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface PerformanceListResponse {
  data: PerformanceListRow[]
  pagination: PaginationMeta
}
