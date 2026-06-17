import { Body } from "../../simulation/entities/Body";

interface Props {
  body: Body | null;
}

export function BodyInfoPanel({ body }: Props) {
  if (!body) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 10,
        left: 10,
        padding: "12px",
        background: "rgba(0,0,0,0.8)",
        border: "1px solid #444",
        color: "#fff",
        fontFamily: "monospace",
        fontSize: "14px",
      }}
    >
      <div>Massa: {body.mass.toFixed(2)}</div>
      <div>X: {body.x.toFixed(2)}</div>
      <div>Y: {body.y.toFixed(2)}</div>
      <div>VX: {body.vx.toFixed(2)}</div>
      <div>VY: {body.vy.toFixed(2)}</div>
    </div>
  );
}