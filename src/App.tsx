import { useEffect, useRef } from "react";
import { GameLoop } from "./core/engine/GameLoop";
import { SolarSystemScene } from "./simulation/scenes/SolarSystemScene";
import type { ForceSystem } from "./simulation/systems/ForceSystem";
import { GravitySystem } from "./simulation/systems/GravitySystem";
import { CanvasRenderer } from "./render/canvas/CanvasRenderer";
import { EntityManager } from "./simulation/entities/EntityManager";
import { Camera } from "./render/canvas/Camera";
import { Body } from "./simulation/entities/Body";

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

      entityManager.addBody(new Body(worldX, worldY, 10));
    };
    canvas.addEventListener("click", handleClick);

    const sun = bodies[0];
    camera.viewportWidth = canvas.width;
    camera.viewportHeight = canvas.height;
    const systems: ForceSystem[] = [new GravitySystem()];

    const renderer = new CanvasRenderer(ctx, bodies, camera);

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
    <canvas
      ref={canvasRef}
      style={{
        display: "block",
        width: "100vw",
        height: "100vh",
        background: "#000010",
      }}
    />
  );
}

export default App;
