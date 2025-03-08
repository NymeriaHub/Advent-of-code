export type Node = Map<string, Set<string>>

export default class Dependancy {
  private readonly dep: Node = new Map()

  public dependancy() {
    return this.dep
  }

  public addDependancy(node: string, dependancy: string | string[]) {
    const dep = Array.isArray(dependancy) ? dependancy : [dependancy]
    if (!this.dep.has(node)) {
      this.dep.set(node, new Set([...dep]))
    } else {
      const curr = this.dep.get(node)!
      this.dep.set(node, new Set([...curr, ...dep]))
    }
  }
}