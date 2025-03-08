import fs from 'fs'
import { debugLine } from '../../utils/debug'
import { sleep } from '../../utils/sleep'

function combo(registerMap: Map<string, bigint>, operand: number): bigint {
  switch (operand) {
    case 0:
    case 1:
    case 2:
    case 3:
      return BigInt(operand)
    case 4:
      return registerMap.get('A') ?? BigInt(0)
    case 5:
      return registerMap.get('B') ?? BigInt(0)
    case 6: 
      return registerMap.get('C') ?? BigInt(0)
  }
  return BigInt(0)
}

const adv = (registerMap: Map<string, bigint>, operand: number): undefined => {
  const op = combo(registerMap, operand)
  const two: bigint = 2n
  const result = ((registerMap.get('A') ?? 0n) / two ** op)
  registerMap.set('A', result)
}

const bxl = (registerMap: Map<string, bigint>, operand: number): undefined => {
  registerMap.set('B', (registerMap.get('B') ?? 0n) ^ BigInt(operand))
}

const bst = (registerMap: Map<string, bigint>, operand: number): undefined => {
  const op = combo(registerMap, operand)
  const result = BigInt(op % 8n)
  registerMap.set('B', result % BigInt(1000))
}

const jnz = (registerMap: Map<string, bigint>, operand: number): undefined => {
}

const bxc = (registerMap: Map<string, bigint>, operand: number): undefined => {
  const result = (registerMap.get('B') ?? 0n) ^ (registerMap.get('C') ?? 0n)
  registerMap.set('B', result)
}

const out = (registerMap: Map<string, bigint>, operand: number): bigint => {
  const op = combo(registerMap, operand)
  return op % 8n
}

const bdv = (registerMap: Map<string, bigint>, operand: number): undefined => {
  const op = combo(registerMap, operand)
  const two: bigint = 2n
  const result = ((registerMap.get('A') ?? 0n) / two ** op)
  registerMap.set('B', result)
}

const cdv = (registerMap: Map<string, bigint>, operand: number): undefined => {
  const op = combo(registerMap, operand)
  const two: bigint = 2n
  const result = ((registerMap.get('A') ?? 0n) / two ** op)
  registerMap.set('C', result)
}

function parse(file: string): {registerMap: Map<string, bigint>, programs: [number,number][]} {
  const [registers, program] = file.split('\n\n')
  const registerRegex = /Register ([A-Z]): (\d+)/g
  const programRegex = /(\d,\d),*/g
  const registerMap: Map<string, bigint> = new Map()
  const programs: [number, number][] = []
  let match
  while (match = registerRegex.exec(registers)) {
    registerMap.set(match[1], BigInt(match[2]))
  }
  while (match = programRegex.exec(program)) {
    const [opcode, operand] = match[1].split(',')
    programs.push([Number(opcode), Number(operand)])
  }

  return {registerMap, programs}
}

function process(registerMap: Map<string, bigint>, programs: [number,number][]) {
  const operations = [adv, bxl, bst, jnz, bxc, out, bdv, cdv]
  const result: bigint[] = []
  let i = 0
  while (i < programs.length) {
    const [operator, operand] = programs[i]
    const res = operations[operator](registerMap, operand)
    if (res !== undefined) {
      result.push(res)
    }
    if (operator === 3 && (registerMap.get('A') ?? 0 )> 0) {
      i = operand
    } else {
      i++
    }
  }
  return result
}

async function part1() {
  const startTime = performance.now()
  const file = fs.readFileSync('./src/2024/day17/prod.txt', 'utf8')
  const {registerMap, programs} = parse(file)
  const result = process(registerMap, programs)
  const endTime = performance.now()
  console.log(`Part 1: ${result.join(',')}`)
  console.log(`Time: ${endTime - startTime}ms`)
}

async function part2() {
  const startTime = performance.now()
  const file = fs.readFileSync('./src/2024/day17/prod.txt', 'utf8')
  const {programs} = parse(file)
  const expected = programs.map(pro => pro.join(',')).join(',').split(',')
  console.log(expected)
  let A = 0n

  for (let i = expected.length - 1; i >= 0; i--) {
    const registerMap: Map<string, bigint> = new Map()
    A <<= 3n
    let result = ''
    do {
      registerMap.set('A', A)
      result = process(registerMap, programs).join('')
      if (result === expected.slice(i).join('')) break;
      A++
    }
    while (true)
    console.log(A)
  }
  const endTime = performance.now()
  console.log(`Part 1: ${A}`)
  console.log(`Time: ${endTime - startTime}ms`)
}

void part1()
void part2()
