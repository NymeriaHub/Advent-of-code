import fs from 'fs'
import { Pos } from '../../utils/types/map'
import { sleep } from '../../utils/sleep'
import { debugMap } from '../../utils/debug'

const possibleMoves = {
  '^': {x: -1, y: 0},
  '<': {x: 0, y: -1},
  'v': {x: 1, y: 0},
  '>': {x: 0, y: 1}
} as const

function init(maxX: number, maxY: number) {
  let map: string[][] = Array(maxX)

  for (let i = 0; i < maxX; i++) {
    map[i] = Array(maxY).fill('.')
  }
  return map
}

async function debug(size: Pos, wallPos: Map<string, Pos>, robotPos: Pos, boxesPos: Map<string, Pos>) {
  let map = init(size.x, size.y)
  map[robotPos.x][robotPos.y] = '@'
  for (let [_, box] of wallPos) {
    map[box.x][box.y] = '#'
  }
  for (let [_, box] of boxesPos) {
    map[box.x][box.y] = 'O'
  }
  await sleep(100)
  debugMap([`${robotPos.x}.${robotPos.y}`, ...map.map(line => line.join(''))])
}

function parse(map: string[]): { robotPos: Pos, boxesPos: Map<string, Pos>, wallPos: Map<string, Pos>} {
  let robotPos: Pos = {x: 1, y: 1}
  const boxesPos: Map<string, Pos> = new Map()
  const wallPos: Map<string, Pos> = new Map()
  map.forEach((line, x) => {
    line.split('').forEach((char, y) => {
      if (char === '@') robotPos = {x, y}
      if (char === 'O') boxesPos.set(`${x}.${y}`,{x, y})
      if (char === '#') wallPos.set(`${x}.${y}`, {x, y})
    })
  })

  return { robotPos, boxesPos, wallPos }
}

function calcNextPos(wallPos: Map<string, Pos>, pos: Pos, boxes: Map<string, Pos>, dir: Pos) {
  const nextPos = {x: pos.x + dir.x, y: pos.y + dir.y}
  if (wallPos.has(`${nextPos.x}.${nextPos.y}`)) return
  let boxToMove = []
  let moveBoxes = false
  if (boxes.has(`${nextPos.x}.${nextPos.y}`)) {
    let currPos = {...nextPos}

    while (boxes.has(`${currPos.x}.${currPos.y}`)) {
      boxToMove.push(`${currPos.x}.${currPos.y}`)
      currPos.x += dir.x
      currPos.y += dir.y
    }
    if (wallPos.has(`${currPos.x}.${currPos.y}`)) return
    moveBoxes = true
  }
  if (boxToMove.length > 0 && moveBoxes) {
    boxToMove.reverse().forEach(box => {
      const boxPos = boxes.get(box) as Pos
      const boxNextPos = {x: boxPos.x + dir.x, y: boxPos.y + dir.y}
      boxes.set(`${boxNextPos.x}.${boxNextPos.y}`, boxNextPos)
      boxes.delete(box)
    })
  }
  pos.x = nextPos.x
  pos.y = nextPos.y
}

async function part1() {
  const startTime = performance.now()
  const [first, second] = fs.readFileSync('./src/2024/day15/prod.txt', 'utf8').split('\n\n')
  const map = first.split('\n')
  const moves = second.split('\n').join('')
  let result = 0
  const { robotPos, boxesPos, wallPos } = parse(map)
  const size = {x: map.length, y: map[0].length}
  for (let i = 0; i < moves.length; i++) {
    const nextMove = moves[i] as keyof typeof possibleMoves
    // await debug(size, wallPos, robotPos, boxesPos)
    // console.log(nextMove)
    calcNextPos(wallPos, robotPos, boxesPos, possibleMoves[nextMove])
  }
  for (let [_, box] of boxesPos) {
    result += 100 * box.x + box.y
  }
  const endTime = performance.now()
  console.log(`Part 1: ${result}`)
  console.log(`Time: ${endTime - startTime}ms`)
}

async function part2() {
  const startTime = performance.now()
  const file = fs.readFileSync('./src/2024/day15/test.txt', 'utf8')
  
  const result = 0

  const endTime = performance.now()
  console.log(`Part 2: ${result}`)
  console.log(`Time: ${endTime - startTime}ms`)
}

void part1()
// void part2()
