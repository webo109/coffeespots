import cafe1 from '@/assets/cafe-1.jpg';
import cafe2 from '@/assets/cafe-2.jpg';
import cafe3 from '@/assets/cafe-3.jpg';
import cafe4 from '@/assets/cafe-4.jpg';
import cafe5 from '@/assets/cafe-5.jpg';
import cafe6 from '@/assets/cafe-6.jpg';
import { Cafe } from '@/types/cafe';

export const initialCafes: Cafe[] = [
  {
    id: '1',
    name: 'The Golden Hour',
    location: 'Shibuya, Tokyo',
    image: cafe1,
    vibe: 5,
    productivity: 4,
    brew: 5,
    isElite: true,
    visitedAt: '2026-04-10',
    distance: 1.2,
  },
  {
    id: '2',
    name: 'Brick & Mortar',
    location: 'Williamsburg, Brooklyn',
    image: cafe2,
    vibe: 4,
    productivity: 5,
    brew: 4,
    isElite: false,
    visitedAt: '2026-04-08',
    distance: 3.5,
  },
  {
    id: '3',
    name: 'Matcha Garden',
    location: 'Kyoto, Japan',
    image: cafe3,
    vibe: 5,
    productivity: 3,
    brew: 5,
    isElite: true,
    visitedAt: '2026-03-28',
    distance: 8.0,
  },
  {
    id: '4',
    name: 'The Copper Room',
    location: 'Shoreditch, London',
    image: cafe4,
    vibe: 5,
    productivity: 4,
    brew: 4,
    isElite: false,
    visitedAt: '2026-04-14',
    distance: 5.2,
  },
  {
    id: '5',
    name: 'Jardin Blanc',
    location: 'Le Marais, Paris',
    image: cafe5,
    vibe: 4,
    productivity: 3,
    brew: 5,
    isElite: true,
    visitedAt: '2026-04-01',
    distance: 6.8,
  },
  {
    id: '6',
    name: 'The Reading Room',
    location: 'Vienna, Austria',
    image: cafe6,
    vibe: 5,
    productivity: 5,
    brew: 3,
    isElite: false,
    visitedAt: '2026-04-12',
    distance: 2.1,
  },
];
