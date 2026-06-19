import { Body } from "../entities/Body";
import type { ForceProvider } from "./ForceProvider";
import { QuadTree } from "../spatial/QuadTree";
import { QuadTreeNode } from "../spatial/QuadTreeNode";

export class GravityBarnesHutSystem implements ForceProvider {
  private G = 700;
  private softening: number;
  private theta: number;

  private tree: QuadTree;

  constructor(
    centerX: number,
    centerY: number,
    worldSize: number,
    softening = 50,
    theta = 0.5,
  ) {
    this.softening = softening;
    this.theta = theta;
    this.tree = new QuadTree(centerX, centerY, worldSize);
  }

  compute(bodies: Body[], _dt: number): void {
    const G = this.G;
    const softening = this.softening;

    this.tree.build(bodies);

    for (const body of bodies) {
      this.applyForce(body, this.tree.root, G, softening);
    }
  }

  private applyForce(
    body: Body,
    node: QuadTreeNode,
    G: number,
    softening: number,
  ): void {
    if (
      node.mass === 0 ||
      (node.isLeaf() && node.body === body) ||
      body === node.body
    ) {
      return;
    }

    const dx = node.comX - body.x;
    const dy = node.comY - body.y;

    const distSq = dx * dx + dy * dy;
    const safeDistSq = Math.max(distSq, 0.25);
    const distance = Math.sqrt(safeDistSq);

    const s = node.half;
    const d = Math.sqrt(distSq);
    const useApproximation = d > 0 && s / d < this.theta;

    if (node.isLeaf() || useApproximation) {
      const force =
        (G * body.mass * node.mass) / (safeDistSq + softening * softening);

      const fx = (force * dx) / distance;
      const fy = (force * dy) / distance;

      body.applyForce(fx, fy);
      return;
    }

    for (const child of node.children!) {
      this.applyForce(body, child, G, softening);
    }
  }
}
