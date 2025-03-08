import fs from 'fs'
import { Pos } from '../../utils/types/map'
import { debugMap } from '../../utils/debug'
import { sleep } from '../../utils/sleep'

type Robot = {
  pos: Pos,
  velocity: Pos
}

let maxByMode = {
  test: {x: 7, y: 11},
  prod: {x: 103, y: 101}
}

function getNextPos(pos: Pos, vector: Pos, maxX: number, maxY: number): Pos {
  let nextX
  let nextY
  if (pos.x + vector.x < 0) nextX = maxX + (pos.x + vector.x)
  else if (pos.x + vector.x > (maxX - 1)) nextX = (pos.x + vector.x) - maxX
  else nextX = pos.x + vector.x
  if (pos.y + vector.y < 0) nextY = maxY + (pos.y + vector.y)
  else if (pos.y + vector.y > (maxY - 1)) nextY = (pos.y + vector.y) - maxY
  else nextY = pos.y + vector.y
  return {x: nextX, y: nextY}
}

function dispatch(pos: Pos, maxX: number, maxY: number): -1 | 0 | 1 | 2 | 3 {
  if (pos.x < Math.floor(maxX / 2) && pos.y < Math.floor(maxY / 2)) return 0
  if (pos.x < Math.floor(maxX / 2) && pos.y >= Math.ceil(maxY / 2)) return 1
  if (pos.x >= Math.ceil(maxX / 2) && pos.y < Math.floor(maxY / 2)) return 2
  if (pos.x >= Math.ceil(maxX / 2) && pos.y >= Math.ceil(maxY / 2)) return 3
  return -1
}

async function part1() {
  const startTime = performance.now()
  let mode: 'test' | 'prod' = 'prod'
  const file = fs.readFileSync(`./src/2024/day14/${mode}.txt`, 'utf8')
  const regex = /p=(\d+),(\d+) v=(-{0,1}\d+),(-{0,1}\d+)/g
  const quadrants: number[] = new Array(4).fill(0)
  let match
  const max = maxByMode[mode]
  while (match = regex.exec(file)) {
    const x = Number(match[2])
    const y = Number(match[1])
    const vx = Number(match[4])
    const vy = Number(match[3])
    let currPos: Pos = {x, y}
    for (let i = 0; i < 100; i++) {
      currPos = {...getNextPos(currPos, {x: vx, y: vy}, max.x, max.y)}
    }
    let index = dispatch(currPos, max.x, max.y)
    if (index !== -1) quadrants[index]++
  }
  const endTime = performance.now()
  console.log(`Part 1: ${quadrants.reduce((acc, curr) => acc * curr, 1)}`)
  console.log(`Time: ${endTime - startTime}ms`)
}

async function debug(map: string[], index: number) {
  await sleep(100)
  debugMap([index.toString(), ...map])
}

function init(maxX: number, maxY: number) {
  let map: string[][] = Array(maxX)

  for (let i = 0; i < maxX; i++) {
    map[i] = Array(maxY).fill('.')
  }
  return map
}

async function part2() {
  const startTime = performance.now()
  let mode: 'test' | 'prod' = 'prod'
  const file = fs.readFileSync(`./src/2024/day14/${mode}.txt`, 'utf8')
  const regex = /p=(\d+),(\d+) v=(-{0,1}\d+),(-{0,1}\d+)/g
  const robots: Robot[] = []
  let result = 0
  let match
  const max = maxByMode[mode]
  while (match = regex.exec(file)) {
    const x = Number(match[2])
    const y = Number(match[1])
    const vx = Number(match[4])
    const vy = Number(match[3])
    robots.push({
      pos: {x, y},
      velocity: {x: vx, y: vy}
    })
  }
  for (let i = 0; i < 10000; i++) {
    const quadrants: number[] = new Array(4).fill(0)
    const robotPos: string[][] = init(max.x, max.y)
    for (let j = 0; j < robots.length; j++) {
      let currPos = getNextPos(robots[j].pos, robots[j].velocity, max.x, max.y)
      robotPos[currPos.x][currPos.y] = '#'
      robots[j].pos = {...currPos}
      let index = dispatch(currPos, max.x, max.y)
      if (index !== -1) quadrants[index]++
    }
    quadrants.forEach(async q => {
      if (q > 250) {
        result = i
      }
    })
  }
  const endTime = performance.now()
  console.log(`Part 2: ${result}`)
  console.log(`Time: ${endTime - startTime}ms`)
}

void part1()
void part2()
