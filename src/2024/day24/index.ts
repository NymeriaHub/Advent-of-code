import fs from 'fs'

type Operator = 'XOR' | 'OR' | 'AND'
type Operation = {
  leftOperand: string
  rightOperand: string
  operator: Operator
}
type Operations = Map<string, Operation>


function parse(file: string) {
  const [rawWires, rawLogic] = file.split('\n\n')
  const wires: Map<string, boolean> = new Map()
  const operations: Operations = new Map()
  const opRegex = /([a-z0-9]{3}) (AND|XOR|OR) ([a-z0-9]{3}) -> ([a-z0-9]{3})/
  rawWires.split('\n').forEach(line => {
    const tmp = line.split(': ')
    wires.set(tmp[0], tmp[1] === '1')
  })
  rawLogic.split('\n').forEach(line => {
    const match = opRegex.exec(line)
    if (match) {
      operations.set(match[4], {
        leftOperand: match[1],
        rightOperand: match[3],
        operator: match[2] as Operator
      })
    }
  })
  return {wires, operations}
}


function computeOperation(left: boolean, right: boolean, operator: Operator): boolean {
  switch (operator) {
    case 'OR':
      return left || right
    case 'XOR':
      return Boolean(Number(left)^ Number(right))
    case 'AND':
      return left! && right
  }
}

function compute(operations: Operations, destination: string, wires: Map<string, boolean>, results: Map<string, boolean>): boolean {
  const current = operations.get(destination)!
  let left = wires.get(current.leftOperand) ?? results.get(current.leftOperand)
  let right = wires.get(current.rightOperand) ?? results.get(current.rightOperand)
  if (left !== undefined && right !== undefined) {
    const result = computeOperation(left, right, current.operator as Operator)
    results.set(destination, result)
    return result
  }

  if (!left) {
    left = compute(operations, current.leftOperand, wires, results)
  }
  if (!right) {
    right = compute(operations, current.rightOperand, wires, results)
  }
  return computeOperation(left!, right!, current.operator as Operator)
}

async function part1() {
  const startTime = performance.now()
  const file = fs.readFileSync('./src/2024/day24/prod.txt', 'utf8')
  const {wires, operations} = parse(file)
  const zKeys = [...operations.keys()].filter(op => op[0] === 'z')
  const results = new Map<string, boolean>()
  for (const key of zKeys) {
    results.set(key, compute(operations, key, wires, results))
  }
  const zResult = [...results.keys()].filter(op => op[0] === 'z').sort().reverse()
  let result = 0n

  for (const key of zResult) {
    result <<= 1n
    result += BigInt(results.get(key)!)
  }
  const endTime = performance.now()
  console.log(`Part 1: ${result}`)
  console.log(`Time: ${endTime - startTime}ms`)
}

function addition(xBits: boolean[], yBits: boolean[]): boolean[] {
  const maxLength = Math.max(xBits.length, yBits.length) + 1; // Pour le bit de retenue
  const zBits: boolean[] = Array(maxLength).fill(false);
  let carry = false;

  for (let i = 0; i < maxLength - 1; i++) {
    const x = xBits[i] || false;
    const y = yBits[i] || false;
    const sum = Number(x) ^ Number(y) ^ Number(carry);
    carry = (x && y) || Boolean((Number(x) ^ Number(y)) && carry)
    zBits[i] = Boolean(sum % 2);
  }
  zBits[maxLength - 1] = carry;
  return zBits;
}

async function part2() {
  const startTime = performance.now()
  const file = fs.readFileSync('./src/2024/day24/test.txt', 'utf8')
  const {wires, operations} = parse(file)
  
  const endTime = performance.now()
  console.log(`Part 2: ${0}`)
  console.log(`Time: ${endTime - startTime}ms`)
}

void part1()
void part2()
