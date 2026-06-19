import { Body } from "../entities/Body";
import { QuadTreeNode } from "./QuadTreeNode";

export class QuadTree {
  root: QuadTreeNode;

  constructor(centerX: number, centerY: number, size: number) {
    this.root = new QuadTreeNode(centerX, centerY, size / 2);
  }

  build(bodies: Body[]): void {
    this.root = new QuadTreeNode(
      this.root.x,
      this.root.y,
      this.root.half
    );

    for (const b of bodies) {
      this.root.insert(b);
    }

    this.root.computeMassDistribution();
  }
}