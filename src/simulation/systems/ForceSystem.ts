import { Body } from "../entities/Body";

export interface ForceSystem {
  update(bodies: Body[], _dt: number): void;
}