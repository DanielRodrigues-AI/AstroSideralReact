import { Body } from "../entities/Body";

export type EnergyResult = {
  kinetic: number;
  potential: number;
  total: number;
};

export class EnergyCalculator {
  private G: number;

  constructor(G: number) {
    this.G = G;
  }

  calculate(bodies: Body[]): EnergyResult {
    const kinetic = this.getKineticEnergy(bodies);
    const potential = this.getPotentialEnergy(bodies);

    return {
      kinetic,
      potential,
      total: kinetic + potential,
    };
  }

  private getKineticEnergy(bodies: Body[]): number {
    let energy = 0;

    for (const body of bodies) {
      const speedSq = body.vx * body.vx + body.vy * body.vy;
      energy += 0.5 * body.mass * speedSq;
    }

    return energy;
  }

  private getPotentialEnergy(bodies: Body[]): number {
    let energy = 0;

    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const a = bodies[i];
        const b = bodies[j];

        const dx = b.x - a.x;
        const dy = b.y - a.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 1) continue;

        energy -= (this.G * a.mass * b.mass) / distance;
      }
    }

    return energy;
  }
}
