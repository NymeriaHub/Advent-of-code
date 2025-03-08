import fs from 'fs'

function prune(secret: bigint, prune: bigint): bigint {
  return secret % prune
}

function mix(secret: bigint, mixer: bigint): bigint {
  return secret ^ mixer
}

function firstProcess(secret: bigint): bigint {
  let result = mix(secret, secret * 64n)
  return prune(result, 16777216n)
}

function secondProcess(secret: bigint): bigint {
  let result = mix(secret, secret / 32n)
  return prune(result, 16777216n)
}

function thirdProcess(secret: bigint): bigint {
  let result = mix(secret, secret * 2048n)
  return prune(result, 16777216n)
}

async function part1() {
  const startTime = performance.now()
  const file = fs.readFileSync('./src/2024/day22/prod.txt', 'utf8').split('\n')
  let result = 0n
  file.forEach(value => {
    let secret = BigInt(value)
    for (let i = 0; i < 2000; i++) {
      secret = firstProcess(secret)
      secret = secondProcess(secret)
      secret = thirdProcess(secret)
      
    }
    result += secret
  })

  const endTime = performance.now()
  console.log(`Part 1: ${result}`)
  console.log(`Time: ${endTime - startTime}ms`)
}

async function part2() {
  const startTime = performance.now()
  const file = fs.readFileSync('./src/2024/day22/prod.txt', 'utf8').split('\n')
  
  let result = 0n
  const accumulated: Map<string, bigint> = new Map()
  file.forEach(value => {
    let secret = BigInt(value)
    let sequence = []
    const map = new Map<string, bigint>()
    for (let i = 0; i < 2000; i++) {
      let copy = secret
      secret = firstProcess(secret)
      secret = secondProcess(secret)
      secret = thirdProcess(secret)
      sequence.push(secret % 10n - copy % 10n)
      const key = sequence.slice(-4).join('.')
      if (i > 3 && !map.get(key)) {
        map.set(key, secret % 10n)
      }
    }
    for (const key of map.keys()) {
      accumulated.set(key, (accumulated.get(key) ?? 0n) + map.get(key)!)
    }
  })

  for(const key of accumulated.keys()) {
    if (accumulated.get(key)! > result) {
      result = accumulated.get(key)!
    }
  }

  const endTime = performance.now()
  console.log(`Part 2: ${result}`)
  console.log(`Time: ${endTime - startTime}ms`)
}

void part1()
void part2()
