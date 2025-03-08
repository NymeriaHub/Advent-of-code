import fs from 'fs'
import { Dir, Pos } from '../../utils/types/map'
import { sleep } from '../../utils/sleep'
import { debugMap } from '../../utils/debug'
import { init } from '../../utils/map'

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

function parse(file: string, size: number): Pos[] {
  const walls: Pos[] = file.split('\n').map((line) => {
    const coor = line.split(',')
    return {x: Number(coor[1]), y: Number(coor[0])}
  })
  return walls.slice(0, size)
}

async function debug(walls: Pos[], size: number) {
  let map = init(size, size)
  for (let wall of walls) {
    map[wall.x][wall.y] = '#'
  }
 
  await sleep(100)
  debugMap(map.map(line => line.join('')))
}

function dijkstra(
  walls: Set<string>,
  start: { x: number; y: number; dir: Dir },
  end: { x: number; y: number },
  size: number
): number {
  const distance: Map<string, number> = new Map();

  const isValid = (x: number, y: number): boolean => !walls.has(`${x}.${y}`) && (x >= 0 && y >= 0 && x < size && y < size);
  const key = (x: number, y: number, dir: Dir) => `${x}.${y}.${dir}`;

  const priorityQueue: State[] = [{...start, cost: 0}]
  distance.set(key(start.x, start.y, start.dir), 0)

  while (priorityQueue.length) {
    const current = priorityQueue.shift() as State
    const currentKey = key(current.x, current.y, current.dir)
    if (current.x === end.x && current.y === end.y) {
      return current.cost;
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
  return -1
}

const mode = {
  prod: {
    size: 71,
    mode: 'prod',
    wallSize: 1024
  },
  test: {
    size: 7,
    mode: 'test',
    wallSize: 12
  }
}

async function part1() {
  const startTime = performance.now()
  const m = mode['prod']
  const file = fs.readFileSync(`./src/2024/day18/${m.mode}.txt`, 'utf8')
  const walls = parse(file, m.wallSize)
  const setWalls: Set<string> = new Set()
  walls.forEach(wall => setWalls.add(`${wall.x}.${wall.y}`))
  const result = dijkstra(setWalls, {x: 0, y: 0, dir: 'up'}, {x: m.size -1, y: m.size -1}, m.size)

  const endTime = performance.now()
  console.log(`Part 1: ${result}`)
  console.log(`Time: ${endTime - startTime}ms`)
}

async function part2() {
  const startTime = performance.now()
  const m = mode['test']

  const file = fs.readFileSync(`./src/2024/day18/${m.mode}.txt`, 'utf8')
  let i = 1
  let result: Pos = {} as Pos
  while(true) {
    const walls = parse(file, i)
    const setWalls: Set<string> = new Set()
    walls.forEach(wall => setWalls.add(`${wall.x}.${wall.y}`))
    const res = dijkstra(setWalls, {x: 0, y: 0, dir: 'down'}, {x: m.size -1, y: m.size -1}, m.size)
    if (res === -1) {
      console.log(i)
      result = walls.pop() as Pos
      break
    }
    i++
  }
 
  const endTime = performance.now()
  console.log(`Part 2: ${result.y},${result.x}`)
  console.log(`Time: ${endTime - startTime}ms`)
}

async function part2Bis() {
  const startTime = performance.now()
  const m = mode['test']

  const file = fs.readFileSync(`./src/2024/day18/${m.mode}.txt`, 'utf8')
  const fileSize = file.split('\n').length
  let result: Pos = {} as Pos
  let previous = 0
  let current = Math.floor(fileSize / 2)
  let smallRange = [0, current]
  let bigRange = [current + 1, fileSize]
  let i = 0
  console.log(fileSize)
  while(i < fileSize) {
    const walls = parse(file, current)
    const setWalls: Set<string> = new Set()
    walls.forEach(wall => setWalls.add(`${wall.x}.${wall.y}`))
    const res = dijkstra(setWalls, {x: 0, y: 0, dir: 'down'}, {x: m.size -1, y: m.size -1}, m.size)
    console.log({res, current, previous, smallRange, bigRange})
    if (res === -1 && [0, 1].includes(Math.abs(current - previous))) {
      result = walls.pop() as Pos
      break
    }
    previous = current
    if (res > 0) {
      current = Math.floor(current + ((bigRange[1] - bigRange[0]) / 2))
      smallRange = [bigRange[0], current]
      bigRange = [current + 1, bigRange[1]]
    } else {
      current = Math.floor(current + (smallRange[1] - smallRange[0]) / 2)
      smallRange = [smallRange[0], current]
      bigRange = [current + 1, smallRange[1]]
    }
    i++
  }
 
  const endTime = performance.now()
  console.log(`Part 2: ${result.y},${result.x}`)
  console.log(`Time: ${endTime - startTime}ms`)
}

void part1()
void part2()
void part2Bis()
