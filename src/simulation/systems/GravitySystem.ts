import { Body } from "../entities/Body";
import type { ForceSystem } from "./ForceSystem";
export class GravitySystem implements ForceSystem {
  private G = 700;

  constructor() {}

  update(bodies: Body[], _dt: number) {
    const G = this.G;

    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const a = bodies[i];
        const b = bodies[j];

        const dx = b.x - a.x;
        const dy = b.y - a.y;

        const distSq = dx * dx + dy * dy;

        if (distSq < 1) continue;

        const distance = Math.sqrt(distSq);

        const softening = 50;
        const force = (G * a.mass * b.mass) / (distSq + softening * softening);

        const fx = (force * dx) / distance;
        const fy = (force * dy) / distance;

        // força NÃO deve ser escalada por dt aqui (já entra no integrador)
        a.applyForce(fx, fy);
        b.applyForce(-fx, -fy);
      }
    }
  }
}
