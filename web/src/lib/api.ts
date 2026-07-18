const BASE_URL = import.meta.env.PUBLIC_API_BASE_URL ?? "http://localhost:3000";

export interface PerformanceListRow {
  id: number;
  player_name: string;
  nationality: string | null;
  position: string | null;
  match_date: string;
  opponent_team: string | null;
  goals: number | null;
  assists: number | null;
  player_rating: number | null;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PerformanceListResponse {
  data: PerformanceListRow[];
  pagination: PaginationMeta;
}

export interface PerformanceDetail {
  id: number;
  player_id: string;
  match_id: string;
  player_name: string;
  nationality: string | null;
  team: string | null;
  position: string | null;
  club_name: string | null;
  jersey_number: number | null;
  match_date: string;
  stadium: string | null;
  city: string | null;
  tournament_stage: string | null;
  opponent_team: string | null;
  match_result: string | null;
  [key: string]: string | number | null;
}

export async function fetchPerformances(
  params: URLSearchParams,
): Promise<PerformanceListResponse> {
  const res = await fetch(`${BASE_URL}/api/performances?${params}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch performances: ${res.status}`);
  }
  return res.json();
}

export async function fetchPerformanceById(
  id: number,
): Promise<PerformanceDetail | null> {
  const res = await fetch(`${BASE_URL}/api/performances/${id}`);
  if (res.status === 404) return null;
  if (!res.ok)
    throw new Error(`Failed to fetch performance ${id}: ${res.status}`);
  const json = await res.json();
  return json.data;
}
