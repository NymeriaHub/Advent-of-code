import fs from 'fs'
import { Tree } from '../../utils/tree/tree'
import Graph from '../../utils/graph/graph'

async function part1() {
  const startTime = performance.now()
  const file = fs.readFileSync('./src/2024/day23/prod.txt', 'utf8').split('\n')
  const graph = new Graph()
  const set: Set<string> = new Set()
  file.forEach(line => {
    const [first, second] = line.split('-')
    graph.addVertice(first, second)
  })

  const children = graph.graph()
  for (let key of children.keys()) {
    const currentChildrenKeys = [...children.get(key)!.keys()]
    for (let i = 0; i < currentChildrenKeys.length; i++) {
      for (let j = i + 1; j < currentChildrenKeys.length; j++) {
        if (children.has(currentChildrenKeys[i]) && children.get(currentChildrenKeys[i])!.has(currentChildrenKeys[j]) || 
            children.has(currentChildrenKeys[j]) && children.get(currentChildrenKeys[j])!.has(currentChildrenKeys[i])) {
          const keys = [key, currentChildrenKeys[i], currentChildrenKeys[j]].sort()
          if (/.*t[a-z]/.test(keys.join(',')))
            set.add(keys.join(','))
        }
      }
    }
  }

  const endTime = performance.now()
  console.log(`Part 1: ${set.size}`)
  console.log(`Time: ${endTime - startTime}ms`)
}

async function part2() {
  const startTime = performance.now()
  const file = fs.readFileSync('./src/2024/day23/prod.txt', 'utf8').split('\n')
  const graph = new Graph()
  file.forEach(line => {
    const [first, second] = line.split('-')
    graph.addVertice(first, second)
  })
  const children = graph.graph()
  const maximalCliques: Set<string>[] = [];
  const currentClique = new Set<string>();
  const candidateVertices = new Set<string>(children.keys());
  const excludedVertices = new Set<string>();
  graph.bronKerbosch(currentClique, candidateVertices, excludedVertices, children, maximalCliques)
  let maxClique: string[] = []
  maximalCliques.forEach(clique => {
    if (clique.size > maxClique.length) maxClique = [...clique]
  })
  const endTime = performance.now()
  console.log(`Part 2: ${maxClique.sort().join(',')}`)
  console.log(`Time: ${endTime - startTime}ms`)
}

void part1()
void part2()
