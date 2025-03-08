import fs from 'fs'

function parse(file: string) {
  let disk = []
  let toggle = true
  let fileId = 0
  const freeSpace: number[] = []
  const files: number[] = []
  for (let i = 0; i < file.length; i++) {
    if (toggle) files.push(Number(file[i]))
    else freeSpace.push(Number(file[i]))
    for (let j = 0; j < Number(file[i]); j++) {
      if (toggle) {
        disk.push(fileId)
      } else {
        disk.push('.')
      }
    }
    if (toggle) fileId++
    toggle = !toggle
  }

  return {disk, freeSpace, files}
}

async function part1() {
  const startTime = performance.now()
  const file = fs.readFileSync('./src/2024/day9/prod.txt', 'utf8')
  const {disk} = parse(file)
  const copy = [...disk]
  let i = 0;
  let j = copy.length - 1
  while (i < j) {
    while (j && copy[j] === '.') j--
    if (copy[i] === '.') {
      copy[i] = copy[j]
      copy[j] = '.'
      j--
    }
    i++
  }
  const result = copy.reduce((acc: number, cur, index) => cur !== '.' ? acc += (index * Number(cur)) : acc, 0)

  const endTime = performance.now()
  console.log(`Part 1: ${result}`)
  console.log(`Time: ${endTime - startTime}ms`)
}

function findFirstSpace(disk: (number| string)[], sizeToLook: number, maxIndex: number) {
  for (let i = 0; i < maxIndex; i++) {
    let count = 0

    while (disk[i] !== '.') i++
    while (disk[i] === '.') {
      count++
      i++
    }
    if (count >= sizeToLook)
       return i - count
  }
}

async function part2() {
  const startTime = performance.now()
  const file = fs.readFileSync('./src/2024/day9/prod.txt', 'utf8')
  
  const {disk} = parse(file)
  for (let i = disk.length - 1; i >= 0; i--) {
    while (disk[i] === '.') i--
    let currId = disk[i]
    let currIdSize = 0
    while (disk[i] === currId) {
      currIdSize++
      i--
    }
    i++
    const index = findFirstSpace(disk, currIdSize, i)
    if (index && index < i) {
      disk.splice(index, currIdSize, ...new Array(currIdSize).fill(currId))
      disk.splice(i, currIdSize, ...new Array(currIdSize).fill('.'))
    }
  }

  const result = disk.reduce((acc: number, cur, index) => cur !== '.' ? acc += (index * Number(cur)) : acc, 0)

  const endTime = performance.now()
  console.log(`Part 2: ${result}`)
  console.log(`Time: ${endTime - startTime}ms`)
}

void part1()
void part2()
