import fs from 'fs'

function checkLine(levels: number[]) {
  let safe = true
  const sens = levels[1] - levels[0] > 0 ? 'asc' : 'desc'
  for (let i = 0; i < levels.length - 1; i++) {
    if (!safe) continue
    if (
      ![1,2,3].includes(Math.abs(levels[i + 1] - levels[i])) ||
      levels[i + 1] - levels[i] > 0 && sens === 'desc' ||
      levels[i + 1] - levels[i] < 0 && sens === 'asc'
    ) {
      safe = false
    }
  }
  return safe
}

function part1() {
  const lines = fs.readFileSync('./src/2024/day2/part1.txt', 'utf8').split('\n')
  const startTime = performance.now();

  let result = 0
  lines.forEach((line) => {
    const levels = line.split(' ').map(number => Number(number))
    if (checkLine(levels)) result++
  })
  const endTime = performance.now();
  console.log(`Part 1: ${endTime - startTime}ms`);
  console.log(result)
}

function part2() {
  const startTime = performance.now();
  const lines = fs.readFileSync('./src/2024/day2/part2.txt', 'utf8').split('\n')

  let result = 0
  lines.forEach((line,index) => {
    const levels = line.split(' ').map(number => Number(number))
    console.log(levels)
    let badLevel = -1
    let isUnsafe = false
    const sens = levels[0] - levels[1] > 0 ? 'desc' : 'asc'

    for (let i = 0; i < levels.length - 1; i++) {
      if (isUnsafe) continue
      const first = badLevel > 0 && badLevel + 1 === i ? levels[i - 1] : levels[i]
      const second = levels[i + 1]
      if (
        ![1,2,3].includes(Math.abs(second - first)) || 
        first - second > 0 && sens === 'asc' || 
        first - second < 0 && sens === 'desc'
      ) {
        if (badLevel > 0) {
          isUnsafe = true
        }
        badLevel = i
        if (i === 0) {
          i++
        }
      }
    }
    if (!isUnsafe) {
      console.log('ok', index)
      result++
    }
  })
  const endTime = performance.now();
  console.log(`Part 1: ${endTime - startTime}ms`);
  console.log(result)
}

function part2Bis() {
  const lines = fs.readFileSync('./src/2024/day2/part2.txt', 'utf8').split('\n')
  const startTime = performance.now();

  let result = 0
  lines.forEach((line) => {
    const levels = line.split(' ').map(number => Number(number))
    let error = 0
    for (let i = 0; i < levels.length; i++) {3
      const newLine = [...levels]
      newLine.splice(i, 1)
      if (checkLine(newLine)) error ++
    }
    if (error >= 1) result++
  })
  const endTime = performance.now();
  console.log(`Part 1: ${endTime - startTime}ms`);
  console.log(result)
}

void part1()
void part2Bis()