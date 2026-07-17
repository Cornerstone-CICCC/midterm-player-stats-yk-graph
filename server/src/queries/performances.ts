import { pool } from '../db/pool.js'
import type { PerformanceListRow } from '../types/performance.js'

const BASE_SELECT = `
  SELECT
    perf.id,
    p.player_name,
    p.nationality,
    p.position,
    m.match_date,
    perf.opponent_team,
    perf.goals,
    perf.assists,
    perf.player_rating
  FROM performances perf
  JOIN players p ON p.player_id = perf.player_id
  JOIN matches m ON m.match_id = perf.match_id
`

const BASE_COUNT = `
  SELECT COUNT(*) AS total
  FROM performances perf
  JOIN players p ON p.player_id = perf.player_id
  JOIN matches m ON m.match_id = perf.match_id
`

const SEARCH_WHERE = `
  WHERE p.player_name ILIKE $1
     OR p.nationality ILIKE $1
     OR p.position    ILIKE $1
`

const SORTABLE_COLUMNS = {
  player_name: 'p.player_name',
  nationality: 'p.nationality',
  position: 'p.position',
  match_date: 'm.match_date',
  goals: 'perf.goals',
  assists: 'perf.assists',
  player_rating: 'perf.player_rating',
} as const

const DEFAULT_SORT = 'm.match_date'

export interface FindOptions {
  limit: number
  offset: number
  search: string
  sort: string
  order: 'asc' | 'desc'
}

export async function findPerformances(opts: FindOptions): Promise<{ rows: PerformanceListRow[]; total: number }> {
  const params: unknown[] = []
  let where = ''
  if (opts.search) {
    params.push(`%${opts.search}%`)
    where = SEARCH_WHERE
  }

  const sortColumn = SORTABLE_COLUMNS[opts.sort as keyof typeof SORTABLE_COLUMNS] ?? DEFAULT_SORT
  const order = opts.order === 'asc' ? 'ASC' : 'DESC'

  const countResult = await pool.query<{ total: string }>(`${BASE_COUNT} ${where}`, params)

  const dataResult = await pool.query<PerformanceListRow>(
    `${BASE_SELECT}
     ${where}
     ORDER BY ${sortColumn} ${order}
     LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, opts.limit, opts.offset],
  )

  return {
    rows: dataResult.rows,
    total: Number(countResult.rows[0].total),
  }
}
