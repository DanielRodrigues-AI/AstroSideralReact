import { Body } from "../entities/Body";

export interface ForceProvider {
  compute(bodies: Body[], dt: number): void;
}