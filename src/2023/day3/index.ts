import { readFileSync } from "fs";

function findSymbolAroundCoordinates(lines: string[], i: number, j: number) {
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      if (
        lines[i + x] &&
        lines[i + x][j + y] &&
        !['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'].includes(lines[i + x][j + y])
      ) {
        return true
      }
    }
  }
  return false;
}

function findGearsAtCoordinates(lines: string[], i: number, j: number) {
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      if (lines[i + x] && lines[i + x][j + y] && lines[i + x][j + y] === '*') {
        return [i + x, j + y]
      }
    }
  }
  return false;
}

function part1() {
  const start = performance.now();
  const lines = readFileSync('./src/2023/day3/part1.txt', 'utf8').split('\n');
  let sum = 0

  const addToSum = (number: string, hasSymbolAround: boolean) => {
    if(number && hasSymbolAround) {
      sum+=Number(number);
    }
  }

  for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      let hasSymbolAround = false;
      let number = '';

      for (let j = 0; j < line.length; j++) {
        if (isNaN(Number(line[j]))) {
          addToSum(number, hasSymbolAround);
          number = ''
          hasSymbolAround = false;
          continue;
        };
        if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(line[j])) {
          number += line[j];
          hasSymbolAround ||= findSymbolAroundCoordinates(lines, i, j); 
        }
        if (!line[j + 1]) {
          addToSum(number, hasSymbolAround);
        }
      }
    }
    const end = performance.now();
    console.log(`Part 1: ${end - start}ms`);
    return sum;
}

function part2() {
  const start = performance.now();
  const lines = readFileSync('./src/2023/day3/part2.txt', 'utf8').split('\n');
  let gears: Record<string, number[]> = {}

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let hasGears = '';
    let number = '';

    for (let j = 0; j < line.length; j++) {
      if (isNaN(Number(line[j]))) {
        if (hasGears && number) {
          gears[hasGears] = [...(gears[hasGears] || []), Number(number)];
        }
        number = ''
        hasGears = '';
        continue;
      };
      if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(line[j])) {
        number += line[j];
        const gearsAtCoordinates = findGearsAtCoordinates(lines, i, j);
        if (gearsAtCoordinates) {
          hasGears = `${gearsAtCoordinates[0]}-${gearsAtCoordinates[1]}`;
        }
      }
      if (!line[j + 1] && hasGears && number) {
        gears[hasGears] = [...(gears[hasGears] || []), Number(number)];
      }
    }
  }
  const end = performance.now();
  console.log(`Part 2: ${end - start}ms`);
  return Object.values(gears).filter(gear => gear.length >= 2).reduce((acc, gear) => acc + gear.reduce((a, b) => a * b, 1), 0);
}

console.log(part1());
console.log(part2());

