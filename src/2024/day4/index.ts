import fs from 'fs'
const search = 'XMAS'
const direction = {
  N: {i: 1,j: 0},
  NE: {i: 1,j: 1},
  E: {i: 0,j: 1,},
  SE: {i: -1,j: 1},
  S: {i: -1, j: 0},
  SO: {i:-1, j:-1},
  O: {i: 0, j:-1},
  NO: {i: 1, j: -1}
} as const

function parse(lines: string[], i: number, j: number, index: number, dir?: keyof typeof direction) {
  if (lines[i]?.[j] !== search[index]) return 0
  if (index >= search.length) return 0
  if (lines[i]?.[j] === search[index] && index === search.length - 1) {
    return 1
  }
  if (dir) {
    return parse(lines, i + direction[dir].i, j+direction[dir].j, index+1, dir)
  }
  let total = 0
  Object.keys(direction).map((key) => {
    const value = key as keyof typeof direction
    total += parse(lines, i + direction[value].i, j + direction[value].j, index + 1, value)
  })

  return total
}

function part1() {
  const startTime = performance.now();
  const lines = fs.readFileSync('./src/2024/day4/prod.txt', 'utf8').split('\n')
  let total = 0
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    for (let j = 0; j < line.length; j++) {
      total += parse(lines, i, j, 0)
    }
  }
  console.log(total)
  const endTime = performance.now();
  console.log(`Part 1: ${endTime - startTime}ms`);
}

function part2() {
  const startTime = performance.now();
  const lines = fs.readFileSync('./src/2024/day4/prod.txt', 'utf8').split('\n')
  let total = 0

  const firstDiag = (i: number, j: number) => {
    if ((lines[i - 1]?.[j - 1] === 'M' && lines[i + 1]?.[j + 1] === 'S') || 
    (lines[i - 1]?.[j - 1] === 'S' && lines[i + 1]?.[j + 1] === 'M') 
  ) {
      return true
    }
    return false
  }

  const secondDiag = (i: number, j: number) => {
    if ((lines[i + 1]?.[j - 1] === 'M' && lines[i - 1]?.[j + 1] === 'S') || 
    (lines[i + 1]?.[j - 1] === 'S' && lines[i - 1]?.[j + 1] === 'M') 
  ) {
      return true
    }
    return false
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    for (let j = 0; j < line.length; j++) {
      if (line[j] === 'A') {
        if (firstDiag(i, j) && secondDiag(i, j))
          total++
      }
    }
  }
  console.log(total)
  const endTime = performance.now();
  console.log(`Part 2: ${endTime - startTime}ms`);
}


void part1()
void part2()