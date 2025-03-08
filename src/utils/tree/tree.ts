import { Z_DEFAULT_STRATEGY } from "zlib"

export class Node {
  private readonly _children: Map<string, Node>

  constructor() {
    this._children = new Map<string, Node>()
  }

  get children() { return this._children}
}

export class Tree {
  private readonly root: Node

  constructor() {
    this.root = new Node()
  }

  public insert(node: string) {
    let current = this.root
    const [first, second] = node.split('-')
    if (!current.children.get(second))
      current.children.set(second, new Node())
    if (!current.children.get(first))
      current.children.set(first, new Node())
    current.children.get(second)!.children.set(first, new Node())
    current.children.get(first)!.children.set(second, new Node())

  }

  public toString(): string {
    const lines: string[] = [];
    const traverse = (node: Node, prefix: string, isLast: boolean) => {
      const children = Array.from(node.children.keys()).sort();
      children.forEach((char, index) => {
        const childNode = node.children.get(char)!;
        const isChildLast = index === children.length - 1;
        const connector = isChildLast ? '└── ' : '├── ';
        lines.push(prefix + connector + char);
        const newPrefix = prefix + (isLast ? '    ' : '│   ');
        traverse(childNode, newPrefix, isChildLast);
      });
    };

    lines.push('root');
    traverse(this.root, '', true);
    return lines.join('\n');
  }

  public children() {
    return this.root.children
  }
}