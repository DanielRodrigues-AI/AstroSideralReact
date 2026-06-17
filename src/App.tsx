import { useEffect, useRef, useState } from "react";
import { GameLoop } from "./core/engine/GameLoop";
import { SolarSystemScene } from "./simulation/scenes/SolarSystemScene";
import type { ForceSystem } from "./simulation/systems/ForceSystem";
import { GravitySystem } from "./simulation/systems/GravitySystem";
import { CanvasRenderer } from "./render/canvas/CanvasRenderer";
import { EntityManager } from "./simulation/entities/EntityManager";
import { Camera } from "./render/canvas/Camera";
import { Body } from "./simulation/entities/Body";
import { SelectionManager } from "./simulation/selection/SelectionManager";
import { BodyInfoPanel } from "./ui/panels/BodyInfoPanel";

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedBody, setSelectedBody] = useState<Body | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    const scene = new SolarSystemScene(canvas.width / 2, canvas.height / 2);
    const entityManager = new EntityManager(scene.getBodies());
    const selectionManager = new SelectionManager();
    const camera = new Camera();
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();

      const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;

      camera.zoom *= zoomFactor;

      camera.zoom = Math.max(0.1, Math.min(5, camera.zoom));
    };
    resize();
    canvas.addEventListener("wheel", handleWheel, {
      passive: false,
    });
    camera.viewportWidth = canvas.width;
    camera.viewportHeight = canvas.height;

    window.addEventListener("resize", () => {
      resize();

      camera.viewportWidth = canvas.width;
      camera.viewportHeight = canvas.height;
    });
    const bodies = entityManager.getBodies();
    const handleClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();

      const screenX = event.clientX - rect.left;
      const screenY = event.clientY - rect.top;

      const worldX =
        (screenX - camera.viewportWidth / 2) / camera.zoom + camera.x;

      const worldY =
        (screenY - camera.viewportHeight / 2) / camera.zoom + camera.y;

      let selected: Body | null = null;
      let nearestDistance = Infinity;

      for (const body of bodies) {
        const dx = body.x - worldX;
        const dy = body.y - worldY;

        const distance = Math.sqrt(dx * dx + dy * dy);

        const radius = body.mass > 1000 ? 12 : 4;

        if (distance <= radius && distance < nearestDistance) {
          nearestDistance = distance;
          selected = body;
        }
      }

      if (selected) {
        selectionManager.select(selected);
        setSelectedBody(selected);
        console.log("Selected:", selected);
        return;
      }

      entityManager.addBody(new Body(worldX, worldY, 10));
    };
    canvas.addEventListener("click", handleClick);

    const sun = bodies[0];
    camera.viewportWidth = canvas.width;
    camera.viewportHeight = canvas.height;
    const systems: ForceSystem[] = [new GravitySystem()];

    const renderer = new CanvasRenderer(ctx, bodies, camera, selectionManager);

    const engine = new GameLoop(
      (dt) => {
        for (const s of systems) {
          s.update(bodies, dt);
        }

        for (const b of bodies) {
          b.integrate(dt);
        }

        camera.x = sun.x;
        camera.y = sun.y;
      },
      () => {
        renderer.render();
      },
    );

    engine.start();

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("click", handleClick);
      engine.stop();
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100vw",
          height: "100vh",
          background: "#000010",
        }}
      />

      <BodyInfoPanel body={selectedBody} />
    </>
  );
}

export default App;
