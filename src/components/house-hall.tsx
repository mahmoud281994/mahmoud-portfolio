"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

const futureRooms = [
  { id: "living", label: "LIVING ROOM", hint: "coming later" },
  { id: "kitchen", label: "KITCHEN", hint: "coming later" },
  { id: "guest", label: "GUEST ROOM", hint: "coming later" },
  { id: "basement", label: "BASEMENT", hint: "legacy code lives here" },
];

export function HouseHall() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [hasVisited, setHasVisited] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (hasVisited) return;

    const check = () => {
      const room = document.querySelector(".immersive-room");
      if (room) setVisible(true);
    };

    check();
    const observer = new MutationObserver(check);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [hasVisited]);

  const enterWorkspace = () => {
    if (leaving) return;
    setLeaving(true);
    window.setTimeout(() => {
      setVisible(false);
      setHasVisited(true);
      setLeaving(false);
    }, reduceMotion ? 60 : 760);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.section
          className={`house-hall ${leaving ? "is-leaving" : ""}`}
          initial={reduceMotion ? false : { opacity: 0, scale: 1.035 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.025 }}
          transition={{ duration: reduceMotion ? .05 : .58, ease: [0.22, 1, 0.36, 1] }}
          aria-label="House hall"
        >
          <div className="hall-ceiling" aria-hidden="true"><i /><i /><i /></div>
          <div className="hall-back-wall" aria-hidden="true" />
          <div className="hall-side-wall hall-side-wall-left" aria-hidden="true" />
          <div className="hall-side-wall hall-side-wall-right" aria-hidden="true" />
          <div className="hall-floor" aria-hidden="true">{Array.from({ length: 9 }).map((_, i) => <i key={i} />)}</div>
          <div className="hall-runner" aria-hidden="true" />
          <div className="hall-ambient-light" aria-hidden="true" />

          <div className="hall-chandelier" aria-hidden="true"><span /><i /><i /><i /><b /></div>

          <div className="hall-console" aria-hidden="true">
            <span className="hall-console-top" />
            <i className="hall-console-leg hall-console-leg-a" />
            <i className="hall-console-leg hall-console-leg-b" />
            <div className="hall-vase"><i /><i /><i /></div>
            <div className="hall-keys">⌁</div>
          </div>

          <div className="hall-mirror" aria-hidden="true"><span /></div>
          <div className="hall-gallery" aria-hidden="true">
            <span className="hall-frame frame-a"><i>MS</i></span>
            <span className="hall-frame frame-b"><i>&lt;/&gt;</i></span>
            <span className="hall-frame frame-c"><i>28</i></span>
            <span className="hall-frame frame-d"><i>PHP</i></span>
          </div>

          <div className="hall-plant hall-plant-left" aria-hidden="true"><span /><i /><i /><i /><i /></div>
          <div className="hall-plant hall-plant-right" aria-hidden="true"><span /><i /><i /><i /></div>

          <div className="hall-stairs" aria-hidden="true">
            {Array.from({ length: 7 }).map((_, i) => <i key={i} />)}
            <span className="hall-stairs-rail" />
            <b>UPSTAIRS</b>
          </div>

          <button className="hall-door hall-workspace-door" type="button" onClick={enterWorkspace} aria-label="Enter the developer workspace">
            <span className="hall-door-light" />
            <span className="hall-door-frame">
              <i className="hall-door-panel panel-top" />
              <i className="hall-door-panel panel-bottom" />
              <i className="hall-door-handle" />
              <strong>WORKSPACE</strong>
              <small>ENTER →</small>
            </span>
          </button>

          {futureRooms.map((room, index) => (
            <button
              key={room.id}
              className={`hall-door hall-future-door hall-future-door-${index + 1}`}
              type="button"
              disabled
              aria-label={`${room.label}, coming later`}
            >
              <span className="hall-door-frame">
                <i className="hall-door-panel panel-top" />
                <i className="hall-door-panel panel-bottom" />
                <i className="hall-door-handle" />
                <strong>{room.label}</strong>
                <small>{room.hint}</small>
              </span>
            </button>
          ))}

          <div className="hall-basement-sign" aria-hidden="true">↓ BASEMENT</div>
          <div className="hall-clock" aria-hidden="true"><i /><b /></div>
          <div className="hall-shoe-rack" aria-hidden="true"><i /><i /><span /><span /></div>
          <div className="hall-switch" aria-hidden="true"><i /></div>

          <div className="hall-entry-glow" aria-hidden="true" />
          <div className="hall-dust" aria-hidden="true" />
        </motion.section>
      )}
    </AnimatePresence>
  );
}
