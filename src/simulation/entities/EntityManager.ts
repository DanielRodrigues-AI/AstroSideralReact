import { Body } from "./Body";

export class EntityManager {
  private bodies: Body[];

  constructor(bodies: Body[] = []) {
    this.bodies = bodies;
  }

  addBody(body: Body): void {
    this.bodies.push(body);
  }

  removeBody(body: Body): void {
    const index = this.bodies.indexOf(body);

    if (index !== -1) {
      this.bodies.splice(index, 1);
    }
  }

  getBodies(): Body[] {
    return this.bodies;
  }
}