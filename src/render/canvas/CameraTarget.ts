import { Body } from "../../simulation/entities/Body";

export class CameraTarget {
  private target: Body | null = null;

  set(body: Body | null): void {
    this.target = body;
  }

  get(): Body | null {
    return this.target;
  }
}