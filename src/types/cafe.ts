export interface VisitEntry {
  date: string;
  note?: string;
}

export interface Cafe {
  id: string;
  name: string;
  location: string;
  image: string;
  vibe: number;
  productivity: number;
  brew: number;
  isElite: boolean;
  visitedAt: string;
  distance?: number;
  latitude?: number;
  longitude?: number;
  notes?: string;
  visitHistory?: VisitEntry[];
}

export type SortOption = 'highest' | 'work' | 'nearest' | 'recent';
