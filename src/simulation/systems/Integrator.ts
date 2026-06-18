import { Body } from "../entities/Body";

export interface Integrator {
  integrate(body: Body, dt: number): void;
}