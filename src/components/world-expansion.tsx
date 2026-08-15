"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

type WorldPhase = "room" | "to-roof" | "roof" | "to-room";

export function WorldExpansion() {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<WorldPhase>("room");
  const [telescopeOpen, setTelescopeOpen] = useState(false);
  const [radioOn, setRadioOn] = useState(false);

  useEffect(() => {
    if (phase !== "to-roof" && phase !== "to-room") return;
    const target = phase === "to-roof" ? "roof" : "room";
    const timer = window.setTimeout(() => setPhase(target), reduceMotion ? 80 : 920);
    return () => window.clearTimeout(timer);
  }, [phase, reduceMotion]);

  useEffect(() => {
    if (phase !== "roof") {
      setTelescopeOpen(false);
      setRadioOn(false);
    }
  }, [phase]);

  return (
    <>
      <button
        className="room-side-door-portal"
        type="button"
        onClick={() => setPhase("to-roof")}
        aria-label="Take the stairs to the rooftop"
      >
        <span className="side-door-frame" aria-hidden="true">
          <i className="side-door-window" />
          <i className="side-door-handle" />
          <i className="side-door-light" />
        </span>
        <span className="side-door-hint">ROOF ↑</span>
      </button>

      <AnimatePresence>
        {(phase === "to-roof" || phase === "to-room") && (
          <motion.div
            className={`corridor-transition ${phase === "to-room" ? "is-returning" : ""}`}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-hidden="true"
          >
            <div className="corridor-wall corridor-wall-left" />
            <div className="corridor-wall corridor-wall-right" />
            <div className="corridor-ceiling" />
            <div className="corridor-floor">
              {Array.from({ length: 7 }).map((_, index) => <i key={index} />)}
            </div>
            <div className="corridor-lamps"><i /><i /><i /></div>
            <div className="corridor-stairs">
              {Array.from({ length: 8 }).map((_, index) => <i key={index} />)}
            </div>
            <div className="corridor-roof-door"><span /></div>
            <div className="corridor-camera-glow" />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === "roof" && (
          <motion.section
            className="rooftop-world"
            initial={reduceMotion ? false : { opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: reduceMotion ? .05 : .65, ease: [0.22, 1, 0.36, 1] }}
            aria-label="Interactive rooftop"
          >
            <div className="roof-sky" aria-hidden="true">
              <div className="roof-stars" />
              <div className="roof-moon" />
              <div className="roof-moon-glow" />
              <div className="roof-cloud roof-cloud-a" />
              <div className="roof-cloud roof-cloud-b" />
              <div className="roof-plane"><i /></div>
              <div className="roof-haze roof-haze-a" />
              <div className="roof-haze roof-haze-b" />
            </div>

            <div className="roof-city-glow" aria-hidden="true" />
            <div className="roof-city roof-city-back" aria-hidden="true">
              {Array.from({ length: 14 }).map((_, index) => <i key={index} style={{ "--b": index } as React.CSSProperties} />)}
            </div>
            <div className="roof-city roof-city-front" aria-hidden="true">
              {Array.from({ length: 10 }).map((_, index) => <i key={index} style={{ "--b": index } as React.CSSProperties} />)}
            </div>
            <div className="roof-road-lights" aria-hidden="true">
              {Array.from({ length: 11 }).map((_, index) => <i key={index} />)}
            </div>

            <div className="roof-floor" aria-hidden="true" />
            <div className="roof-floor-grit" aria-hidden="true" />
            <div className="roof-puddle roof-puddle-a" aria-hidden="true" />
            <div className="roof-puddle roof-puddle-b" aria-hidden="true" />
            <div className="roof-parapet" aria-hidden="true"><span /><span /><span /></div>
            <div className="roof-parapet-caps" aria-hidden="true"><i /><i /><i /><i /><i /></div>

            <div className="roof-service-pipes" aria-hidden="true"><i /><i /><i /><span /></div>
            <div className="roof-cable roof-cable-a" aria-hidden="true" />
            <div className="roof-cable roof-cable-b" aria-hidden="true" />
            <div className="roof-vent-stack" aria-hidden="true"><i /><span /></div>
            <div className="roof-chimney" aria-hidden="true"><i /><span className="chimney-smoke smoke-a" /><span className="chimney-smoke smoke-b" /></div>

            <div className="roof-water-tank" aria-hidden="true"><i /><span /></div>
            <div className="tank-pipes" aria-hidden="true"><i /><i /></div>
            <div className="roof-antenna" aria-hidden="true"><i /><i /><span /></div>
            <div className="roof-satellite dish-a" aria-hidden="true"><i /><span /></div>
            <div className="roof-satellite dish-b" aria-hidden="true"><i /><span /></div>
            <div className="roof-ac roof-ac-a" aria-hidden="true"><i /></div>
            <div className="roof-ac roof-ac-b" aria-hidden="true"><i /></div>
            <div className="roof-ac roof-ac-c" aria-hidden="true"><i /></div>

            <div className="roof-string-lights" aria-hidden="true">
              {Array.from({ length: 9 }).map((_, index) => <i key={index} />)}
            </div>
            <div className="roof-laundry" aria-hidden="true"><span /><i /><i /><i /></div>
            <div className="roof-crates" aria-hidden="true"><i /><i /><i /></div>
            <div className="roof-bench" aria-hidden="true"><span /><i /><i /></div>
            <div className="roof-service-light" aria-hidden="true"><i /></div>

            <button className="roof-return-door" type="button" onClick={() => setPhase("to-room")} aria-label="Go back downstairs">
              <span className="roof-return-light" />
              <span className="roof-return-label">↓</span>
            </button>

            <div className={`roof-telescope ${telescopeOpen ? "is-looking" : ""}`}>
              <span className="telescope-body" aria-hidden="true"><i /><b /></span>
              <button type="button" onClick={() => setTelescopeOpen((value) => !value)} aria-label="Look through the telescope" />
            </div>

            <AnimatePresence>
              {telescopeOpen && (
                <motion.div
                  className="career-sky-map"
                  initial={reduceMotion ? false : { opacity: 0, scale: .75 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: .82 }}
                  transition={{ duration: .32 }}
                  role="dialog"
                  aria-label="Career constellation"
                >
                  <button type="button" className="sky-map-close" onClick={() => setTelescopeOpen(false)} aria-label="Stop looking through telescope">×</button>
                  <div className="sky-map-line line-a" />
                  <div className="sky-map-line line-b" />
                  <div className="sky-node sky-node-a"><i /><strong>BUILD</strong><small>Laravel · APIs</small></div>
                  <div className="sky-node sky-node-b"><i /><strong>SCALE</strong><small>Tenancy · Queues · Data</small></div>
                  <div className="sky-node sky-node-c"><i /><strong>SHIP</strong><small>Tests · Production</small></div>
                  <div className="sky-map-caption">8+ years / same rule: understand the system before changing it.</div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className={`roof-radio ${radioOn ? "is-on" : ""}`}>
              <i aria-hidden="true" />
              <button type="button" onClick={() => setRadioOn((value) => !value)} aria-label={radioOn ? "Turn rooftop radio off" : "Turn rooftop radio on"} />
              <AnimatePresence>
                {radioOn && (
                  <motion.span initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    late-night deploy frequency // all systems nominal
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            <div className="roof-cat" aria-hidden="true"><i /><span /></div>
            <div className="roof-hint" aria-hidden="true">look around</div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
