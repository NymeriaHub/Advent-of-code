import fs from 'fs'
import { PatternChecker } from '../../utils/tree/pattern'

function parse(file: string) {
  const [pattern, expected] = file.split('\n\n')
  const patternChecker = new PatternChecker()
  pattern.split(', ').forEach(pat => patternChecker.insert(pat))
  return {patternChecker, expected: expected.split('\n')}
}

async function part1() {
  const startTime = performance.now()
  const file = fs.readFileSync('./src/2024/day19/prod.txt', 'utf8')
  const {patternChecker, expected} = parse(file)
  let result = 0

  for (let index = 0; index < expected.length; index++) {
    const match: boolean[] = Array(expected[index].length + 1).fill(false)
    match[0] = true
    for (let i = 0; i < expected[index].length; i++) {
      if (!match[i]) continue
      let j = i
      while (j < expected[index].length) {
        const substring = expected[index].substring(i, j + 1)
        if (patternChecker.check(substring)) {
          match[j + 1] = true
        }
        j++
      }
    }
    if (match[expected[index].length]) result++
  }

  const endTime = performance.now()
  console.log(`Part 1: ${result}`)
  console.log(`Time: ${endTime - startTime}ms`)
}

async function part2() {
  const startTime = performance.now()
  const file = fs.readFileSync('./src/2024/day19/prod.txt', 'utf8')
  const {patternChecker, expected} = parse(file)
  let result = 0

  for (let index = 0; index < expected.length; index++) {
    const match: number[] = Array(expected[index].length + 1).fill(0)
    match[0] = 1

    for (let i = 0; i < expected[index].length; i++) {
      if (!match[i]) continue
      let j = i
      while (j < expected[index].length) {
        const substring = expected[index].substring(i, j + 1)
        if (patternChecker.check(substring)) {
          match[j + 1] += match[i]
        }
        j++
      }
    }
    result += match[expected[index].length]
  }
  const endTime = performance.now()
  console.log(`Part 2: ${result}`)
  console.log(`Time: ${endTime - startTime}ms`)
}

void part1()
void part2()
