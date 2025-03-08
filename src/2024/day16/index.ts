import fs from 'fs'
import { Dir, Pos } from '../../utils/types/map'

type Possible = 'face' | 'right' | 'left'
type PositionDirection = {pos: Pos, dir: Dir}
type State = {
  cost: number;
  x: number;
  y: number;
  dir: Dir;
}
const directions: Record<Dir, Pos> = {
  up: {x: -1, y: 0},
  down: {x: 1, y: 0},
  left: {x: 0, y: -1},
  right: {x: 0, y: 1}
}
const possibleDirs: Record<Dir,Record<Possible, Dir>> = {
  'up': {
    face: 'up',
    right: 'right',
    left: 'left'
  },
  'down': {
    face: 'down',
    right: 'left',
    left: "right"
  },
  'left': {
    face: 'left',
    right: 'up',
    left: 'down'
  },
  'right': {
    face: 'right',
    right: 'down',
    left: 'up'
  }
}

function parse(map: string[]): {walls: Set<string>, exit: Pos, start: Pos} {
  const walls: Set<string> = new Set()
  let exit: Pos ={x: 1, y: 1}
  let start: Pos = {x: 1, y: 1}
  map.forEach((line, x) => {
    line.split('').forEach((char, y) => {
      if (char === '#') walls.add(`${x}.${y}`)
      if (char === 'E') exit = {x, y}
      if (char === 'S') start = {x, y}
    })
  })

  return {walls, exit, start}
}

function visualizePath(grid: string[], path: Set<string>): string[] {
  // Copier la grille pour ne pas modifier l'originale
  const visualGrid = grid.map(row => row.split(''));
  for (const step of path) {
    // Sauter le point de départ et d'arrivée
    const [x, y] = step.split(',').map(Number) as number[]
    if (visualGrid[x][y] !== 'S' && visualGrid[x][y] !== 'E') {
      visualGrid[x][y] = '*'; // Marquer le chemin
    }
  }

  return visualGrid.map(row => row.join(''));
}

function dijkstra(
  walls: Set<string>,
  start: { x: number; y: number; dir: Dir },
  end: { x: number; y: number }
): {cost: number, path: Set<string>} | undefined {
  const distance: Map<string, number> = new Map();

  const isValid = (x: number, y: number): boolean => !walls.has(`${x}.${y}`);
  const key = (x: number, y: number, dir: Dir) => `${x}.${y}.${dir}`;

  const priorityQueue: State[] = [{...start, cost: 0}]
  const predecessors: Map<string, PositionDirection | null> = new Map();
  distance.set(key(start.x, start.y, start.dir), 0)
  predecessors.set(key(start.x, start.y, start.dir), null);

  while (priorityQueue.length) {
    const current = priorityQueue.shift() as State
    const currentKey = key(current.x, current.y, current.dir)
    if (current.x === end.x && current.y === end.y) {
      const path: Set<string> = new Set();
      let trace: State | null = current;
      let traceKey = currentKey;

      while (trace) {
        path.add(`${trace.x},${trace.y}`);
        const pre = predecessors.get(traceKey)
        if (pre) {
          trace = {x: pre.pos.x, y: pre.pos.y, dir: pre.dir, cost: 0};
          traceKey = key(trace.x, trace.y, trace.dir);
        } else {
          trace = null
        }
      }
      return {cost: current.cost, path};
    }

    if (current.cost > (distance.get(currentKey) ?? Infinity)) {
      continue;
    }

    const nextDirs = possibleDirs[current.dir];

    for (const move of ['face', 'left', 'right'] as const) {
      const newDir = nextDirs[move];
      const { x, y } = directions[newDir];
      const newX = current.x + x;
      const newY = current.y + y;
      if (!isValid(newX, newY)) continue
      const moveCost = move === 'face' ? 1 : 1001;
      const newCost = current.cost + moveCost;
      const newKey = key(newX, newY, newDir);

      if (newCost < (distance.get(newKey) ?? Infinity)) {
        distance.set(newKey, newCost)
        priorityQueue.push({ cost: newCost, x: newX, y: newY, dir: newDir });
        predecessors.set(newKey, { pos: {x: current.x, y: current.y}, dir: current.dir });
        priorityQueue.sort((a, b) => a.cost - b.cost)
      }
    }
  }
}

async function part1() {
  const startTime = performance.now()
  const file = fs.readFileSync('./src/2024/day16/prod.txt', 'utf8').split('\n')
  const { walls, exit, start } = parse(file)
  const result = dijkstra(walls, {...start, dir: 'right'}, exit)
  const endTime = performance.now()
  console.log(`Part 1: ${result?.cost}`)
  console.log(`Time: ${endTime - startTime}ms`)
}

async function part2() {
  const startTime = performance.now()
  const file = fs.readFileSync('./src/2024/day16/test.txt', 'utf8').split('\n')
  const { walls, exit, start } = parse(file)
  const result = dijkstra(walls, {...start, dir: 'right'}, exit)
  const endTime = performance.now()
  console.log(`Part 2: ${result?.path.size}`)
  console.log(`Time: ${endTime - startTime}ms`)
}

void part1()
void part2()
