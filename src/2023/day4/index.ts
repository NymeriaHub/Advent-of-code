import fs from "fs";

export function part1() {
  const start = performance.now();
  const input = fs.readFileSync("src/2023/day4/part1.txt", "utf8").split("\n");
  let sum = 0;

  input.forEach((line) => {
    const [_, cards] = line.split(": ");
    const [winningNumbers, yourNumbers] = cards.split(" | ");
    const winningNumbersArray = winningNumbers.trim().split(" ").map(e => e.length ? Number(e) : null).filter(e => e !== null);
    const yourNumbersArray = yourNumbers.trim().split(" ").map(e => e.length ? Number(e) : null).filter(e => e !== null);
    const totalWinningCards = yourNumbersArray.filter((number) => winningNumbersArray.includes(number)).length;
    sum += totalWinningCards === 0 ? 0 : 2 ** (totalWinningCards - 1);
  });

  const end = performance.now();
  console.log(`Time taken: ${end - start} milliseconds`);
  return sum;
}

export function part2() {
  const start = performance.now();
  const input = fs.readFileSync("src/2023/day4/part2.txt", "utf8").split("\n");
  const multipliers: number[] = new Array(input.length).fill(1);

  input.forEach((line, index) => {
    const [_, cards] = line.split(": ");
    const [winningNumbers, yourNumbers] = cards.split(" | ");
    const winningNumbersArray = winningNumbers.trim().split(" ").map(e => e.length ? Number(e) : null).filter(e => e !== null);
    const yourNumbersArray = yourNumbers.trim().split(" ").map(e => e.length ? Number(e) : null).filter(e => e !== null);
    const totalWinningCards = yourNumbersArray.filter((number) => winningNumbersArray.includes(number)).length;
    for (let i = 1; i <= totalWinningCards; i++) {
      multipliers[index + i] += multipliers[index];
    }
  });
  
  const end = performance.now();
  console.log(`Time taken: ${end - start} milliseconds`);
  return multipliers.reduce((acc, curr) => acc + curr, 0);
}

console.log(part1());
console.log(part2());
