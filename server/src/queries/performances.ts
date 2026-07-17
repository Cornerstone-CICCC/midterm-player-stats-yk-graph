import { pool } from '../db/pool.js'
import type { PerformanceListRow, PerformanceDetailRow, RankingRow } from '../types/performance.js'

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

const DETAIL_SQL = `
  SELECT
    perf.*,
    p.player_name, p.nationality, p.team, p.jersey_number, p.position, p.club_name,
    m.match_date, m.stadium, m.city, m.tournament_stage
  FROM performances perf
  JOIN players p ON p.player_id = perf.player_id
  JOIN matches m ON m.match_id = perf.match_id
  WHERE perf.id = $1
`

const RANKINGS_SQL = `
  SELECT
    p.player_id,
    p.player_name,
    p.nationality,
    p.position,
    COUNT(perf.id)          AS matches_played,
    SUM(perf.goals)         AS total_goals,
    SUM(perf.assists)       AS total_assists,
    AVG(perf.player_rating) AS avg_rating
  FROM players p
  JOIN performances perf ON perf.player_id = p.player_id
  GROUP BY p.player_id, p.player_name, p.nationality, p.position
  ORDER BY total_goals DESC, avg_rating DESC
  LIMIT $1 OFFSET $2
`

const RANKINGS_COUNT_SQL = `
  SELECT COUNT(DISTINCT perf.player_id) AS total
  FROM performances perf
`

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

export async function findPerformanceById(id: number): Promise<PerformanceDetailRow | null> {
  const result = await pool.query<PerformanceDetailRow>(DETAIL_SQL, [id])
  return result.rows[0] ?? null
}

export async function findRankings(limit: number, offset: number): Promise<{ rows: RankingRow[]; total: number }> {
  const countResult = await pool.query<{ total: string }>(RANKINGS_COUNT_SQL)
  const dataResult = await pool.query<RankingRow>(RANKINGS_SQL, [limit, offset])
  return {
    rows: dataResult.rows,
    total: Number(countResult.rows[0].total),
  }
}
