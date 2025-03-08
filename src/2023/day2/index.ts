import { readFileSync } from "fs";

function parseGame(line: string) {
  const [_, cubes] = line.split(':');
  const sets = cubes.split(';')
    .map(set => set.split(',')
    .reduce((acc: Record<string, number>, cube) => {
      const [count, color] = cube.trim().split(' ');
      acc[color] = Number(count);
      return acc;
    }, {}));
  return sets;
}

function part1() {
  const startTime = performance.now();
  const expected = { red: 12, green: 13, blue: 14 };
  const lines = readFileSync('./src/2023/day2/part1.txt', 'utf8').split('\n');
  const games = lines.map(parseGame);
  let sum = 0
  games.forEach((game, index) => {
    const valid = game.every(set => Object.entries(set).every(([color, count]) => count <= expected[color as keyof typeof expected]));
    if (valid) {
      sum += index + 1;
    }
  });
  const endTime = performance.now();
  console.log(`Part 1: ${endTime - startTime}ms`);
  return sum;
}

function part2() {
  const startTime = performance.now();
  const lines = readFileSync('./src/2023/day2/part2.txt', 'utf8').split('\n');
  const games = lines.map(parseGame);
  let sum = 0;
  games.forEach(game => {
    const min = { red: 0, green: 0, blue: 0 };
    game.forEach(set => {
      Object.entries(set).forEach(([color, count]) => {
        min[color as keyof typeof min] = Math.max(min[color as keyof typeof min], count);
      });
    })
    const power = Object.values(min).reduce((acc, curr) => acc * curr, 1);
    sum += power;
  });

  const endTime = performance.now();
  console.log(`Part 2: ${endTime - startTime}ms`);
  return sum;
}

console.log(part1());
console.log(part2());
