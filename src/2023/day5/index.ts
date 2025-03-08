import fs from "fs";

export function part1() {
  const start = performance.now();
  const input = fs.readFileSync("src/2023/day5/part1.txt", "utf8");
  const regex = /.*:\n([0-9. \n]*)\n\n/g;

  let seeds: number[] = /seeds: ([\d\s]+)/.exec(input)?.[1].split(" ").map(Number) ?? [];
  let match
  let ranges : {
    start: number,
    end: number,
    value: number
  }[][] = []

  while ((match = regex.exec(input)) !== null) {
    ranges.push(
      match[1].split("\n").map(line => {
        const [value, start, delta] = line.split(" ").map(Number)
        return {
          start,
          end: start + delta -1,
          value: start - value
        }
      })
    )
  }
  console.log(seeds,ranges)
  const end = performance.now();
  console.log(`Time taken: ${end - start} milliseconds`);
  return "";
}

export function part2() {
  return "";
}

console.log(part1());
console.log(part2());
