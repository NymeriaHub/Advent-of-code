import fs from 'fs'

async function part1() {
  const startTime = performance.now()
  const file = fs.readFileSync('./src/2024/day21/test.txt', 'utf8')
  
  const result = 0

  const endTime = performance.now()
  console.log(`Part 1: ${result}`)
  console.log(`Time: ${endTime - startTime}ms`)
}

async function part2() {
  const startTime = performance.now()
  const file = fs.readFileSync('./src/2024/day21/test.txt', 'utf8')
  
  const result = 0

  const endTime = performance.now()
  console.log(`Part 2: ${result}`)
  console.log(`Time: ${endTime - startTime}ms`)
}

void part1()
// void part2()
