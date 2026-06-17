import { Body } from "../entities/Body";
import type { Scene } from "./Scene";

export class EmptyScene implements Scene {
  private bodies: Body[] = [];

  getBodies(): Body[] {
    return this.bodies;
  }
}