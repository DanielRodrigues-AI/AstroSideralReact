import { Body } from "../entities/Body";
import type { Integrator } from "./Integrator";

export class VelocityVerletIntegrator implements Integrator {
  beginStep(body: Body, dt: number): void {
    body.previousAx = body.ax;
    body.previousAy = body.ay;

    body.x += body.vx * dt + 0.5 * body.ax * dt * dt;
    body.y += body.vy * dt + 0.5 * body.ay * dt * dt;
  }

  endStep(body: Body, dt: number): void {
    body.vx += 0.5 * (body.previousAx + body.ax) * dt;
    body.vy += 0.5 * (body.previousAy + body.ay) * dt;

    body.ax = 0;
    body.ay = 0;
  }
}