import { Body } from "../entities/Body";

export type TrailPoint = {
  x: number;
  y: number;
};

export class TrailManager {
  private trails = new Map<Body, TrailPoint[]>();

  private maxPoints: number;

  constructor(maxPoints = 300) {
    this.maxPoints = maxPoints;
  }

  update(bodies: Body[]): void {
    for (const body of bodies) {
      if (body.mass > 1000) continue;

      let trail = this.trails.get(body);

      if (!trail) {
        trail = [];
        this.trails.set(body, trail);
      }

      trail.push({
        x: body.x,
        y: body.y,
      });

      if (trail.length > this.maxPoints) {
        trail.shift();
      }
    }
  }

  getTrail(body: Body): TrailPoint[] {
    return this.trails.get(body) ?? [];
  }

  clear(body: Body): void {
    this.trails.delete(body);
  }
}