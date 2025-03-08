export class Node {
  private readonly _children: Map<string, Node>

  constructor(private _endOfPattern: boolean) {
    this._children = new Map<string, Node>()
  }

  get children() { return this._children}

  public isEndOfPattern() {return this._endOfPattern}
  public setEndOfPattern() {this._endOfPattern = true}
}

export class PatternChecker {
  private readonly root: Node

  constructor() {
    this.root = new Node(false)
  }

  public insert(pattern: string) {
    let currentNode = this.root;
    for (let i = 0; i < pattern.length; i++) {
      const char = pattern[i]
      if (!currentNode.children.has(char)) {
        currentNode.children.set(char, new Node(i === pattern.length - 1));
      }
      currentNode = currentNode.children.get(char)!;
    }
    currentNode.setEndOfPattern()
  }

  public toString(): string {
    const lines: string[] = [];
    const traverse = (node: Node, prefix: string, isLast: boolean) => {
      const children = Array.from(node.children.keys()).sort();
      children.forEach((char, index) => {
        const childNode = node.children.get(char)!;
        const isChildLast = index === children.length - 1;
        const connector = isChildLast ? '└── ' : '├── ';
        const endMarker = childNode.isEndOfPattern() ? ' (End)' : '';
        lines.push(prefix + connector + char + endMarker);
        const newPrefix = prefix + (isLast ? '    ' : '│   ');
        traverse(childNode, newPrefix, isChildLast);
      });
    };

    lines.push('root');
    traverse(this.root.children.get('w')!, '', true);
    return lines.join('\n');
  }

  public check(toCheck: string) {
    let currentNode = this.root
    for (let i = 0; i < toCheck.length; i++) {
      const char = toCheck[i]
      if (!currentNode.children.has(char)) {
        return false
      }
      currentNode = currentNode.children.get(char)!;
    }
    return currentNode.isEndOfPattern()
  }
}
