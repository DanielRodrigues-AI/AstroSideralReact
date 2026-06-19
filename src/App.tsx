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
import { CameraTarget } from "./render/canvas/CameraTarget";
import { TrailManager } from "./simulation/trails/TrailManager";
import { calculateOrbitalVelocity } from "./utils/calculateOrbitalVelocity";
import { HelpButton } from "./ui/controls/HelpButton";
import { HotkeyManager } from "./ui/controls/HotkeyManager";
import { VelocityVerletIntegrator } from "./simulation/systems/VelocityVerletIntegrator";
import { EulerIntegrator } from "./simulation/systems/EulerIntegrator";
import { CollisionSystem } from "./simulation/Colision/CollisionSystem";
import { EnergyCalculator } from "./simulation/physics/EnergyCalculator";

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
    /* trocar 1 pelo outro caso queira que conserve mais energia ou nao 
    const integratorType: "euler" | "verlet" = "verlet";
    const integratorType: "euler" | "verlet" = "euler";
    */
    const integratorType: "euler" | "verlet" = "verlet";

    const integrator =
      integratorType === "verlet"
        ? new VelocityVerletIntegrator()
        : new EulerIntegrator();
    const scene = new SolarSystemScene(canvas.width / 2, canvas.height / 2);
    const entityManager = new EntityManager(scene.getBodies());
    const selectionManager = new SelectionManager();
    const camera = new Camera();
    const hotkeys = new HotkeyManager();
    const cameraTarget = new CameraTarget();
    const trailManager = new TrailManager();

    let energyTimer = 0;
    //let energyTimer = 0; gera log sobre energia gravitacional armazenada
    hotkeys.bind("f", () => {
      const selected = selectionManager.getSelected();

      if (cameraTarget.get() === selected) {
        cameraTarget.set(null);
      } else {
        cameraTarget.set(selected);
      }
    });

    hotkeys.bind(" ", () => {
      engine.togglePause();
    });

    hotkeys.bind("1", () => {
      engine.setSpeed(1);
    });

    hotkeys.bind("2", () => {
      engine.setSpeed(2);
    });

    hotkeys.bind("5", () => {
      engine.setSpeed(5);
    });

    hotkeys.bind("0", () => {
      engine.setSpeed(10);
    });
    hotkeys.bind("delete", () => {
      const selected = selectionManager.getSelected();
      if (!selected) return;

      entityManager.removeBody(selected);
      selectionManager.clear();
      trailManager.clear(selected);
      setSelectedBody(null);
    });

    hotkeys.bind("backspace", () => {
      const selected = selectionManager.getSelected();
      if (!selected) return;

      entityManager.removeBody(selected);
      selectionManager.clear();
      trailManager.clear(selected);
      setSelectedBody(null);
    });
    hotkeys.bind("l", () => {
      const selected = selectionManager.getSelected();
      if (!selected) return;

      const baseAngle = Math.random() * Math.PI * 2;
      const angle = baseAngle + (Math.random() - 0.5) * 0.6; // “bagunça” o círculo

      const minDistance = 25;
      const maxDistance = 80;
      const distance =
        minDistance + Math.random() * (maxDistance - minDistance);

      const worldX = selected.x + Math.cos(angle) * distance;
      const worldY = selected.y + Math.sin(angle) * distance;

      const { vx, vy } = calculateOrbitalVelocity(
        selected.x,
        selected.y,
        worldX,
        worldY,
        selected.mass,
        700,
      );

      const lua = new Body(worldX, worldY, 2, vx, vy, selected);

      lua.orbitRadius = distance;
      lua.orbitAngle = angle;
      lua.orbitSpeed = Math.sqrt((700 * selected.mass) / distance);
      lua.lockOrbit = true;

      lua.orbitSpeedScale = 0.4; // ← AQUI

      entityManager.addBody(lua);
      trailManager.clear(lua);
    });
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

      let body: Body;

      if (event.shiftKey) {
        const { vx, vy } = calculateOrbitalVelocity(
          sun.x,
          sun.y,
          worldX,
          worldY,
          sun.mass,
          700,
        );

        body = new Body(worldX, worldY, 10, vx, vy);
      } else {
        body = new Body(worldX, worldY, 10);
      }

      entityManager.addBody(body);
      trailManager.clear(body);
    };
    canvas.addEventListener("click", handleClick);

    const sun = bodies[0];
    camera.viewportWidth = canvas.width;
    camera.viewportHeight = canvas.height;
    const systems: ForceSystem[] = [new GravitySystem(50)];
    const collisionSystem = new CollisionSystem(entityManager);
    const energyCalculator = new EnergyCalculator(700);
    const renderer = new CanvasRenderer(
      ctx,
      bodies,
      camera,
      selectionManager,
      trailManager,
    );

    const engine = new GameLoop(
      (dt) => {
        for (const b of bodies) {
          b.ax = 0;
          b.ay = 0;
        }

        for (const s of systems) {
          s.update(bodies, dt);
        }

        for (const b of bodies) {
          if (b.parent && b.lockOrbit) {
            b.orbitAngle += b.orbitSpeed * b.orbitSpeedScale * dt;

            b.x = b.parent.x + Math.cos(b.orbitAngle) * b.orbitRadius;
            b.y = b.parent.y + Math.sin(b.orbitAngle) * b.orbitRadius;

            b.vx = 0;
            b.vy = 0;
            continue;
          }

          integrator.beginStep(b, dt);
        }
        const merges = collisionSystem.update(bodies);

        for (const merge of merges) {
          trailManager.clear(merge.oldA);
          trailManager.clear(merge.oldB);

          if (
            selectionManager.getSelected() === merge.oldA ||
            selectionManager.getSelected() === merge.oldB
          ) {
            selectionManager.select(merge.merged);
            setSelectedBody(merge.merged);
          }

          if (
            cameraTarget.get() === merge.oldA ||
            cameraTarget.get() === merge.oldB
          ) {
            cameraTarget.set(merge.merged);
          }
        }
        for (const b of bodies) {
          b.ax = 0;
          b.ay = 0;
        }

        for (const s of systems) {
          s.update(bodies, dt);
        }

        for (const b of bodies) {
          if (b.parent && b.lockOrbit) continue;

          integrator.endStep(b, dt);
        }
        trailManager.update(bodies);
        const target = cameraTarget.get();

        if (target) {
          camera.x = target.x;
          camera.y = target.y;
        } else {
          camera.x = sun.x;
          camera.y = sun.y;
        }
        //log sobre energia total armazenada
        energyTimer += dt;

        if (energyTimer >= 1) {
          const energy = energyCalculator.calculate(bodies);
          console.log("Energy:", energy);
          energyTimer = 0;
        }
        // log sobre energia gravitacional armazenada 
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
      hotkeys.destroy();
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
      <HelpButton />
      <BodyInfoPanel body={selectedBody} />
    </>
  );
}

export default App;
