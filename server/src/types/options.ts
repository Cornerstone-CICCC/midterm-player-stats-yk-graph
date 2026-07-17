export interface PlayerOption {
  player_id: string
  player_name: string
  nationality: string | null
}

export interface MatchOption {
  match_id: string
  match_date: string
  stadium: string | null
  tournament_stage: string | null
}
