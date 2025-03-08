import fs from 'fs'
import { Pos } from '../../utils/types/map'

function isAdjacent(posA: Pos, posB: Pos): boolean {
  if (posA.x === posB.x + 1 && posA.y === posB.y) return true
  if (posA.x === posB.x - 1 && posA.y === posB.y) return true
  if (posA.x === posB.x && posA.y === posB.y + 1) return true
  if (posA.x === posB.x && posA.y === posB.y - 1) return true
  return false
}

function isCorner(map: string[], pos: Pos, type: string): boolean {
  const top = map[pos.x - 1]?.[pos.y]
  const down = map[pos.x + 1]?.[pos.y]
  const left = map[pos.x]?.[pos.y - 1]
  const right = map[pos.x]?.[pos.y + 1]

  return (
    (top === type && left === type) ||
    (top === type && right === type) ||
    (down === type && left === type) ||
    (down === type && right === type)
  )
}

function isInnerCorner(map: string[], pos: Pos, type: string): number {
  const corners = [map[pos.x - 1]?.[pos.y - 1], map[pos.x + 1]?.[pos.y - 1], map[pos.x + 1]?.[pos.y + 1], map[pos.x - 1]?.[pos.y + 1]]

  return corners.filter(c => c === type).length
}

function parcour(map: string[], type: string, pos: Pos, area: Set<Pos>, visited: Set<string>) {
  if (!map[pos.x]?.[pos.y] || visited.has(`${pos.x}.${pos.y}`) || map[pos.x][pos.y] != type) {
    return area
  }
  visited.add(`${pos.x}.${pos.y}`)
  area.add(pos)
  parcour(map, type, {x: pos.x + 1, y: pos.y}, area, visited)
  parcour(map, type, {x: pos.x - 1, y: pos.y}, area, visited)
  parcour(map, type, {x: pos.x, y: pos.y + 1}, area, visited)
  parcour(map, type, {x: pos.x, y: pos.y - 1}, area, visited)

  return area
}

async function part1() {
  const startTime = performance.now()
  const map = fs.readFileSync('./src/2024/day12/test.txt', 'utf8').split('\n')
  let result = 0
  let visited: Set<string> = new Set()
  map.forEach((line, index) => {
    for (let i = 0; i < line.length; i++) {
      if (!visited.has(`${index}.${i}`)) {
        const area = parcour(map, line[i], {x: index, y:i}, new Set<Pos>(), visited)
        let perimeter = 0
        area.forEach(a => {
          const adjacentsOfSameType = [...area.values()].filter(ar => isAdjacent(a, ar))
          perimeter += (4 - adjacentsOfSameType.length)
        })
        result += (perimeter * area.size)
      }
    }
  })

  const endTime = performance.now()
  console.log(`Part 1: ${result}`)
  console.log(`Time: ${endTime - startTime}ms`)
} 

async function part2() {
  const startTime = performance.now()
  const map = fs.readFileSync('./src/2024/day12/test.txt', 'utf8').split('\n')
  
  let result = 0
  let visited: Set<string> = new Set()
  map.forEach((line, index) => {
    for (let i = 0; i < line.length; i++) {
      if (!visited.has(`${index}.${i}`) && line[i] === 'C') {
        const area = parcour(map, line[i], {x: index, y:i}, new Set<Pos>(), visited)
        let perimeter = 0
        area.forEach(a => {
          const areaArray = [...area.values()]
          const adjacentsOfSameType = areaArray.filter(ar => isAdjacent(a, ar))
          switch (adjacentsOfSameType.length) {
            case 0: {
              console.log(4, a, adjacentsOfSameType)
              perimeter += 4
              break
            }
            case 1: {
              console.log(2, a, adjacentsOfSameType)
              perimeter += 2
              break
            }
            case 2: {
              console.log(1, a, adjacentsOfSameType)
              if (isCorner(map, a, line[i])) {
                perimeter += 1
              }
              break;
            }
            case 4: {
              perimeter += isInnerCorner(map, a, line[i])
              break;
            }
          }
        })
        console.log({type: line[i], area: area.size, perimeter})
        result += (perimeter * area.size)
      }
    }
  })

  const endTime = performance.now()
  console.log(`Part 2: ${result}`)
  console.log(`Time: ${endTime - startTime}ms`)
}

void part1()
void part2()
