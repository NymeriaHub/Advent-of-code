import fs from 'fs'

function evaluate1(numbers: number[], target: number, currentValue = numbers[0], currentIndex = 0): boolean {
  if (currentValue > target) return false
  if (currentValue === target) return true

  const nextNumber = numbers[currentIndex + 1]
  if (!nextNumber) return false
  
  return evaluate1(numbers, target, currentValue + nextNumber, currentIndex + 1) || 
          evaluate1(numbers, target, currentValue * nextNumber, currentIndex + 1)
}

function evaluate2(numbers: number[], target: number, currentValue = numbers[0], currentIndex = 0): boolean {
  if (currentValue > target) return false
  if (currentValue === target && currentIndex === numbers.length - 1) return true

  const nextNumber = numbers[currentIndex + 1]
  if (nextNumber === undefined) return false

  const concatNumber = Number(`${currentValue}${nextNumber}`)

  return evaluate2(numbers, target, currentValue + (nextNumber), currentIndex + 1) ||
          evaluate2(numbers, target, currentValue * (nextNumber), currentIndex + 1) 
          || evaluate2(numbers, target, concatNumber, currentIndex + 1)
}

function exo(evaluate: (numbers: number[], target: number, currentValue: number, currentIndex: number) => boolean, part: number) {
  const startTime = performance.now()
  const lines = fs.readFileSync('./src/2024/day7/prod.txt', 'utf8').split('\n')
  
  let result = 0
  lines.forEach(line => {
    const [expectedResult, operands] = line.split(': ')
    const numbers = operands.split(' ').map(Number)
    const target = parseInt(expectedResult)
    const resultat = evaluate(numbers, target, numbers[0], 0)
    if (resultat) result += target
  })
  const endTime = performance.now()
  console.log(`Part ${part}: ${result}`)
  console.log(`Time: ${endTime - startTime}ms`)
}
void exo(evaluate1, 1)
void exo(evaluate2, 2)
