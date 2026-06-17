import { Body } from "../entities/Body";
import type { Scene } from "./Scene";
import { createSolarSystem } from "../../world/solar-system/createSolarSystem";

export class SolarSystemScene implements Scene {
  private bodies: Body[];

  constructor(centerX: number, centerY: number) {
    this.bodies = createSolarSystem(centerX, centerY);
  }

  getBodies(): Body[] {
    return this.bodies;
  }
}