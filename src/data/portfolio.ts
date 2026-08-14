export type Project = {
  slug: string;
  name: string;
  label: string;
  summary: string;
  problem: string;
  build: string;
  architecture: string[];
  impact: string;
};

export const profile = {
  name: "Mahmoud Salama",
  role: "Senior Laravel Backend Developer",
  tagline: "I build backend systems that stay boring under pressure.",
  intro:
    "8+ years building Laravel products, APIs, multi-tenant platforms, reporting systems, and integrations.",
  location: "Egypt · Remote",
};

export const projects: Project[] = [
  {
    slug: "barq",
    name: "Barq",
    label: "News platform",
    summary:
      "A multi-country news platform with APIs, feeds, video/reels, comments, ads, notifications, and scheduled ingestion.",
    problem:
      "Keep a content-heavy product fast and reliable while many independent product flows evolve in parallel.",
    build:
      "Backend APIs and production fixes across news, media, comments, cron scheduling, moderation, affiliate flows, and feed behavior.",
    architecture: ["Laravel", "Next.js", "MySQL", "Queues", "Scheduled jobs", "REST APIs"],
    impact:
      "Shipped production features without sacrificing existing behavior, with regression coverage around high-risk flows.",
  },
  {
    slug: "numoerp",
    name: "NumoERP",
    label: "Multi-tenant ERP",
    summary:
      "A Laravel multi-tenant ERP with student workflows, approvals, reports, payments, OTP flows, and administration tools.",
    problem:
      "Complex business rules must stay correctly scoped across tenants, semesters, platforms, users, payments, and admin workflows.",
    build:
      "Scoped data access, approval lifecycles, report/export logic, configurable OTP delivery, dashboard statistics, and regression suites.",
    architecture: ["Laravel", "Tenancy", "Livewire", "Vue", "MySQL", "Redis"],
    impact:
      "Reduced hidden cross-scope bugs and turned fragile business rules into explicit, testable backend behavior.",
  },
  {
    slug: "fatoorah",
    name: "Fatoorah",
    label: "Accounting & commerce",
    summary:
      "A Laravel commerce/accounting product covering invoices, POS flows, products, accounting trees, PDFs, and tenant data.",
    problem:
      "Small accounting and product bugs can cascade into incorrect financial or operational behavior.",
    build:
      "Fixed account inheritance, product ordering, invoice exports, POS pricing/unit behavior, and accounting edge cases with targeted tests.",
    architecture: ["Laravel", "MySQL", "Multi-tenancy", "PDF", "REST APIs", "Accounting domain"],
    impact:
      "Focused fixes on correctness first, preserving existing flows and keeping changes narrow enough to verify confidently.",
  },
];

export const skills = [
  "Laravel",
  "PHP",
  "REST APIs",
  "MySQL",
  "Redis",
  "Queues",
  "Multi-tenancy",
  "Payments",
  "Reporting",
  "Testing",
  "Git",
  "Production debugging",
];

export const experience = [
  {
    title: "Backend systems",
    copy: "APIs, business rules, permissions, queues, cron jobs, integrations, reporting and data-heavy workflows.",
  },
  {
    title: "Production work",
    copy: "Root-cause analysis, narrow fixes, regression coverage, safe migrations and careful rollout decisions.",
  },
  {
    title: "Engineering style",
    copy: "Simple architecture, explicit domain rules and solutions that other engineers can maintain after the task is done.",
  },
];
