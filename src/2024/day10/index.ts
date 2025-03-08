import fs from 'fs'
import { Pos } from '../../utils/types/map'

function findTrail(map: string[], pos: Pos, toLook: string, trail: Pos[] = [], memo: Set<string>): number {
  if (!map[pos.x]?.[pos.y] || map[pos.x][pos.y] !== toLook) {
    return 0
  }
  if (map[pos.x][pos.y] === '9' && toLook === '9') {
    memo.add(`${trail[0].x},${trail[0].y},${pos.x},${pos.y}`)
    return 1
  }
  return findTrail(map, {x: pos.x + 1, y: pos.y}, (Number(map[pos.x][pos.y]) + 1).toString(), [...trail, pos], memo) +
         findTrail(map, {x: pos.x - 1, y: pos.y}, (Number(map[pos.x][pos.y]) + 1).toString(), [...trail, pos], memo) +
         findTrail(map, {x: pos.x, y: pos.y + 1}, (Number(map[pos.x][pos.y]) + 1).toString(), [...trail, pos], memo) +
         findTrail(map, {x: pos.x, y: pos.y - 1}, (Number(map[pos.x][pos.y]) + 1).toString(), [...trail, pos], memo)
}

async function part1() {
  const startTime = performance.now()
  const lines = fs.readFileSync('./src/2024/day10/prod.txt', 'utf8').split('\n')
  let result = 0
  const memo = new Set<string>()
  lines.forEach((line, index) => {
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '0') {
        result += findTrail(lines, {x: index, y: i}, '0', [], memo)
      }
    }
  })

  const endTime = performance.now()
  console.log(`Part 1: ${memo.size}`)
  console.log(`Time: ${endTime - startTime}ms`)
}

async function part2() {
  const startTime = performance.now()
  const lines = fs.readFileSync('./src/2024/day10/prod.txt', 'utf8').split('\n')
  
  let result = 0
  const memo = new Set<string>()
  lines.forEach((line, index) => {
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '0') {
        result += findTrail(lines, {x: index, y: i}, '0', [], memo)
      }
    }
  })

  const endTime = performance.now()
  console.log(`Part 2: ${result}`)
  console.log(`Time: ${endTime - startTime}ms`)
}

void part1()
void part2()
