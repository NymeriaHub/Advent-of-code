import fs from 'fs'

function part1() {
    const startTime = performance.now();
    const regexp = /mul\((\d{1,3}),(\d{1,3})\)/g
    const line = fs.readFileSync('./src/2024/day3/prod.txt', 'utf8')
    let match
    let sum = 0
    while (match = regexp.exec(line)) {
      sum += Number(match[1]) * Number(match[2])
    }
    console.log(sum)
    const endTime = performance.now();
    console.log(`Part 1: ${endTime - startTime}ms`);
}

function part2() {
  const startTime = performance.now();
  const regexp = /mul\((\d{1,3}),(\d{1,3})\)|do\(\)|don't\(\)/g
  const line = fs.readFileSync('./src/2024/day3/prod.txt', 'utf8')
  let match
  let sum = 0
  let skipNext = false
  while (match = regexp.exec(line)) {
    if (match[0] === 'do()') {
      skipNext = false
      continue
    }
    if (match[0] === "don't()") {
      skipNext = true
      continue
    }
    if (!skipNext)
      sum += Number(match[1]) * Number(match[2])
  }
  console.log(sum)
  const endTime = performance.now();
  console.log(`Part 2: ${endTime - startTime}ms`);
}
void part1()
void part2()