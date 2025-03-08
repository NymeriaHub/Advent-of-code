import fs from 'fs'

function parse(file: string) {
  const firstList: number[] = []
  const secondList: number[] = []
  file.split('\n').forEach(element => {
    const ids = element.split(' ')
    firstList.push(Number(ids[0]))
    secondList.push(Number(ids[3]))
  });

  return [firstList, secondList]
}

function part1(){
  const startTime = performance.now();
  const file = fs.readFileSync('./src/2024/day1/part1.txt', 'utf8')
  const [firstList, secondList] = parse(file)
  const sorted1 = firstList.sort()
  const sorted2 = secondList.sort()
  let i = 0;
  let sum = 0
  while (i < firstList.length) {
    sum += Math.abs(sorted2[i] - sorted1[i])
    i++
  }
  console.log(sum)

  const endTime = performance.now();
  console.log(`Part 1: ${endTime - startTime}ms`);
}

function part2() {
  const startTime = performance.now();
  const file = fs.readFileSync('./src/2024/day1/part2.txt', 'utf8')
  const ref: Map<number, number> = new Map()
  const accumulated: Map<number, number> = new Map()
  file.split('\n').forEach(elem => {
    const ids = elem.split('  ')
    const first = Number(ids[0])
    const second = Number(ids[1])
    ref.set(first, (ref.get(first) ?? 0) + 1)
    accumulated.set(second, (accumulated.get(second) ?? 0)+ 1)
  })
  let sum = 0
  ref.forEach((value, key) => {
    sum += value * (key * (accumulated.get(key) ?? 0))
  })
  console.log(sum)
  const endTime = performance.  now();
  console.log(`Part 2: ${endTime - startTime}ms`);
}

void part1()
void part2()