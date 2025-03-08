import fs from 'fs'

async function part1() {
  const startTime = performance.now()
  let numbers = fs.readFileSync('./src/2024/day11/prod.txt', 'utf8').split(' ')
  let map: Map<string, number> = new Map()
  numbers.forEach(n => map.set(n, 1))

  for (let i = 0; i < 25; i++) {
    const copy: Map<string, number> = new Map()
    map.forEach((value, number) => {
      getNextNumber(number).forEach(n => {
        copy.set(n, copy.has(n) ? (copy.get(n) as number) + value : value)
      })
    })
    map = new Map(copy)
  }
  const endTime = performance.now()
  console.log(`Part 1: ${[...map.values()].reduce((acc, value) => acc + value, 0)}`)
  console.log(`Time: ${endTime - startTime}ms`)
}

function getNextNumber(number: string): string[] {
  switch (true) {
    case number === '0': return ['1']
    case number.toString().length % 2 === 0: return [Number(number.slice(0, number.length / 2)).toString(), Number(number.slice(number.length / 2)).toString()]
    default: return [(Number(number) * 2024).toString()]
  }
}

async function part2() {
  const startTime = performance.now()
  let numbers = fs.readFileSync('./src/2024/day11/prod.txt', 'utf8').split(' ')
  let map: Map<string, number> = new Map()
  numbers.forEach(n => map.set(n, 1))

  for (let i = 0; i < 75; i++) {
    const copy: Map<string, number> = new Map()
    map.forEach((value, number) => {
      getNextNumber(number).forEach(n => {
        copy.set(n, copy.has(n) ? (copy.get(n) as number) + value : value)
      })
    })
    map = new Map(copy)
  }
  const endTime = performance.now()
  console.log(`Part 2: ${[...map.values()].reduce((acc, value) => acc + value, 0)}`)
  console.log(`Time: ${endTime - startTime}ms`)
}

void part1()
void part2()
