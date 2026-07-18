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

export async function fetchPerformances(
  params: URLSearchParams,
): Promise<PerformanceListResponse> {
  const res = await fetch(`${BASE_URL}/api/performances?${params}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch performances: ${res.status}`);
  }
  return res.json();
}
