import fs from 'fs'

function parse(file: string) {
  const keys: number[][] = []
  const locks: number[][] = []
  const blocs = file.split('\n\n')
  let length = 0
  blocs.forEach(block => {
    const lines = block.split('\n')
    length = lines.length
    let isLock: boolean = !lines[0].includes('.')
    let curr: number[] = Array(lines[0].length).fill(0)
    for (let i = 0; i < lines.length; i++) {
      for (let j = 0; j < lines[i].length; j++) {
        if (isLock && i > 0 && lines[i][j] === '#') {
          curr[j]++
        }
        if (!isLock && i < lines.length - 1 && lines[i][j] === '#') {
          curr[j]++
        }
      }
    }
    isLock ? locks.push(curr) : keys.push(curr)
  })
  return {keys, locks, length}
}

async function part1() {
  const startTime = performance.now()
  const file = fs.readFileSync('./src/2024/day25/prod.txt', 'utf8')
  const {keys, locks, length} = parse(file)
  let result = 0
  keys.forEach(key => {
    locks.forEach(lock => {
      let fit = true
      for (let i = 0; i < lock.length; i++) {
        if (key[i] + lock[i] > length - 2) fit = false
      }
      if (fit) result++
    })
  })

  const endTime = performance.now()
  console.log(`Part 1: ${result}`)
  console.log(`Time: ${endTime - startTime}ms`)
}

async function part2() {
  const startTime = performance.now()
  const file = fs.readFileSync('./src/2024/day25/test.txt', 'utf8')
  
  const result = 0

  const endTime = performance.now()
  console.log(`Part 2: ${result}`)
  console.log(`Time: ${endTime - startTime}ms`)
}

void part1()
// void part2()
