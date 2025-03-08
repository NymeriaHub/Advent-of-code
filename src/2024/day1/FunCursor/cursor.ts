import fs from 'fs';

function parseInput(input: string): [number[], number[]] {

    const lines = input.trim().split('\n');
    const left: number[] = [];
    const right: number[] = [];
    
    for (const line of lines) {
        const [l, r] = line.trim().split(/\s+/).map(Number);
        left.push(l);
        right.push(r);
    }
    
    return [left, right];
}

function part1(): number {
    const input = fs.readFileSync('./src/2024/day1/part1.txt', 'utf8');

    const [left, right] = parseInput(input);
    const sortedLeft = [...left].sort((a, b) => a - b);
    const sortedRight = [...right].sort((a, b) => a - b);
    
    let totalDistance = 0;
    for (let i = 0; i < sortedLeft.length; i++) {
        totalDistance += Math.abs(sortedLeft[i] - sortedRight[i]);
    }
    
    return totalDistance;
}

function part2(): number {
const input = fs.readFileSync('./src/2024/day1/part1.txt', 'utf8');

    const [left, right] = parseInput(input);
    
    // Créer un map des fréquences pour la liste de droite
    const rightFrequencies = new Map<number, number>();
    for (const num of right) {
        rightFrequencies.set(num, (rightFrequencies.get(num) || 0) + 1);
    }
    
    // Calculer le score de similarité
    let similarityScore = 0;
    for (const num of left) {
        similarityScore += num * (rightFrequencies.get(num) || 0);
    }
    
    return similarityScore;
}

const start1 = performance.now();
const result1 = part1();
const end1 = performance.now();
console.log(`Part 1: ${result1} (${end1 - start1}ms)`);

const start2 = performance.now(); 
const result2 = part2();
const end2 = performance.now();
console.log(`Part 2: ${result2} (${end2 - start2}ms)`);
