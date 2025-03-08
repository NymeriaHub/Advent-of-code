import fs from 'fs'
import { Dir, Pos } from '../../utils/types/map'

type Possible = 'face' | 'right' | 'left'
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

function parse(file: string) {
  const lines = file.split('\n')
  const walls: Map<string, Pos> = new Map()
  const path: Map<string, Pos> = new Map()
  let start: Pos = {} as Pos
  let end: Pos = {} as Pos

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    for (let j = 0; j < line.length; j++) {
      switch (line[j]) {
        case '.': 
          path.set(`${i}.${j}`, {x: i, y: j})
          break
        case '#':
          walls.set(`${i}.${j}`, {x: i, y: j})
          break
        case 'S':
          start = {x: i, y: j}
          break
        case 'E':
          end = {x: i, y: j}
          break
      }
    }
  }
  return {walls, path, start, end}
}

function dijkstra(
  walls: Map<string, Pos>,
  start: { x: number; y: number; dir: Dir },
  end: { x: number; y: number },
): {cost: number, distance: Map<string, number>} {
  const distance: Map<string, number> = new Map();

  const isValid = (x: number, y: number): boolean => !walls.has(`${x}.${y}`);
  const key = (x: number, y: number, dir: Dir) => `${x}.${y}.${dir}`;

  const priorityQueue: State[] = [{...start, cost: 0}]
  distance.set(key(start.x, start.y, start.dir), 0)

  while (priorityQueue.length) {
    const current = priorityQueue.shift() as State
    const currentKey = key(current.x, current.y, current.dir)
    if (current.x === end.x && current.y === end.y) {
      const result = new Map()
      for (const [key, value] of distance) {
        const newKey = key.split('.').filter(val => Number.isInteger(Number(val))).join('.')
        result.set(newKey, value)
      }
      return {cost: current.cost, distance: result};
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
      const newCost = current.cost + 1;
      const newKey = key(newX, newY, newDir);

      if (newCost < (distance.get(newKey) ?? Infinity)) {
        distance.set(newKey, newCost)
        priorityQueue.push({ cost: newCost, x: newX, y: newY, dir: newDir });
        priorityQueue.sort((a, b) => a.cost - b.cost)
      }
    }
  }
  return {cost: 0, distance: new Map()}
}


async function part1() {
  const startTime = performance.now()
  const file = fs.readFileSync('./src/2024/day20/prod.txt', 'utf8')
  const {walls, path, start, end} = parse(file)
  const {cost: total, distance} = dijkstra(walls, {...start, dir: 'up'}, end)
  const result = Array(total).fill(0)
  for (const [_, value] of walls) {
    const up = `${value.x - 1}.${value.y}`
    const down = `${value.x + 1}.${value.y}`
    const left = `${value.x}.${value.y - 1}`
    const right = `${value.x}.${value.y + 1}`
    if (value.x === 3 && value.y === 2)
    console.log({up, down, left, right, hasUp: distance.has(up), hasDown: distance.has(down), hasLeft: distance.has(left), hasRight: distance.has(right)})
    if (distance.has(up) && distance.has(down)) result[Math.abs(distance.get(up)! - distance.get(down)!)] +=1
    if (distance.has(left) && distance.has(right)) result[Math.abs(distance.get(left)! - distance.get(right)!)] +=1
  }

  const endTime = performance.now()

  console.log(`Part 1: ${result.slice(102).reduce(((acc, val) => acc + val), 0)}`)
  console.log(`Time: ${endTime - startTime}ms`)
}

async function part2() {
  const startTime = performance.now()
  const file = fs.readFileSync('./src/2024/day20/test.txt', 'utf8')
  
  const {walls, path, start, end} = parse(file)
  const {cost: total, distance} = dijkstra(walls, {...start, dir: 'up'}, end)
  const result = Array(total).fill(0)

  const calcDistance = (start: Pos, end: Pos) => (Math.abs(start.x - end.x) + Math.abs(start.y - end.y))
  for (const [_, value] of path) {
    const dist = calcDistance(value, end)
    const oldDist = distance.get(`${value.x}.${value.y}`)
    console.log(oldDist, (total - dist))
  }
  const endTime = performance.now()
  console.log(`Part 2: ${result.slice(102).reduce(((acc, val) => acc + val), 0)}`)
  console.log(`Time: ${endTime - startTime}ms`)
}

void part1()
void part2()
