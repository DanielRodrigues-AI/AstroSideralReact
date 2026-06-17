export function calculateOrbitalVelocity(
  centerX: number,
  centerY: number,
  x: number,
  y: number,
  centralMass: number,
  G: number,
) {
  const dx = x - centerX;
  const dy = y - centerY;

  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance === 0) {
    return { vx: 0, vy: 0 };
  }

  const speed = Math.sqrt((G * centralMass) / distance);

  const vx = (-dy / distance) * speed;
  const vy = (dx / distance) * speed;

  return { vx, vy };
}