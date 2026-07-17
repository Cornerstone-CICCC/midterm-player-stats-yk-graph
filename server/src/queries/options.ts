import { pool } from '../db/pool.js'
import type { PlayerOption, MatchOption } from '../types/options.js'

const PLAYER_OPTIONS_SQL = `
  SELECT player_id, player_name, nationality
  FROM players
  ORDER BY player_name
`

const MATCH_OPTIONS_SQL = `
  SELECT match_id, match_date, stadium, tournament_stage
  FROM matches
  ORDER BY match_date, match_id
`

export async function findPlayerOptions(): Promise<PlayerOption[]> {
  const result = await pool.query<PlayerOption>(PLAYER_OPTIONS_SQL)
  return result.rows
}

export async function findMatchOptions(): Promise<MatchOption[]> {
  const result = await pool.query<MatchOption>(MATCH_OPTIONS_SQL)
  return result.rows
}
