import fs from 'fs'

type Graph = Map<string, string[]>;

function buildGraph(vertices: string[], edges: [string, string][]): Graph {
  const graph: Graph = new Map();

  // Initialiser chaque sommet avec une liste vide de voisins
  for (const vertex of vertices) {
    graph.set(vertex, []);
  }

  // Ajouter les dépendances
  for (const [from, to] of edges) {
    if (vertices.includes(to))
      graph.get(from)?.push(to);
  }

  return graph;
}

function isArrayOrdered(
  elements: string[],
  dependencies: [string, string][]
): boolean {
  // Créer un mapping des indices des éléments dans le tableau
  const indexMap = new Map<string, number>();
  elements.forEach((element, index) => {
    indexMap.set(element, index);
  });

  // Vérifier chaque dépendance
  for (const [a, b] of dependencies) {
    const indexA = indexMap.get(a);
    const indexB = indexMap.get(b);

    // Si l'un des éléments n'est pas présent dans le tableau, considérer comme non ordonné
    if (indexA === undefined || indexB === undefined) {
      return false;
    }

    // Si 'a' vient après 'b', le tableau n'est pas correctement ordonné
    if (indexA >= indexB) {
      return false;
    }
  }

  // Toutes les dépendances sont respectées
  return true;
}

function topologicalSort(
  elements: string[],
  graph: Graph
): string[] {
  const visited = new Set<string>();
  const visiting = new Set<string>();
  const result: string[] = [];

  function dfs(node: string): void {
    if (visiting.has(node)) {
      throw new Error(`Cycle détecté impliquant l'élément '${node}'`);
    }

    if (visited.has(node)) {
      return;
    }

    visiting.add(node);

    for (const neighbor of graph.get(node) || []) {
      dfs(neighbor);
    }

    visiting.delete(node);
    visited.add(node);

    result.unshift(node);
  }

  for (const node of elements) {
    if (!visited.has(node)) {
      dfs(node);
    }
  }

  return result;
}

function part1() {
  const startTime = performance.now();
  const file = fs.readFileSync('./src/2024/day5/prod.txt', 'utf8')
  const [raworder, books] = file.split('\n\n')
  const aretes = raworder.split('\n').map(o => o.split('|')) as [string, string][]
  let result = 0
  books.split('\n').forEach(book => {
    const pages = book.split(',')
    const graph = buildGraph(pages, aretes);

    if (isArrayOrdered(pages, aretes))
      result += Number(pages[Math.floor(pages.length / 2)])
  })
  console.log(result)
  const endTime = performance.now();
  console.log(`Part §: ${endTime - startTime}ms`);
}


function part2() {
  const startTime = performance.now();
  const file = fs.readFileSync('./src/2024/day5/prod.txt', 'utf8')
  const [raworder, books] = file.split('\n\n')
  const aretes = raworder.split('\n').map(o => o.split('|')) as [string, string][]
  let result = 0
  books.split('\n').forEach(book => {
    const pages = book.split(',')
    const graph = buildGraph(pages, aretes);

    const sorted = topologicalSort(pages, graph)
    if (sorted.join() != pages.join())
      result += Number(sorted[Math.floor(sorted.length / 2)])
  })
  console.log(result)
  const endTime = performance.now();
  console.log(`Part 2: ${endTime - startTime}ms`);
}

void part1()
void part2()