import { Body } from "../entities/Body";

export interface Scene {
  getBodies(): Body[];
}