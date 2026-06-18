import { Body } from "../entities/Body";
import type { Integrator } from "./Integrator";

export class EulerIntegrator implements Integrator {
  integrate(body: Body, dt: number): void {
    body.vx += body.ax * dt;
    body.vy += body.ay * dt;

    body.x += body.vx * dt;
    body.y += body.vy * dt;

    body.ax = 0;
    body.ay = 0;
  }
}