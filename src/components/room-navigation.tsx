"use client";

import { useEffect, useRef } from "react";

export function RoomNavigation() {
  const progressRef = useRef(0);
  const velocityRef = useRef(0);
  const touchStartRef = useRef<{ x: number; progress: number } | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;

    const setProgress = (value: number) => {
      const next = Math.max(0, Math.min(1, value));
      progressRef.current = next;
      root.style.setProperty("--room-pan", next.toFixed(4));
    };

    const canWalk = () => {
      const room = document.querySelector<HTMLElement>(".immersive-room");
      if (!room) return false;
      if (document.querySelector(".rooftop-world, .corridor-transition")) return false;
      return room.dataset.active === "none" || !room.dataset.active;
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!canWalk()) {
        velocityRef.current = 0;
        return;
      }

      const width = window.innerWidth;
      const x = event.clientX / width;
      const edge = 0.22;

      if (x > 1 - edge) {
        const strength = (x - (1 - edge)) / edge;
        velocityRef.current = 0.006 + strength * 0.018;
      } else if (x < edge) {
        const strength = (edge - x) / edge;
        velocityRef.current = -(0.006 + strength * 0.018);
      } else {
        velocityRef.current = 0;
      }
    };

    const onMouseLeave = () => {
      velocityRef.current = 0;
    };

    const onTouchStart = (event: TouchEvent) => {
      if (!canWalk() || event.touches.length !== 1) return;
      touchStartRef.current = {
        x: event.touches[0].clientX,
        progress: progressRef.current,
      };
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!touchStartRef.current || event.touches.length !== 1 || !canWalk()) return;
      const delta = touchStartRef.current.x - event.touches[0].clientX;
      setProgress(touchStartRef.current.progress + delta / (window.innerWidth * 0.72));
    };

    const onTouchEnd = () => {
      touchStartRef.current = null;
    };

    const tick = () => {
      if (velocityRef.current !== 0 && canWalk()) {
        setProgress(progressRef.current + velocityRef.current);
      }
      frame = window.requestAnimationFrame(tick);
    };

    root.style.setProperty("--room-pan", "0");
    frame = window.requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMouseMove);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      root.style.removeProperty("--room-pan");
    };
  }, []);

  const goToRooftop = () => {
    const rooftopTrigger = document.querySelector<HTMLButtonElement>(".room-side-door-portal");
    rooftopTrigger?.click();
  };

  return (
    <div className="room-navigation" aria-label="Walkable room extension">
      <div className="room-extension-scene">
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
    </div>
  );
}
