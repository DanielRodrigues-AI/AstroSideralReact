import { Body } from "../entities/Body";
import { EntityManager } from "../entities/EntityManager";
import { CollisionDetector } from "./CollisionDetector";

export type MergeResult = {
  oldA: Body;
  oldB: Body;
  merged: Body;
};

export class CollisionSystem {
  private detector = new CollisionDetector();

  private entityManager: EntityManager;

  constructor(entityManager: EntityManager) {
    this.entityManager = entityManager;
  }

  update(bodies: Body[]): MergeResult[] {
    const collisions = this.detector.detect(bodies);
    const merges: MergeResult[] = [];

    for (const collision of collisions) {
      const merge = this.handleCollision(collision.a, collision.b);

      if (merge) merges.push(merge);
    }

    return merges;
  }

  private handleCollision(a: Body, b: Body): MergeResult | null {
    if ((a.parent === b && a.lockOrbit) || (b.parent === a && b.lockOrbit)) {
      return null;
    }
    if (
      !this.entityManager.getBodies().includes(a) ||
      !this.entityManager.getBodies().includes(b)
    ) {
      return null;
    }
    const mass = a.mass + b.mass;
    let x = (a.x * a.mass + b.x * b.mass) / mass;
    let y = (a.y * a.mass + b.y * b.mass) / mass;

    let vx = (a.vx * a.mass + b.vx * b.mass) / mass;
    let vy = (a.vy * a.mass + b.vy * b.mass) / mass;

    // Se um dos corpos é o Sol, ele permanece fixo.
    if (a.mass > 6000) {
      x = a.x;
      y = a.y;
      vx = 0;
      vy = 0;
    } else if (b.mass > 6000) {
      x = b.x;
      y = b.y;
      vx = 0;
      vy = 0;
    }

    const merged = new Body(x, y, mass, vx, vy);

    // preserva estado orbital (evita perda de órbita após merge)
    merged.parent = a.parent ?? b.parent;
    merged.lockOrbit = a.lockOrbit || b.lockOrbit;
    merged.orbitRadius = a.orbitRadius || b.orbitRadius;
    merged.orbitAngle = a.orbitAngle || b.orbitAngle;
    merged.orbitVelocity = a.orbitVelocity || b.orbitVelocity;

    this.entityManager.removeBody(a);
    this.entityManager.removeBody(b);
    this.entityManager.addBody(merged);

    return {
      oldA: a,
      oldB: b,
      merged,
    };
  }
}
