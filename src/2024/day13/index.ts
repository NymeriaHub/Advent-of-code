import fs from 'fs'

function solve(a1: number, b1: number, c1: number, a2: number, b2: number, c2: number) {
  const p = a1 * b2 - a2 * b1
  const q = c1 * b2 - c2 * b1
  const x = q / p
  const y = (c1 - a1 * x) / b1
  if (!Number.isSafeInteger(y) || !Number.isSafeInteger(x)) return null
  return {x, y}
}

async function part1() {
  const startTime = performance.now()
  const file = fs.readFileSync('./src/2024/day13/prod.txt', 'utf8')
  const regex = /Button A: X\+(\d+), Y\+(\d+)\nButton B: X\+(\d+), Y\+(\d+)\nPrize: X=(\d+), Y=(\d+)/g
  let result = 0
  let match
  while (match = regex.exec(file)) {
    const a1 = Number(match[1])
    const a2 = Number(match[2])
    const c1 = Number(match[5])
    const b1 = Number(match[3])
    const b2 = Number(match[4])
    const c2 = Number(match[6])
    const solved = solve(a1, b1, c1, a2,b2,c2)
    result += solved ? solved.x *3 + solved.y : 0
  }
  const endTime = performance.now()
  console.log(`Part 1: ${result}`)
  console.log(`Time: ${endTime - startTime}ms`)
}

async function part2() {
  const startTime = performance.now()
  const file = fs.readFileSync('./src/2024/day13/prod.txt', 'utf8')
  const regex = /Button A: X\+(\d+), Y\+(\d+)\nButton B: X\+(\d+), Y\+(\d+)\nPrize: X=(\d+), Y=(\d+)/g
  let result = 0
  let match

  while (match = regex.exec(file)) {
    const a1 = Number(match[1])
    const a2 = Number(match[2])
    const c1 = Number(match[5]) + 10000000000000
    const b1 = Number(match[3])
    const b2 = Number(match[4])
    const c2 = Number(match[6]) + 10000000000000
    const solved = solve(a1, b1, c1, a2, b2, c2)
    result += solved ? solved.x * 3 + solved.y : 0
  }
  const endTime = performance.now()
  console.log(`Part 2: ${result}`)
  console.log(`Time: ${endTime - startTime}ms`)
}

void part1()
void part2()