"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { experience, profile, projects, skills, type Project } from "@/data/portfolio";

type HotspotId = "projects" | "skills" | "experience" | "about" | "contact";
type ViewMode = "explore" | "quick";

const hotspots: Record<HotspotId, { eyebrow: string; title: string; hint: string }> = {
  projects: { eyebrow: "Laptop", title: "Selected projects", hint: "Open case files" },
  skills: { eyebrow: "Bookshelf", title: "Toolbox", hint: "Inspect the stack" },
  experience: { eyebrow: "Desk drawer", title: "Experience", hint: "Open the drawer" },
  about: { eyebrow: "Wall board", title: "About Mahmoud", hint: "Read the notes" },
  contact: { eyebrow: "Phone", title: "Contact", hint: "Pick up the phone" },
};

export function PortfolioExperience() {
  const reduceMotion = useReducedMotion();
  const [entered, setEntered] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("explore");
  const [active, setActive] = useState<HotspotId | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [doorState, setDoorState] = useState<"idle" | "ringing" | "invited">("idle");

  useEffect(() => {
    if (doorState !== "ringing") return;

    const timer = window.setTimeout(() => setDoorState("invited"), reduceMotion ? 80 : 650);
    return () => window.clearTimeout(timer);
  }, [doorState, reduceMotion]);

  const progress = useMemo(() => (active ? 1 : 0), [active]);

  if (!entered) {
    return (
      <main className="entry-scene">
        <div className="entry-stars" aria-hidden="true" />
        <div className="entry-copy">
          <p className="kicker">PORTFOLIO / 2026</p>
          <h1>{profile.name}</h1>
          <p className="entry-role">{profile.role}</p>
          <p className="entry-tagline">{profile.tagline}</p>
        </div>

        <div className={`house-wrap door-${doorState}`} aria-label="A developer townhouse at night">
          <div className="moon" />
          <div className="house">
            <div className="roof" />
            <div className="house-trim" aria-hidden="true" />
            <div className="house-number" aria-hidden="true">28</div>
            <div className="porch-light" aria-hidden="true"><span /></div>
            <div className="window window-left"><span /></div>
            <div className="window window-right invitation-window">
              <span />
              <AnimatePresence>
                {doorState === "invited" && (
                  <motion.div
                    className="window-message"
                    initial={reduceMotion ? false : { opacity: 0, y: 8, scale: .92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: .28 }}
                    role="status"
                  >
                    ادخل يا حبب
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="porch-planter porch-planter-left" aria-hidden="true"><i /><i /><i /></div>
            <div className="porch-planter porch-planter-right" aria-hidden="true"><i /><i /><i /></div>
            <div className="porch-steps" aria-hidden="true"><span /><span /><span /></div>

            <button
              className="doorbell"
              type="button"
              onClick={() => setDoorState("ringing")}
              disabled={doorState !== "idle"}
              aria-label={doorState === "idle" ? "Ring the doorbell" : "Doorbell rung"}
            >
              <span className="doorbell-led" />
              <span className="doorbell-button" />
              <span className="doorbell-hint">RING</span>
            </button>

            <button
              className="front-door"
              type="button"
              onClick={() => doorState === "invited" && setEntered(true)}
              disabled={doorState !== "invited"}
              aria-label={doorState === "invited" ? "Enter the house" : "Ring the doorbell first"}
            >
              <span className="door-light" />
              <span className="door-label">{doorState === "invited" ? "ENTER" : ""}</span>
            </button>
          </div>
          <div className="ground-line" />
        </div>

        <div className="entry-actions">
          <button className="primary-action" type="button" onClick={() => setEntered(true)}>
            Enter the workspace
          </button>
          <button
            className="text-action"
            type="button"
            onClick={() => {
              setEntered(true);
              setViewMode("quick");
            }}
          >
            Skip exploration → Quick view
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="portfolio-shell">
      <header className="topbar">
        <button className="brand-button" type="button" onClick={() => { setEntered(false); setDoorState("idle"); }}>
          <span className="brand-mark">MS</span>
          <span>
            <strong>{profile.name}</strong>
            <small>{profile.role}</small>
          </span>
        </button>

        <div className="mode-switch" role="group" aria-label="Portfolio view">
          <button
            className={viewMode === "explore" ? "is-active" : ""}
            type="button"
            onClick={() => setViewMode("explore")}
          >
            Explore
          </button>
          <button
            className={viewMode === "quick" ? "is-active" : ""}
            type="button"
            onClick={() => setViewMode("quick")}
          >
            Quick view
          </button>
        </div>
      </header>

      {viewMode === "explore" ? (
        <section className="explore-layout">
          <div className="room-copy">
            <p className="kicker">INTERACTIVE WORKSPACE</p>
            <h1>Backend engineering,<br />hidden in plain sight.</h1>
            <p>Click the glowing objects. Every part of the room opens a different part of the portfolio.</p>
            <div className="explore-status">
              <span className="status-dot" />
              <span>{progress ? "Object opened" : "5 objects to explore"}</span>
            </div>
          </div>

          <RoomScene
            reduceMotion={Boolean(reduceMotion)}
            active={active}
            onOpen={(id) => {
              setProject(null);
              setActive(id);
            }}
          />
        </section>
      ) : (
        <QuickView onProject={setProject} />
      )}

      <AnimatePresence>
        {active && (
          <ExplorerPanel
            key={active}
            active={active}
            project={project}
            onProject={setProject}
            onClose={() => {
              setProject(null);
              setActive(null);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {project && viewMode === "quick" && (
          <ProjectModal project={project} onClose={() => setProject(null)} />
        )}
      </AnimatePresence>
    </main>
  );
}

function RoomScene({
  active,
  onOpen,
  reduceMotion,
}: {
  active: HotspotId | null;
  onOpen: (id: HotspotId) => void;
  reduceMotion: boolean;
}) {
  const button = (id: HotspotId, className: string, label: string) => (
    <button
      className={`hotspot ${className} ${active === id ? "is-active" : ""}`}
      type="button"
      onClick={() => onOpen(id)}
      aria-label={`${label}: ${hotspots[id].title}`}
    >
      <span className="hotspot-ring" />
      <span className="hotspot-tooltip">
        <small>{hotspots[id].eyebrow}</small>
        {hotspots[id].hint}
      </span>
    </button>
  );

  return (
    <motion.div
      className="room-stage"
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="room-ambient" />
      <div className="room-wall room-wall-left" />
      <div className="room-wall room-wall-right" />
      <div className="room-floor">
        {Array.from({ length: 8 }).map((_, index) => <span key={index} />)}
      </div>

      <div className="window-scene" aria-hidden="true">
        <div className="window-sky"><span className="window-moon" /></div>
        <div className="window-frame-v" />
        <div className="window-frame-h" />
      </div>

      <div className="wall-board" aria-hidden="true">
        <span className="board-pin board-pin-a" />
        <span className="board-pin board-pin-b" />
        <div className="board-paper paper-a">API<br />FIRST</div>
        <div className="board-paper paper-b">SHIP<br />SAFE</div>
        <div className="board-paper paper-c">8+<br /><small>YEARS</small></div>
      </div>

      <div className="bookshelf" aria-hidden="true">
        <div className="shelf shelf-a">
          <i /><i /><i /><i /><i />
        </div>
        <div className="shelf shelf-b">
          <i /><i /><i /><i />
        </div>
        <div className="shelf shelf-c">
          <i /><i /><i /><i /><i />
        </div>
      </div>

      <div className="cabinet" aria-hidden="true">
        <div className="cabinet-door"><span /></div>
        <div className="cabinet-door"><span /></div>
      </div>

      <div className="desk" aria-hidden="true">
        <div className="desk-top" />
        <div className="desk-leg desk-leg-left" />
        <div className="desk-leg desk-leg-right" />
        <div className="desk-drawer"><span /></div>
      </div>

      <div className="monitor" aria-hidden="true">
        <div className="monitor-screen">
          <span className="terminal-line terminal-line-a" />
          <span className="terminal-line terminal-line-b" />
          <span className="terminal-line terminal-line-c" />
          <strong>&gt; php artisan ship</strong>
        </div>
        <div className="monitor-neck" />
        <div className="monitor-base" />
      </div>

      <div className="keyboard" aria-hidden="true" />
      <div className="mug" aria-hidden="true"><span /></div>
      <div className="phone" aria-hidden="true"><span /></div>
      <div className="chair" aria-hidden="true">
        <div className="chair-back" />
        <div className="chair-seat" />
        <div className="chair-stem" />
      </div>
      <div className="plant" aria-hidden="true">
        <div className="plant-pot" />
        <i className="leaf leaf-a" /><i className="leaf leaf-b" /><i className="leaf leaf-c" />
      </div>

      {button("projects", "hotspot-laptop", "Laptop")}
      {button("skills", "hotspot-books", "Bookshelf")}
      {button("experience", "hotspot-drawer", "Desk drawer")}
      {button("about", "hotspot-board", "Wall board")}
      {button("contact", "hotspot-phone", "Phone")}

      <div className="room-caption">Mahmoud's workspace · click a glowing object</div>
    </motion.div>
  );
}

function ExplorerPanel({
  active,
  project,
  onProject,
  onClose,
}: {
  active: HotspotId;
  project: Project | null;
  onProject: (project: Project | null) => void;
  onClose: () => void;
}) {
  return (
    <motion.aside
      className="explorer-panel"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 250, damping: 30 }}
      aria-label={hotspots[active].title}
    >
      <div className="panel-head">
        <div>
          <p className="kicker">{hotspots[active].eyebrow}</p>
          <h2>{hotspots[active].title}</h2>
        </div>
        <button type="button" className="close-button" onClick={onClose} aria-label="Close panel">×</button>
      </div>

      <div className="panel-scroll">
        {active === "projects" && !project && (
          <div className="case-list">
            {projects.map((item, index) => (
              <button className="case-file" type="button" key={item.slug} onClick={() => onProject(item)}>
                <span>0{index + 1}</span>
                <div>
                  <small>{item.label}</small>
                  <strong>{item.name}</strong>
                  <p>{item.summary}</p>
                </div>
                <b>↗</b>
              </button>
            ))}
          </div>
        )}

        {active === "projects" && project && (
          <CaseStudy project={project} onBack={() => onProject(null)} />
        )}

        {active === "skills" && (
          <div className="skills-grid">
            {skills.map((skill, index) => (
              <div className="skill-chip" key={skill}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {skill}
              </div>
            ))}
          </div>
        )}

        {active === "experience" && (
          <div className="experience-list">
            {experience.map((item, index) => (
              <article key={item.title}>
                <span>0{index + 1}</span>
                <div><h3>{item.title}</h3><p>{item.copy}</p></div>
              </article>
            ))}
          </div>
        )}

        {active === "about" && (
          <div className="about-panel">
            <p className="large-copy">{profile.intro}</p>
            <div className="about-facts">
              <div><small>BASE</small><strong>{profile.location}</strong></div>
              <div><small>FOCUS</small><strong>Backend · Architecture · Reliability</strong></div>
              <div><small>DEFAULT MODE</small><strong>Find the root cause. Ship the narrow fix.</strong></div>
            </div>
            <blockquote>“{profile.tagline}”</blockquote>
          </div>
        )}

        {active === "contact" && (
          <div className="contact-panel">
            <p className="large-copy">Have a backend problem worth opening a drawer for?</p>
            <p>This first version keeps contact links as placeholders until the final public email, LinkedIn and GitHub URLs are confirmed.</p>
            <div className="contact-placeholder">
              <span>STATUS</span>
              <strong>Available for serious engineering work</strong>
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  );
}

function QuickView({ onProject }: { onProject: (project: Project) => void }) {
  return (
    <section className="quick-view">
      <div className="quick-hero">
        <p className="kicker">QUICK VIEW / NO EXPLORATION REQUIRED</p>
        <h1>{profile.name}</h1>
        <h2>{profile.role}</h2>
        <p>{profile.intro}</p>
      </div>

      <div className="quick-section">
        <div className="section-heading"><span>01</span><h2>Selected work</h2></div>
        <div className="quick-projects">
          {projects.map((item) => (
            <button key={item.slug} className="quick-project" type="button" onClick={() => onProject(item)}>
              <small>{item.label}</small>
              <strong>{item.name}</strong>
              <p>{item.summary}</p>
              <span>Open case file ↗</span>
            </button>
          ))}
        </div>
      </div>

      <div className="quick-section quick-two-col">
        <div>
          <div className="section-heading"><span>02</span><h2>Core stack</h2></div>
          <div className="skill-lines">{skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
        </div>
        <div>
          <div className="section-heading"><span>03</span><h2>How I work</h2></div>
          <p className="quick-principle">Find the real failure mode. Keep the change narrow. Cover the regression. Ship without surprising the rest of the system.</p>
        </div>
      </div>
    </section>
  );
}

function CaseStudy({ project, onBack }: { project: Project; onBack?: () => void }) {
  return (
    <article className="case-study">
      {onBack && <button className="back-button" type="button" onClick={onBack}>← All case files</button>}
      <p className="kicker">CASE FILE / {project.label}</p>
      <h2>{project.name}</h2>
      <p className="large-copy">{project.summary}</p>
      <dl>
        <div><dt>THE PROBLEM</dt><dd>{project.problem}</dd></div>
        <div><dt>WHAT I BUILT</dt><dd>{project.build}</dd></div>
        <div><dt>RESULT</dt><dd>{project.impact}</dd></div>
      </dl>
      <div className="architecture-tags">{project.architecture.map((item) => <span key={item}>{item}</span>)}</div>
    </article>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="project-modal" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 16, opacity: 0 }}>
        <button type="button" className="close-button modal-close" onClick={onClose} aria-label="Close case study">×</button>
        <CaseStudy project={project} />
      </motion.div>
    </motion.div>
  );
}
