import { Body } from "../../simulation/entities/Body";

export function createSolarSystem(centerX: number, centerY: number) {
  const bodies: Body[] = [];

  const sun = new Body(centerX, centerY, 8000, 0, 0);
  bodies.push(sun);

  const G = 700;

  const planetsConfig = [
    { distance: 120, mass: 8 },
    { distance: 180, mass: 12 },
    { distance: 260, mass: 18 },
    { distance: 340, mass: 10 },
  ];

  for (const p of planetsConfig) {
    const speed = Math.sqrt((G * sun.mass) / p.distance);

    const angle = Math.random() * Math.PI * 2;

    const x = centerX + Math.cos(angle) * p.distance;
    const y = centerY + Math.sin(angle) * p.distance;

    const vx = -Math.sin(angle) * speed;
    const vy = Math.cos(angle) * speed;

    bodies.push(new Body(x, y, p.mass * 1.5, vx, vy));
  }

  return bodies;
}
