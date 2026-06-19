import { Body } from "../entities/Body";
import type { ForceProvider } from "./ForceProvider";

export class GravitySystem implements ForceProvider {
  private G = 700;
  private softening: number;

  constructor(softening = 50) {
    this.softening = softening;
  }

  compute(bodies: Body[], _dt: number) {
    const G = this.G;
    const softening = this.softening;

    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const a = bodies[i];
        const b = bodies[j];

        const dx = b.x - a.x;
        const dy = b.y - a.y;

        const distSq = dx * dx + dy * dy;

        const minDistSq = 0.25;
        const safeDistSq = Math.max(distSq, minDistSq);

        const distance = Math.sqrt(safeDistSq);

        const force =
          (G * a.mass * b.mass) / (safeDistSq + softening * softening);

        const fx = (force * dx) / distance;
        const fy = (force * dy) / distance;

        a.applyForce(fx, fy);
        b.applyForce(-fx, -fy);
      }
    }
  }
}