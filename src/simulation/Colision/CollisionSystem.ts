import { Body } from "../entities/Body";
import { CollisionDetector } from "./CollisionDetector";

export class CollisionSystem {
  private detector = new CollisionDetector();

  update(bodies: Body[]): void {
    const collisions = this.detector.detect(bodies);

    for (const collision of collisions) {
      this.handleCollision(collision.a, collision.b);
    }
  }

  private handleCollision(a: Body, b: Body): void {
    if ((a.parent === b && a.lockOrbit) || (b.parent === a && b.lockOrbit)) {
      return;
    }

    const dx = b.x - a.x;
    const dy = b.y - a.y;

    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance === 0) return;

    const nx = dx / distance;
    const ny = dy / distance;

    const rvx = b.vx - a.vx;
    const rvy = b.vy - a.vy;

    const velocityAlongNormal = rvx * nx + rvy * ny;

    if (velocityAlongNormal > 0) return;

    const restitution = 1;

    const impulse =
      (-(1 + restitution) * velocityAlongNormal) /
      (1 / a.mass + 1 / b.mass);

    const impulseX = impulse * nx;
    const impulseY = impulse * ny;

    a.vx -= impulseX / a.mass;
    a.vy -= impulseY / a.mass;

    b.vx += impulseX / b.mass;
    b.vy += impulseY / b.mass;
  }
}