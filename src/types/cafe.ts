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
}

export type SortOption = 'highest' | 'work' | 'nearest' | 'recent';
