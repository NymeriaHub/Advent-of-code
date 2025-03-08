export type Node = Map<string, Set<string>>;

export default class Graph {
  private readonly _graph: Node

  constructor() {
    this._graph = new Map()
  }

  public graph() {
    return this._graph
  }

  public addVertice(summitA: string, summitB: string) {
    if (!this._graph.get(summitA))
      this._graph.set(summitA, new Set())
    if (!this._graph.get(summitB))
      this._graph.set(summitB, new Set())
    this._graph.get(summitA)!.add(summitB)
    this._graph.get(summitB)!.add(summitA)
  }

/**
 * Bron-Kerbosch algorithm to find all maximal cliques in a graph.
 * @param currentClique - Current set of vertices in the clique being built.
 * @param candidateVertices - Set of vertices that can be added to the current clique.
 * @param excludedVertices - Set of vertices excluded from the current clique.
 * @param graph - Graph representation as a Map.
 * @param maximalCliques - Array to store all maximal cliques found.
 */
  public bronKerbosch(
    currentClique: Set<string>,
    candidateVertices: Set<string>,
    excludedVertices: Set<string>,
    graph: Node,
    maximalCliques: Set<string>[]
  ): void {
    if (candidateVertices.size === 0 && excludedVertices.size === 0) {
      maximalCliques.push(new Set(currentClique));
      return;
    }
  
    // Choose a pivot vertex from candidateVertices ∪ excludedVertices
    const verticesUnion = new Set([...candidateVertices, ...excludedVertices]);
    let pivotVertex: string | null = null;
    let maxNeighborCount = -1;
  
    for (let vertex of verticesUnion) {
      const neighborCount = this._graph.get(vertex)?.size || 0;
      if (neighborCount > maxNeighborCount) {
        maxNeighborCount = neighborCount;
        pivotVertex = vertex;
      }
    }
    if (pivotVertex === null) {
      pivotVertex = Array.from(verticesUnion)[0];
    }
  
    const pivotNeighbors = this._graph.get(pivotVertex) || new Set<string>();

    // candidateVertices \ N(pivotVertex)
    const remainingCandidates = new Set<string>(
      Array.from(candidateVertices).filter((v) => !pivotNeighbors.has(v))
    );
  
    for (let vertex of remainingCandidates) {
      currentClique.add(vertex);
      const vertexNeighbors = this._graph.get(vertex) || new Set<string>();
  
      const newCandidates = new Set<string>(
        Array.from(candidateVertices).filter((n) => vertexNeighbors.has(n))
      );
      const newExcluded = new Set<string>(
        Array.from(excludedVertices).filter((n) => vertexNeighbors.has(n))
      );
  
      this.bronKerbosch(currentClique, newCandidates, newExcluded, graph, maximalCliques);
  
      currentClique.delete(vertex);
      candidateVertices.delete(vertex);
      excludedVertices.add(vertex);
    }
  }
}
