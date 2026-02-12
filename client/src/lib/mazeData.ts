export type CellType = 0 | 1 | 2; // 0: Empty, 1: Wall, 2: Goal

// 8x8 Grid
// 0: Empty path
// 1: Wall
// 2: Goal
export const INITIAL_MAZE: CellType[][] = [
  [0, 0, 1, 0, 0, 0, 0, 0],
  [1, 0, 1, 0, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 1, 0],
  [0, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 1, 0],
  [1, 1, 0, 1, 0, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 1, 2], // Goal at bottom right
  [0, 1, 1, 1, 1, 0, 0, 0], // Extra row? Wait, requirement said 8x8.
];

// Let's ensure a solvable 8x8 maze
export const LEVEL_1: CellType[][] = [
  [0, 0, 0, 0, 1, 0, 0, 0], // Start at 0,0
  [1, 1, 1, 0, 1, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 0, 1, 1, 1, 0, 1],
  [0, 0, 0, 1, 0, 0, 0, 2], // Goal at 7,6? No 7,7 is bottom right.
  [0, 1, 0, 0, 0, 1, 1, 0],
];

// Let's refine for a clear path to 7,7
export const MAZE_GRID: CellType[][] = [
  [0, 0, 1, 0, 0, 0, 0, 0], // 0,0 is Start
  [0, 1, 1, 0, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 1, 0],
  [1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 1, 0],
  [0, 1, 1, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 1, 1, 0, 1],
  [0, 0, 0, 1, 1, 0, 0, 2], // 7,7 is Goal
];

export const DIRECTIONS = [
  { dx: 0, dy: -1, label: 'UP' },    // 0
  { dx: 1, dy: 0, label: 'RIGHT' },  // 1
  { dx: 0, dy: 1, label: 'DOWN' },   // 2
  { dx: -1, dy: 0, label: 'LEFT' },  // 3
] as const;
