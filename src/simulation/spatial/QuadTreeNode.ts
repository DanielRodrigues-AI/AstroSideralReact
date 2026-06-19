import { Body } from "../entities/Body";

export class QuadTreeNode {
  x: number;
  y: number;
  half: number;
  depth: number;

  body: Body | null = null;

  children: QuadTreeNode[] | null = null;

  mass = 0;
  comX = 0;
  comY = 0;

  private maxDepth = 12;

  constructor(x: number, y: number, half: number, depth = 0) {
    this.x = x;
    this.y = y;
    this.half = half;
    this.depth = depth;
  }

  isLeaf(): boolean {
    return this.children === null;
  }

  contains(b: Body): boolean {
    return (
      b.x >= this.x - this.half &&
      b.x <= this.x + this.half &&
      b.y >= this.y - this.half &&
      b.y <= this.y + this.half
    );
  }

  insert(b: Body): void {
    if (!this.contains(b)) return;

    if (this.isLeaf()) {
      if (this.body === null) {
        this.body = b;
        return;
      }

      if (this.depth >= this.maxDepth) {
        return;
      }

      const old = this.body;
      this.body = null;
      this.subdivide();

      this.insertIntoChildren(old!);
      this.insertIntoChildren(b);
      return;
    }

    this.insertIntoChildren(b);
  }

  private insertIntoChildren(b: Body): void {
    for (const c of this.children!) {
      if (c.contains(b)) {
        c.insert(b);
        return;
      }
    }
  }

  private subdivide(): void {
    const hs = this.half / 2;
    const q = hs / 2;

    const d = this.depth + 1;

    this.children = [
      new QuadTreeNode(this.x - q, this.y - q, hs, d),
      new QuadTreeNode(this.x + q, this.y - q, hs, d),
      new QuadTreeNode(this.x - q, this.y + q, hs, d),
      new QuadTreeNode(this.x + q, this.y + q, hs, d),
    ];
  }

  computeMassDistribution(): void {
    if (this.isLeaf()) {
      if (!this.body) {
        this.mass = 0;
        return;
      }

      this.mass = this.body.mass;
      this.comX = this.body.x;
      this.comY = this.body.y;
      return;
    }

    let m = 0;
    let cx = 0;
    let cy = 0;

    for (const c of this.children!) {
      c.computeMassDistribution();

      m += c.mass;
      cx += c.comX * c.mass;
      cy += c.comY * c.mass;
    }

    this.mass = m;

    if (m > 0) {
      this.comX = cx / m;
      this.comY = cy / m;
    }
  }
}
