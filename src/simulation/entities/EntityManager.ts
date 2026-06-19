import { Body } from "./Body";

export class EntityManager {
  private bodies: Body[];

  constructor(bodies: Body[] = []) {
    this.bodies = bodies;
  }

  addBody(body: Body): void {
    this.bodies.push(body);
  }

  removeBody(body: Body): void {
    const index = this.bodies.indexOf(body);
    if (index === -1) return;

    const vx = body.vx;
    const vy = body.vy;

    for (const b of this.bodies) {
      if (b.parent === body) {
        const dx = b.x - body.x;
        const dy = b.y - body.y;

        const dist = Math.sqrt(dx * dx + dy * dy) || 1;

        const tx = -dy / dist;
        const ty = dx / dist;

        const escapeBoost = 120; // intensidade do “desprendimento”

        b.parent = null;
        b.lockOrbit = false;
        b.orbitRadius = 0;
        b.orbitAngle = 0;
        b.orbitVelocity = 0;

        // herda movimento do planeta
        b.vx = vx;
        b.vy = vy;

        // adiciona impulso tangencial baseado na órbita atual
        b.vx += tx * escapeBoost;
        b.vy += ty * escapeBoost;
      }
    }

    this.bodies.splice(index, 1);
  }

  getBodies(): Body[] {
    return this.bodies;
  }
}
