"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { experience, profile, projects, skills, type Project } from "@/data/portfolio";

type HotspotId = "projects" | "skills" | "experience" | "about" | "contact";
type ViewMode = "explore" | "quick";

const hotspots: Record<HotspotId, { title: string; hint: string }> = {
  projects: { title: "Projects", hint: "Wake the monitor" },
  skills: { title: "Skills", hint: "Pull a book" },
  experience: { title: "Experience", hint: "Open the drawer" },
  about: { title: "About", hint: "Read the board" },
  contact: { title: "Contact", hint: "Check the phone" },
};

const skillNotes: Record<string, string> = {
  Laravel: "My main production toolkit for domain-heavy applications, APIs, queues, scheduled jobs, permissions, reports and integrations.",
  PHP: "The language underneath most of the systems I ship. I care about readable domain code, predictable behavior and boring maintenance.",
  "REST APIs": "I design APIs around explicit contracts, validation, authorization, stable response shapes and regression-safe changes.",
  MySQL: "Schema design, query debugging, reporting, migrations and the kind of data problems where one wrong scope can change the answer completely.",
  Redis: "Caching, locks, queues and fast ephemeral state — used carefully where it simplifies a system instead of hiding problems.",
  Queues: "Background work that is retryable, observable and safe to run more than once. Jobs should fail loudly and recover predictably.",
  "Multi-tenancy": "Tenant boundaries must be impossible to forget. I prefer scoping rules that are explicit, reusable and covered by tests.",
  Payments: "Payment state is business state. I treat refunds, retries, partial states and gateway callbacks as first-class domain rules.",
  Reporting: "Reports are only useful when they answer the same question everywhere. I focus on shared query rules and trustworthy exports.",
  Testing: "Targeted regression tests around the failure mode, not tests for decoration. The goal is to stop the same bug coming back.",
  Git: "Small reviewable changes, clean history when it matters, and safe promotion between branches without dragging unrelated work along.",
  "Production debugging": "Reproduce the real failure, follow the data, find the narrowest root cause, then change as little as possible.",
};

export function PortfolioExperience() {
  const reduceMotion = useReducedMotion();
  const [entered, setEntered] = useState(false);
  const [entering, setEntering] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("explore");
  const [active, setActive] = useState<HotspotId | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [doorState, setDoorState] = useState<"idle" | "ringing" | "invited">("idle");

  useEffect(() => {
    if (doorState !== "ringing") return;
    const timer = window.setTimeout(() => setDoorState("invited"), reduceMotion ? 80 : 650);
    return () => window.clearTimeout(timer);
  }, [doorState, reduceMotion]);

  useEffect(() => {
    if (!active) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setProject(null);
        setActive(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  const enterHouse = () => {
    if (doorState !== "invited" || entering) return;
    setEntering(true);
    window.setTimeout(() => {
      setEntered(true);
      setEntering(false);
    }, reduceMotion ? 90 : 1050);
  };

  if (!entered) {
    return (
      <main className={`entry-scene ${entering ? "is-entering-house" : ""}`}>
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
                {doorState === "invited" && !entering && (
                  <motion.div
                    className="window-message"
                    initial={reduceMotion ? false : { opacity: 0, y: 8, scale: .92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -5 }}
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
              disabled={doorState !== "idle" || entering}
              aria-label={doorState === "idle" ? "Ring the doorbell" : "Doorbell rung"}
            >
              <span className="doorbell-led" />
              <span className="doorbell-button" />
              <span className="doorbell-hint">RING</span>
            </button>

            <button
              className={`front-door ${entering ? "is-opening" : ""}`}
              type="button"
              onClick={enterHouse}
              disabled={doorState !== "invited" || entering}
              aria-label={doorState === "invited" ? "Enter the house" : "Ring the doorbell first"}
            >
              <span className="door-interior" aria-hidden="true" />
              <span className="door-light" />
              <span className="door-label">{doorState === "invited" && !entering ? "ENTER" : ""}</span>
            </button>
          </div>
          <div className="ground-line" />
        </div>

        <AnimatePresence>
          {entering && (
            <motion.div
              className="entry-threshold"
              initial={reduceMotion ? false : { opacity: 0, scale: .78 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? .05 : .92, ease: [0.22, 1, 0.36, 1] }}
              aria-hidden="true"
            >
              <span className="threshold-hall" />
              <span className="threshold-light" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="entry-actions">
          <button className="primary-action" type="button" onClick={() => setEntered(true)}>Enter the workspace</button>
          <button className="text-action" type="button" onClick={() => { setEntered(true); setViewMode("quick"); }}>
            Skip exploration → Quick view
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className={`portfolio-shell immersive-shell ${viewMode === "explore" ? "is-exploring" : ""}`}>
      <header className="topbar immersive-topbar">
        <button className="brand-button" type="button" onClick={() => { setEntered(false); setDoorState("idle"); setActive(null); }} aria-label="Go back outside">
          <span className="brand-mark">MS</span>
        </button>

        <div className="mode-switch" role="group" aria-label="Portfolio view">
          <button className={viewMode === "explore" ? "is-active" : ""} type="button" onClick={() => setViewMode("explore")}>Explore</button>
          <button className={viewMode === "quick" ? "is-active" : ""} type="button" onClick={() => { setActive(null); setViewMode("quick"); }}>Quick view</button>
        </div>
      </header>

      {viewMode === "explore" ? (
        <section className="immersive-room-layout room-arrival" aria-label="Interactive developer room">
          <div className="arrival-light" aria-hidden="true" />
          <RoomScene
            reduceMotion={Boolean(reduceMotion)}
            active={active}
            project={project}
            onProject={setProject}
            onOpen={(id) => {
              setProject(null);
              setActive((current) => current === id ? null : id);
            }}
            onClose={() => {
              setProject(null);
              setActive(null);
            }}
          />
        </section>
      ) : (
        <QuickView onProject={setProject} />
      )}

      <AnimatePresence>
        {project && viewMode === "quick" && <ProjectModal project={project} onClose={() => setProject(null)} />}
      </AnimatePresence>
    </main>
  );
}

function RoomScene({
  active,
  project,
  onOpen,
  onProject,
  onClose,
  reduceMotion,
}: {
  active: HotspotId | null;
  project: Project | null;
  onOpen: (id: HotspotId) => void;
  onProject: (project: Project | null) => void;
  onClose: () => void;
  reduceMotion: boolean;
}) {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<number | null>(null);

  useEffect(() => {
    if (active !== "skills") setSelectedSkill(null);
    if (active !== "experience") setSelectedExperience(null);
  }, [active]);

  const button = (id: HotspotId, className: string, label: string) => (
    <button
      className={`hotspot ${className} ${active === id ? "is-active" : ""}`}
      type="button"
      onClick={() => onOpen(id)}
      aria-label={`${label}: ${hotspots[id].title}`}
      aria-expanded={active === id}
    >
      <span className="hotspot-ring" />
      <span className="hotspot-tooltip"><small>{hotspots[id].title}</small>{hotspots[id].hint}</span>
    </button>
  );

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - .5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - .5) * 2;
    event.currentTarget.style.setProperty("--look-x", x.toFixed(3));
    event.currentTarget.style.setProperty("--look-y", y.toFixed(3));
  };

  const selectedExperienceItem = selectedExperience === null ? null : experience[selectedExperience];

  return (
    <motion.div
      className={`room-stage immersive-room active-${active ?? "none"}`}
      data-active={active ?? "none"}
      initial={reduceMotion ? false : { opacity: 0, scale: 1.09, filter: "brightness(.5)" }}
      animate={{ opacity: 1, scale: 1, filter: "brightness(1)" }}
      transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
      onPointerMove={handlePointerMove}
      onPointerLeave={(event) => {
        event.currentTarget.style.setProperty("--look-x", "0");
        event.currentTarget.style.setProperty("--look-y", "0");
      }}
    >
      <div className="room-vignette" aria-hidden="true" />
      <div className="room-ambient" aria-hidden="true" />
      <div className="room-dust" aria-hidden="true" />
      <div className="room-wall room-wall-left" aria-hidden="true" />
      <div className="room-wall room-wall-right" aria-hidden="true" />
      <div className="ceiling-beam" aria-hidden="true" />
      <div className="room-floor" aria-hidden="true">{Array.from({ length: 8 }).map((_, index) => <span key={index} />)}</div>

      <div className="window-scene room-depth-back" aria-hidden="true">
        <div className="window-sky"><span className="window-moon" /><i className="distant-building building-a" /><i className="distant-building building-b" /></div>
        <div className="window-frame-v" /><div className="window-frame-h" />
      </div>

      <div className={`wall-board room-depth-mid ${active === "about" ? "is-open" : ""}`}>
        <span className="board-pin board-pin-a" /><span className="board-pin board-pin-b" />
        <div className="board-paper paper-a">API<br />FIRST</div>
        <div className="board-paper paper-b">SHIP<br />SAFE</div>
        <div className="board-paper paper-c">8+<br /><small>YEARS</small></div>
        <AnimatePresence>
          {active === "about" && (
            <motion.div className="board-story" initial={reduceMotion ? false : { opacity: 0, scale: .9, rotate: -2 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: .94 }}>
              <button className="object-close" type="button" onClick={onClose} aria-label="Close about notes">×</button>
              <p className="board-intro">{profile.intro}</p>
              <div className="board-note board-note-a"><small>BASE</small><strong>{profile.location}</strong></div>
              <div className="board-note board-note-b"><small>FOCUS</small><strong>Backend · Architecture · Reliability</strong></div>
              <div className="board-note board-note-c"><small>MODE</small><strong>Find the root cause.<br />Ship the narrow fix.</strong></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className={`bookshelf room-depth-mid ${active === "skills" ? "is-open" : ""}`}>
        <div className="shelf shelf-a">{skills.slice(0, 4).map((skill) => <i key={skill} data-label={skill} />)}</div>
        <div className="shelf shelf-b">{skills.slice(4, 8).map((skill) => <i key={skill} data-label={skill} />)}</div>
        <div className="shelf shelf-c">{skills.slice(8, 12).map((skill) => <i key={skill} data-label={skill} />)}</div>
        <AnimatePresence>
          {active === "skills" && (
            <motion.div className="shelf-skills" initial={reduceMotion ? false : { opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
              <button className="object-close" type="button" onClick={onClose} aria-label="Close skills">×</button>
              {skills.map((skill, index) => (
                <button
                  key={skill}
                  type="button"
                  className="skill-book"
                  style={{ "--book-i": index } as React.CSSProperties}
                  onClick={() => setSelectedSkill(skill)}
                  aria-label={`Open ${skill} book`}
                >
                  {skill}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {active === "skills" && selectedSkill && (
            <motion.div
              key={selectedSkill}
              className="open-book"
              initial={reduceMotion ? false : { opacity: 0, scale: .72, rotateY: -20, x: -55 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0, x: 0 }}
              exit={{ opacity: 0, scale: .82, rotateY: -12, x: -30 }}
              transition={{ duration: .34, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="book-page book-page-left">
                <small>THE TOOLBOX / {String(skills.indexOf(selectedSkill) + 1).padStart(2, "0")}</small>
                <h3>{selectedSkill}</h3>
                <p>Not just a keyword on a CV. This is how it shows up in the systems I actually work on.</p>
                <span className="book-mark">MAHMOUD&apos;S WORKSHELF</span>
              </div>
              <div className="book-page book-page-right">
                <button className="book-close" type="button" onClick={() => setSelectedSkill(null)} aria-label="Close book">×</button>
                <small>FIELD NOTES</small>
                <p>{skillNotes[selectedSkill]}</p>
                <span className="book-mark">turn the idea into production →</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="cabinet room-depth-mid" aria-hidden="true"><div className="cabinet-door"><span /></div><div className="cabinet-door"><span /></div></div>

      <div className={`desk room-depth-front ${active === "experience" ? "drawer-open" : ""}`}>
        <div className="desk-top" /><div className="desk-leg desk-leg-left" /><div className="desk-leg desk-leg-right" />
        <div className="desk-drawer"><span /></div>
        <AnimatePresence>
          {active === "experience" && (
            <motion.div className="drawer-files" initial={reduceMotion ? false : { opacity: 0, y: 28, scale: .9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: .94 }}>
              <button className="object-close" type="button" onClick={onClose} aria-label="Close experience drawer">×</button>
              {experience.map((item, index) => (
                <button
                  type="button"
                  className={`drawer-file drawer-file-${index + 1}`}
                  key={item.title}
                  onClick={() => setSelectedExperience(index)}
                  aria-label={`Open experience file: ${item.title}`}
                >
                  <small>CASE FILE / 0{index + 1}</small>
                  <strong>{item.title}</strong>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {active === "experience" && selectedExperience !== null && selectedExperienceItem && (
            <motion.article
              key={selectedExperienceItem.title}
              className="drawer-document"
              initial={reduceMotion ? false : { opacity: 0, y: 70, rotate: -7, scale: .75 }}
              animate={{ opacity: 1, y: 0, rotate: -1, scale: 1 }}
              exit={{ opacity: 0, y: 45, rotate: -5, scale: .86 }}
              transition={{ duration: .36, ease: [0.22, 1, 0.36, 1] }}
            >
              <button className="drawer-document-close" type="button" onClick={() => setSelectedExperience(null)} aria-label="Put file back">×</button>
              <small>PERSONNEL ARCHIVE / {String(selectedExperience + 1).padStart(2, "0")}</small>
              <h3>{selectedExperienceItem.title}</h3>
              <p>{selectedExperienceItem.copy}</p>
              <span className="file-stamp">PRODUCTION EXPERIENCE</span>
            </motion.article>
          )}
        </AnimatePresence>
      </div>

      <div className={`monitor room-depth-front ${active === "projects" ? "is-awake" : ""}`}>
        <div className="monitor-glow" aria-hidden="true" />
        <div className="monitor-screen">
          {active !== "projects" && (
            <div className="terminal-idle">
              <span className="terminal-prompt">mahmoud@home:~$</span>
              <strong>php artisan ship</strong>
              <span className="terminal-line terminal-line-a" />
              <span className="terminal-line terminal-line-b" />
              <span className="terminal-line terminal-line-c" />
              <em>✓ systems nominal</em>
            </div>
          )}

          <AnimatePresence mode="wait">
            {active === "projects" && !project && (
              <motion.div key="desktop" className="workstation-desktop" initial={reduceMotion ? false : { opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <div className="desktop-menubar">
                  <div className="window-dots" aria-hidden="true"><i /><i /><i /></div>
                  <span>mahmoud@workstation</span>
                  <time>21:28</time>
                  <button type="button" onClick={onClose} aria-label="Sleep monitor">×</button>
                </div>

                <div className="desktop-wallpaper" aria-hidden="true"><span>~/portfolio</span></div>

                <div className="desktop-files" aria-label="Project folders">
                  {projects.map((item, index) => (
                    <button key={item.slug} type="button" className="desktop-folder" onClick={() => onProject(item)}>
                      <span className="folder-icon" aria-hidden="true"><i /></span>
                      <strong>{item.name}</strong>
                      <small>{item.label}</small>
                      <b>0{index + 1}</b>
                    </button>
                  ))}
                </div>

                <div className="desktop-terminal" aria-label="Terminal status">
                  <div><span>●</span> terminal — zsh</div>
                  <p><b>$</b> portfolio status</p>
                  <p className="terminal-success">✓ production mindset</p>
                  <p className="terminal-success">✓ regression covered</p>
                  <p><b>$</b> open ./projects/<i className="terminal-caret" /></p>
                </div>

                <div className="desktop-dock" aria-hidden="true"><i /><i /><i /><i /></div>
              </motion.div>
            )}

            {active === "projects" && project && (
              <motion.div key={project.slug} className="project-workspace" initial={reduceMotion ? false : { opacity: 0, scale: .94, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .96 }}>
                <div className="project-window-bar">
                  <div className="window-dots" aria-hidden="true"><i /><i /><i /></div>
                  <span>projects/{project.slug}/README.md</span>
                  <div>
                    <button type="button" onClick={() => onProject(null)}>—</button>
                    <button type="button" onClick={onClose} aria-label="Close projects">×</button>
                  </div>
                </div>

                <div className="project-window-body">
                  <aside className="project-sidebar" aria-label="Project navigation">
                    <button type="button" onClick={() => onProject(null)}>← folders</button>
                    <span className="is-current">README.md</span>
                    <span>architecture/</span>
                    <span>tests/</span>
                    <span>deploy/</span>
                  </aside>

                  <article className="project-readme">
                    <small>{project.label}</small>
                    <h3>{project.name}</h3>
                    <p className="project-lead">{project.summary}</p>
                    <section><b>THE PROBLEM</b><p>{project.problem}</p></section>
                    <section><b>WHAT I BUILT</b><p>{project.build}</p></section>
                    <section className="readme-result"><b>RESULT</b><p>{project.impact}</p></section>
                    <div className="monitor-tags">{project.architecture.map((item) => <span key={item}>{item}</span>)}</div>
                  </article>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="monitor-neck" /><div className="monitor-base" />
      </div>

      <div className="keyboard room-depth-front" aria-hidden="true"><span className="keyboard-led" /></div>
      <div className="mug room-depth-front" aria-hidden="true"><span /><i className="steam steam-a" /><i className="steam steam-b" /></div>
      <div className="desk-clock room-depth-front" aria-hidden="true">21:28</div>

      <div className={`phone room-depth-front ${active === "contact" ? "is-open" : ""}`}>
        <span />
        <AnimatePresence>
          {active === "contact" && (
            <motion.div className="phone-ui" initial={reduceMotion ? false : { opacity: 0, scale: .72, rotate: 8 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: .8 }}>
              <div className="phone-status"><i /> 21:28</div>
              <button className="phone-close" type="button" onClick={onClose} aria-label="Close contact phone">×</button>
              <div className="phone-avatar">MS</div><strong>Mahmoud Salama</strong><small>Senior Laravel Backend Developer</small>
              <div className="phone-contact-actions"><button type="button">GitHub</button><button type="button">LinkedIn</button><button type="button">Email</button></div>
              <p>Available for serious engineering work.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="chair room-depth-near" aria-hidden="true"><div className="chair-back" /><div className="chair-seat" /><div className="chair-stem" /></div>
      <div className="plant room-depth-front" aria-hidden="true"><div className="plant-pot" /><i className="leaf leaf-a" /><i className="leaf leaf-b" /><i className="leaf leaf-c" /></div>
      <div className="floor-rug room-depth-near" aria-hidden="true" />
      <div className="floor-cable room-depth-front" aria-hidden="true" />
      <div className="lamp room-depth-mid" aria-hidden="true"><i /><span /></div>

      {button("projects", "hotspot-laptop", "Monitor")}
      {button("skills", "hotspot-books", "Bookshelf")}
      {button("experience", "hotspot-drawer", "Desk drawer")}
      {button("about", "hotspot-board", "Wall board")}
      {button("contact", "hotspot-phone", "Phone")}

      {active && <button className="room-escape" type="button" onClick={onClose} aria-label="Close current interaction">ESC</button>}
    </motion.div>
  );
}

function QuickView({ onProject }: { onProject: (project: Project) => void }) {
  return (
    <section className="quick-view">
      <div className="quick-hero"><p className="kicker">QUICK VIEW / NO EXPLORATION REQUIRED</p><h1>{profile.name}</h1><h2>{profile.role}</h2><p>{profile.intro}</p></div>
      <div className="quick-section">
        <div className="section-heading"><span>01</span><h2>Selected work</h2></div>
        <div className="quick-projects">{projects.map((item) => <button key={item.slug} className="quick-project" type="button" onClick={() => onProject(item)}><small>{item.label}</small><strong>{item.name}</strong><p>{item.summary}</p><span>Open case file ↗</span></button>)}</div>
      </div>
      <div className="quick-section quick-two-col">
        <div><div className="section-heading"><span>02</span><h2>Core stack</h2></div><div className="skill-lines">{skills.map((skill) => <span key={skill}>{skill}</span>)}</div></div>
        <div><div className="section-heading"><span>03</span><h2>How I work</h2></div><p className="quick-principle">Find the real failure mode. Keep the change narrow. Cover the regression. Ship without surprising the rest of the system.</p></div>
      </div>
    </section>
  );
}

function CaseStudy({ project }: { project: Project }) {
  return (
    <article className="case-study"><p className="kicker">CASE FILE / {project.label}</p><h2>{project.name}</h2><p className="large-copy">{project.summary}</p><dl><div><dt>THE PROBLEM</dt><dd>{project.problem}</dd></div><div><dt>WHAT I BUILT</dt><dd>{project.build}</dd></div><div><dt>RESULT</dt><dd>{project.impact}</dd></div></dl><div className="architecture-tags">{project.architecture.map((item) => <span key={item}>{item}</span>)}</div></article>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="project-modal" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 16, opacity: 0 }}>
        <button type="button" className="close-button modal-close" onClick={onClose} aria-label="Close case study">×</button><CaseStudy project={project} />
      </motion.div>
    </motion.div>
  );
}
