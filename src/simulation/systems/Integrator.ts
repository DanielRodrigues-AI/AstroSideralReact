import { Body } from "../entities/Body";

export interface Integrator {
  beginStep(body: Body, dt: number): void;
  endStep(body: Body, dt: number): void;
}