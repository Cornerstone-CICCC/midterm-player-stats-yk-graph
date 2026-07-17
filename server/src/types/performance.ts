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

export interface PerformanceDetailRow {
  // performances
  id: number
  player_id: string
  match_id: string
  opponent_team: string | null
  match_result: string | null
  goals_team: number | null
  goals_opponent: number | null
  minutes_played: number | null
  goals: number | null
  assists: number | null
  shots: number | null
  shots_on_target: number | null
  expected_goals_xg: number | null
  expected_assists_xa: number | null
  key_passes: number | null
  successful_passes: number | null
  total_passes: number | null
  pass_accuracy: number | null
  dribbles_attempted: number | null
  successful_dribbles: number | null
  crosses: number | null
  successful_crosses: number | null
  tackles: number | null
  interceptions: number | null
  clearances: number | null
  blocks: number | null
  aerial_duels_won: number | null
  aerial_duels_lost: number | null
  recoveries: number | null
  defensive_actions: number | null
  fouls_committed: number | null
  fouls_suffered: number | null
  yellow_cards: number | null
  red_cards: number | null
  offsides: number | null
  saves: number | null
  save_percentage: number | null
  punches: number | null
  clean_sheet: number | null
  goals_conceded: number | null
  penalty_saves: number | null
  distance_covered_km: number | null
  sprint_distance_km: number | null
  top_speed_kmh: number | null
  accelerations: number | null
  decelerations: number | null
  stamina_score: number | null
  player_rating: number | null
  performance_score: number | null
  offensive_contribution: number | null
  defensive_contribution: number | null
  possession_impact: number | null
  pressure_resistance: number | null
  creativity_score: number | null
  consistency_score: number | null
  clutch_performance_score: number | null
  // JOIN: players
  player_name: string
  nationality: string | null
  team: string | null
  jersey_number: number | null
  position: string | null
  club_name: string | null
  // JOIN: matches
  match_date: string
  stadium: string | null
  city: string | null
  tournament_stage: string | null
}

export interface RankingRow {
  player_id: string
  player_name: string
  nationality: string | null
  position: string | null
  matches_played: string
  total_goals: string
  total_assists: string
  avg_rating: number | null
}
