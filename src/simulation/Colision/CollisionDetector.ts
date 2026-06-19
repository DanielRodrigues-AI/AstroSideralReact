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

        const distSq = dx * dx + dy * dy;
        const distance = Math.sqrt(Math.max(distSq, 0.0001));

        if (distance <= a.radius + b.radius) {
          collisions.push({ a, b });
        }
      }
    }

    return collisions;
  }
}
