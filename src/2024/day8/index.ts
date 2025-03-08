import fs from 'fs'
import { Pos } from '../../utils/types/map'

function findAntinodes(pos: Pos, otherPos: Pos[], maxX: number, maxY: number): Pos[] {
  const antinodes = []
  for (let op of otherPos) {
    const dist = {x: pos.x - op.x, y: pos.y - op.y}
    if (op.x - dist.x >= 0 && op.x - dist.x < maxX && op.y - dist.y >= 0 && op.y - dist.y < maxY)
      antinodes.push({x: op.x - dist.x, y: op.y - dist.y})
    if (dist.x + pos.x >= 0 && dist.x + pos.x < maxX && dist.y + pos.y >= 0 && dist.y + pos.y < maxY)
      antinodes.push({x: dist.x + pos.x, y: dist.y + pos.y})
  }
  return antinodes
}

function part1() {
  const startTime = performance.now()
  const lines = fs.readFileSync('./src/2024/day8/prod.txt', 'utf8').split('\n')
  const antennas: Map<string, Pos[]> = new Map()
  const antinodes: Set<string> = new Set()

  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines[i].length; j++) {
      if (lines[i][j] !== '.') {
        if (antennas.has(lines[i][j])) {
          findAntinodes({x: i, y: j}, antennas.get(lines[i][j]) as Pos[], lines.length, lines[0].length)
            .forEach(e => antinodes.add(`${e.x}.${e.y}`))
        }
        antennas.set(lines[i][j], [...antennas.get(lines[i][j]) ?? [], {x: i, y: j}])
      }
    }
  }

  const endTime = performance.now()
  console.log(`Part 1: ${antinodes.size}`)
  console.log(`Time: ${endTime - startTime}ms`)
}

function findAllAntinodes(pos: Pos, otherPos: Pos[], maxX: number, maxY: number): Pos[] {
  const antinodes = []
  for (let op of otherPos) {
    const dist = {x: pos.x - op.x, y: pos.y - op.y}
    let i = 1;
    while (op.x - (i * dist.x) >= 0 && op.x - (i * dist.x) < maxX && op.y - (i * dist.y) >= 0 && op.y - (i * dist.y) < maxY) {
      antinodes.push({x: op.x - (i * dist.x), y: op.y - (i * dist.y)})
      i++
    }
    i = 1
    while ((i * dist.x) + pos.x >= 0 && (i * dist.x) + pos.x < maxX && (i * dist.y) + pos.y >= 0 && (i * dist.y) + pos.y < maxY) {
      antinodes.push({x: (i * dist.x) + pos.x, y: (i * dist.y) + pos.y})
      i++
    }
  }
  return antinodes
}

function debug(lines: string[], antinodes: Set<Pos>) {
  for(let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines[i].length; j++) {
      if (lines[i][j] === '.' && [...antinodes.values()].some(an => an.x === i && an.y === j)) {
        process.stdout.write('#')
      } else {
        process.stdout.write(lines[i][j])
      }
    }
    console.log('')
  }
}

async function part2() {
  const startTime = performance.now()
  const lines = fs.readFileSync('./src/2024/day8/prod.txt', 'utf8').split('\n')
  const antennas: Map<string, Pos[]> = new Map()
  const antinodes: Set<string> = new Set()

  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines[i].length; j++) {
      if (lines[i][j] !== '.') {
        if (antennas.has(lines[i][j])) {
          findAllAntinodes({x: i, y: j}, antennas.get(lines[i][j]) as Pos[], lines.length, lines[0].length)
          .forEach(e => antinodes.add(`${e.x}.${e.y}`))
        }
        antinodes.add(`${i}.${j}`)
        antennas.set(lines[i][j], [...antennas.get(lines[i][j]) ?? [], {x: i, y: j}])
      }
    }
  }

  const endTime = performance.now()
  console.log(`Part 2: ${antinodes.size}`)
  console.log(`Time: ${endTime - startTime}ms`)
}

void part1()
void part2()
