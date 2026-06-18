import { Body } from "../entities/Body";

export type CollisionPair = {
  a: Body;
  b: Body;
};

export class CollisionDetector {
  detect(bodies: Body[]): CollisionPair[] {
    const collisions: CollisionPair[] = [];

    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const a = bodies[i];
        const b = bodies[j];

        const dx = b.x - a.x;
        const dy = b.y - a.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        const radiusA = this.getRadius(a);
        const radiusB = this.getRadius(b);

        if (distance <= radiusA + radiusB) {
          collisions.push({ a, b });
        }
      }
    }

    return collisions;
  }

  private getRadius(body: Body): number {
    if (body.mass > 6000) return 16;
    if (body.mass > 1000) return 10;
    if (body.mass > 3) return 4;
    return 2;
  }
}