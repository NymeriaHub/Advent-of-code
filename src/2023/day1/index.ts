import { readFileSync } from 'fs';

function part1() {
  const startTime = performance.now();
  const lines = readFileSync('./src/2023/day1/part1.txt', 'utf8').split('\n');
  const numbers = lines.map(line => {
    const numbers = line.match(/\d+/g)?.join('');
    if (!numbers) return 0;
    return Number(numbers[0] + numbers[numbers.length - 1]);
  });
  const endTime = performance.now();
  console.log(`Part 1: ${endTime - startTime}ms`);
  return numbers.reduce((a, b) => a + b, 0);
}

function part2() {
  const startTime = performance.now();
  const regex = /one|two|three|four|five|six|seven|eight|nine|\d+/;
  const reverseRegex = /eno|owt|eerht|ruof|evif|xis|neves|thgie|enin|\d+/;
  const convert = {
    one: '1',
    two: '2',
    three: '3',
    four: '4',
    five: '5',
    six: '6',
    seven: '7',
    eight: '8',
    nine: '9',
  };
  const reverseConvert = {
    eno: '1',
    owt: '2',
    eerht: '3',
    ruof: '4',
    evif: '5',
    xis: '6',
    neves: '7',
    thgie: '8',
    enin: '9',
  };

  const lines = readFileSync('./src/2023/day1/part2.txt', 'utf8').split('\n');
  const numbers = lines.map(line => {
    const reverseLine = line.split('').reverse().join('');
    const firstNumber = convert[line.match(regex)?.[0] as keyof typeof convert] ?? line.match(regex)?.[0];
    const lastNumber = reverseConvert[reverseLine.match(reverseRegex)?.[0] as keyof typeof reverseConvert] ?? reverseLine.match(reverseRegex)?.[0];
    return Number(firstNumber[0] + lastNumber[0]);
  });
  const endTime = performance.now();
  console.log(`Part 2: ${endTime - startTime}ms`);
  return numbers.reduce((a, b) => a + b, 0);
}

console.log(part1());
console.log(part2());
