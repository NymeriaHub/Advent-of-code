import fs from 'fs'
import { sleep } from '../../utils/sleep'
import { debugLine, debugMap, waitInput } from '../../utils/debug'

type Pos = {
  x: number,
  y: number
}
type Dir = 'up' | 'down' | 'right' | 'left'

const forward: Record<Dir, Pos> = {
  'up': {x: -1, y: 0},
  'down': {x: 1, y: 0},
  'left': {x: 0, y: -1},
  'right': {x: 0, y: 1}
}

const backward: Record<Dir, Pos> = {
  'up': {x: 1, y: 0},
  'down': {x: -1, y: 0},
  'left': {x: 0, y: 1},
  'right': {x: 0, y: -1}
}

const nextDir: Record<Dir, Dir> = {
  'up': 'right',
  'right': 'down',
  'down': 'left',
  'left': 'up'
}

function parse(file: string) {
  const lines = file.split('\n')
  let guardPosition: Pos = {x: 0, y: 0}
  lines.forEach((line, index) => {
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '^') guardPosition = {x: index, y: i}
    }
  })

  return {guardPosition, lines: file.split('\n')}
}

function calcNextPosition(pos: Pos, dir: Dir) {
  return {x: pos.x + forward[dir].x, y: pos.y + forward[dir].y}
}

function calcLastPosition(pos: Pos, dir: Dir) {
  return {x: pos.x + backward[dir].x, y: pos.y + backward[dir].y}
}

async function debug(file: string, guardPosition: Pos) {
  const map = file.replace('^', '.').split('\n')
  const newMap = map.map((line, index) => {
    if (index === guardPosition.x) {
      const newLine = line.split('')
      newLine.splice(guardPosition.y, 1, '0')
      return newLine.join('')
    }
    else return line
  })
  await sleep(100)
  debugMap(newMap)
}

async function part1() {
  const startTime = performance.now();
  const file = fs.readFileSync('./src/2024/day6/prod.txt', 'utf8')
  const {guardPosition: original, lines} = parse(file)
  let guardPosition = {...original}
  let currentDir: Dir = 'up'
  const visited: Map<string, boolean> = new Map()
  visited.set(`${guardPosition.x}.${guardPosition.y}`, true)
  while (true) {
    // await debug(file, guardPosition)
    let newCoor = calcNextPosition(guardPosition, currentDir)
    if (!lines[newCoor.x]?.[newCoor.y]) break
    if (lines[newCoor.x][newCoor.y] === '#') {
      currentDir = nextDir[currentDir]
    } else {
      visited.set(`${newCoor.x}.${newCoor.y}`, true)
      guardPosition = {...newCoor}
    }
  }
  console.log([...visited.keys()].length)
  const endTime = performance.now();
  console.log(`Part 1: ${endTime - startTime}ms`);
}

function replace(file: string, pos: Pos) {
  return file.split('\n').map((line, index) => {
    if (index === pos.x) {
      const newLine = line.split('')
      newLine.splice(pos.y, 1, '#')
      return newLine.join('')
    }
    else return line
  }).join('\n')
}

async function parcour(lines: string[], originalPosition: Pos, currentDir: Dir) {
  let guardPosition = {...originalPosition}
  const visited: Map<string, boolean> = new Map()
  visited.set(`${guardPosition.x}.${guardPosition.y}.up`, true)
  while (true) {
    // await debug(lines.join('\n'), guardPosition)
    let newCoor = calcNextPosition(guardPosition, currentDir)
    if (!lines[newCoor.x]?.[newCoor.y]) break
    if (visited.has(`${newCoor.x}.${newCoor.y}.${currentDir}`)) {
      return undefined
    }
    if (lines[newCoor.x][newCoor.y] === '#') {
      currentDir = nextDir[currentDir]
    } else {
      visited.set(`${newCoor.x}.${newCoor.y}.${currentDir}`, true)
      guardPosition = {...newCoor}
    }
  }
  return visited
}

async function part2() {
  const startTime = performance.now();
  const file = fs.readFileSync('./src/2024/day6/prod.txt', 'utf8')
  const {guardPosition, lines} = parse(file)
  const visited = await parcour(lines, guardPosition, 'up')
  if (!visited) return 0
  let total = new Map<string, boolean>()
  const visitList = [...visited.keys()]
  for (const visit of visitList) {
    const [x, y, currentDir] = visit.split('.')
    if (!(Number(x) === guardPosition.x && Number(y) === guardPosition.y && currentDir === 'up')) {
      const newFile = replace(file, {x: Number(x), y: Number(y)})
      const {lines: newLines} = parse(newFile)
      if (await parcour(newLines, guardPosition, 'up' as Dir) === undefined) {
        total.set(`${x}.${y}`, true)
      }
      // await waitInput('next')
    }
  }
  console.log([...total.keys()].length)
  const endTime = performance.now();
  console.log(`Part 2: ${endTime - startTime}ms`);
}


  void part1()
  void part2()