"use client";

import { useEffect, useState } from "react";

type RoomView = "desk" | "door";

export function RoomNavigation() {
  const [view, setView] = useState<RoomView>("desk");

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!document.querySelector(".immersive-room")) return;
      if (event.key === "ArrowRight") setView("door");
      if (event.key === "ArrowLeft") setView("desk");
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const goToRooftop = () => {
    const rooftopTrigger = document.querySelector<HTMLButtonElement>(".room-side-door-portal");
    rooftopTrigger?.click();
  };

  return (
    <div className={`room-navigation room-view-${view}`} aria-label="Room exploration controls">
      <button
        className="room-walk-control room-walk-right"
        type="button"
        onClick={() => setView("door")}
        aria-label="Walk to the right side of the room"
      >
        →
        <small>WALK</small>
      </button>

      <button
        className="room-walk-control room-walk-left"
        type="button"
        onClick={() => setView("desk")}
        aria-label="Walk back to the desk"
      >
        ←
        <small>DESK</small>
      </button>

      <div className="room-extension-scene" aria-hidden={view !== "door"}>
        <div className="room-extension-wall" />
        <div className="room-extension-floor" />
        <div className="extension-ceiling-beam" />
        <div className="extension-runner" />

        <div className="extension-frame" aria-hidden="true">
          <span>KEEP<br />SHIPPING</span>
        </div>

        <div className="extension-plant" aria-hidden="true">
          <i /><i /><i />
        </div>

        <div className="extension-door-zone">
          <span className="extension-door-light" aria-hidden="true" />
          <span className="extension-door-plaque" aria-hidden="true">ROOF<br />ACCESS</span>
          <div className="extension-door-frame">
            <button
              className="extension-door"
              type="button"
              onClick={goToRooftop}
              aria-label="Open the rooftop access door"
            >
              <span className="extension-door-panel extension-door-panel-a" aria-hidden="true" />
              <span className="extension-door-panel extension-door-panel-b" aria-hidden="true" />
              <span className="extension-door-window" aria-hidden="true" />
              <span className="extension-door-handle" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div className="room-walk-footsteps" aria-hidden="true">← BACK TO DESK · ROOF ACCESS AHEAD</div>
    </div>
  );
}
