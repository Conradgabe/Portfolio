/**
 * Single source of truth for portfolio content.
 * Everything here is grounded in Gabriel's real, verified work (GitHub read-only).
 * Forks were deliberately excluded; private repos are shown as case studies, not links.
 */

export type Social = {
  label: string;
  handle: string;
  href: string;
  command: string; // how it reads in the terminal
};

export type ProjectImage = { src: string; alt: string; w: number; h: number; label?: string };

export type Project = {
  slug: string;
  name: string; // display name (may differ from cryptic repo name)
  repoName?: string; // the actual GitHub repo, if worth noting
  tagline: string;
  year: string;
  category: string;
  visibility: "private" | "public";
  status?: "shipped" | "active" | "prototype";
  repoUrl?: string; // only for public repos
  liveUrl?: string;
  /** Which stylized mock UI to render until a real screenshot is supplied. */
  mock: "clipn" | "quant" | "saas" | "graphql" | "tailor";
  /** Real product screenshots; when present they replace the stylized mock. */
  images?: ProjectImage[];
  summary: string;
  problem: string;
  approach: string[];
  highlights: string[];
  stack: string[];
  role: string;
};

export type FocusArea = {
  key: string;
  title: string;
  blurb: string;
  items: string[];
};

export const site = {
  name: "Gabriel Isuekebho",
  handle: "conradgabe",
  role: "Backend & Systems Engineer",
  location: "Lagos, Nigeria",
  yearsExperience: 5,
  available: true,

  // Three taglines — Gabriel picks one; #1 is the default in the hero.
  taglines: [
    "Backend & systems engineer — AI pipelines, Lightning, and fintech infrastructure.",
    "I build reliable backends for AI, Bitcoin, and money.",
    "I make distributed systems behave.",
  ],

  metaDescription:
    "Gabriel Isuekebho is a backend & systems engineer in Lagos building AI pipelines, Bitcoin/Lightning tooling, and fintech infrastructure with Python, FastAPI, and TypeScript.",

  bio: [
    "I'm a backend & systems engineer with ~5 years building the parts of software that have to be correct: data pipelines, APIs, payment-adjacent systems, and the infrastructure under them.",
    "Lately my work centres on AI-integrated platforms — real-time assistants, LLM/STT/TTS and vision pipelines, and multi-model orchestration — on top of solid backend and distributed systems across fintech and SaaS. I like problems where reliability, money, and latency all matter at once.",
    "I work mostly in Python and C#, with FastAPI, ASP.NET Core, PostgreSQL/TimescaleDB, Redis, Docker, and Kubernetes as my default toolkit — and I explore Bitcoin and the Lightning Network on the side.",
  ],

  socials: [
    {
      label: "GitHub",
      handle: "@conradgabe",
      href: "https://github.com/conradgabe",
      command: "open github",
    },
    {
      label: "LinkedIn",
      handle: "gabrielisuekebho",
      href: "https://linkedin.com/in/gabrielisuekebho",
      command: "open linkedin",
    },
    {
      label: "Medium",
      handle: "@conradgabe",
      href: "https://medium.com/@conradgabe",
      command: "open medium",
    },
    {
      label: "Email",
      handle: "gisuekebho5880@gmail.com",
      href: "mailto:gisuekebho5880@gmail.com",
      command: "mail",
    },
    // X/Twitter — pending from Gabriel.
  ] satisfies Social[],

  email: "gisuekebho5880@gmail.com",
  githubUser: "conradgabe",
  mediumFeed: "https://medium.com/feed/@conradgabe",
} as const;

export const focusAreas: FocusArea[] = [
  {
    key: "ai",
    title: "AI-Integrated Platforms",
    blurb:
      "Production systems built around LLMs and multimodal AI — not demos. Real-time assistants, multi-model orchestration, and prompt architecture tuned for quality, cost, and latency.",
    items: [
      "LLM orchestration (OpenAI, Claude) · prompt engineering",
      "Real-time AI over WebSockets · STT / TTS · vision models",
      "Multi-model coordination on GPU servers",
      "NLP · ML fine-tuning · AI agents",
    ],
  },
  {
    key: "backend",
    title: "Backend & Distributed Systems",
    blurb:
      "Services built to stay correct under load — typed APIs, microservices, queues, and clean boundaries, deployed and orchestrated for scale.",
    items: [
      "Python (FastAPI, Django) · C# (ASP.NET Core)",
      "REST · GraphQL · WebSockets · microservices",
      "PostgreSQL · TimescaleDB · Redis · SQLAlchemy",
      "Docker · Kubernetes · CI/CD",
    ],
  },
  {
    key: "fintech",
    title: "Fintech & SaaS",
    blurb:
      "Systems where money and multi-tenancy are first-class: billing, payments, enterprise access, and auditable, reliable data.",
    items: [
      "Multi-tenant SaaS · RBAC · SSO · audit logging",
      "Stripe billing — subscriptions & webhooks",
      "Backtesting engines · time-series at scale",
      "Secure financial data pipelines",
    ],
  },
  {
    key: "bitcoin",
    title: "Bitcoin & Lightning (exploring)",
    blurb:
      "Hands-on protocol work through Bitshala's Programming Bitcoin (S2) and the boss-2026 Lightning challenges — coursework and challenges, but real depth.",
    items: [
      "Finite fields · ECC · Script · SegWit",
      "Lightning routing · onion building · coin selection",
      "Signet wallets · a from-scratch Bitcoin wallet",
      "Networking & SPV · bloom filters",
    ],
  },
];

export const skills: { group: string; items: string[] }[] = [
  { group: "languages", items: ["Python", "C#", "TypeScript", "JavaScript", "SQL"] },
  { group: "backend", items: ["FastAPI", "Django", "ASP.NET Core", "REST", "GraphQL", "WebSockets", "Microservices"] },
  { group: "ai / llm", items: ["OpenAI", "Claude", "LLM integration", "Prompt engineering", "NLP", "STT / TTS", "Vision", "AI agents"] },
  { group: "data", items: ["PostgreSQL", "MySQL", "Redis", "TimescaleDB", "SQLAlchemy", "AWS S3"] },
  { group: "infra", items: ["Docker", "Kubernetes", "GitHub Actions", "CI/CD", "AWS", "Oracle Cloud", "Linux"] },
  { group: "frontend", items: ["React", "Next.js", "TailwindCSS", "TanStack Query"] },
  { group: "security", items: ["RBAC", "SSO", "Audit logging", "Stripe", "Data protection"] },
];

export const projects: Project[] = [
  {
    slug: "clipn",
    name: "ClipN",
    tagline: "AI that turns long videos into ready-to-post short clips",
    year: "2026",
    category: "AI · Media Pipeline",
    visibility: "private",
    status: "active",
    mock: "clipn",
    images: [
      { src: "/projects/clipn/hero.png", alt: "ClipN landing page — Long videos in. Viral shorts out.", w: 1387, h: 738, label: "clipn — landing" },
      { src: "/projects/clipn/workspace.png", alt: "ClipN workspace with an imported video ready to clip", w: 1919, h: 929, label: "clipn — workspace" },
      { src: "/projects/clipn/pipeline.png", alt: "ClipN live processing pipeline: detect highlights, transcribe, extract audio", w: 1919, h: 936, label: "clipn — processing pipeline" },
      { src: "/projects/clipn/brand-kit.png", alt: "ClipN brand kit: watermark, intro/outro, brand colours", w: 1919, h: 939, label: "clipn — brand kit" },
      { src: "/projects/clipn/clients.png", alt: "ClipN multi-tenant studio: per-client workspaces", w: 1919, h: 941, label: "clipn — clients" },
    ],
    summary:
      "An AI pipeline that ingests long-form video (upload or a YouTube/Twitch URL), finds the best moments, reframes them vertical with face-tracking, burns in animated captions, and exports platform-ready Shorts, Reels, and TikToks.",
    problem:
      "Creators spend hours manually scrubbing long videos to cut shorts — finding moments, reframing to 9:16, and captioning by hand.",
    approach: [
      "Word-level transcription with faster-whisper, cached and reused across regenerations",
      "Highlight detection via LLM scoring (Claude) fused with audio features, tuned per content vertical",
      "Smart 9:16 reframing — center-crop, MediaPipe face-tracking, split-screen, or letterbox",
      "Single-pass FFmpeg: clip + reframe + caption in one encode (~60% faster than chained encodes)",
      "Parallel clip processing and SSE streaming so clips appear in the UI as each finishes",
      "Live job pipeline with per-stage observability (probe, transcribe, detect highlights, encode)",
    ],
    highlights: [
      "Single-pass FFmpeg — ~60% faster than chained encodes",
      "7 caption styles incl. word-by-word karaoke",
      "Prompt-guided clipping (\"find the funny moments\")",
      "AI-generated retention hooks at clip start",
      "Multi-tenant studio with per-client workspaces",
      "Brand kit + public developer API (OpenAPI)",
    ],
    stack: ["Python", "faster-whisper", "Claude", "MediaPipe", "FFmpeg", "SSE"],
    role: "Design & build (solo)",
  },
  {
    slug: "quant-platform",
    name: "Algome",
    repoName: "stunning-fchess",
    tagline: "Algorithmic trading SaaS — custom strategy execution & backtesting",
    year: "2026",
    category: "Fintech · Backtesting Engine",
    visibility: "private",
    status: "active",
    mock: "quant",
    images: [
      { src: "/projects/algome/dashboard.png", alt: "Algome dashboard — portfolio value, total backtests, active strategies, win rate, and a performance overview chart", w: 1919, h: 944, label: "algome — dashboard" },
      { src: "/projects/algome/strategy-editor.png", alt: "Algome strategy editor — a code-first Python MACD strategy with main.py, strategy.py, requirements, and README", w: 1919, h: 944, label: "algome — strategy editor" },
      { src: "/projects/algome/backtest-config.png", alt: "Algome interactive backtest terminal — configure strategy, assets, timeframes, and date range for an event-driven backtest", w: 1919, h: 942, label: "algome — backtest config" },
      { src: "/projects/algome/backtest-terminal.png", alt: "Algome backtest terminal — load and inspect a strategy via terminal commands during the guided run", w: 1919, h: 947, label: "algome — backtest terminal" },
      { src: "/projects/algome/results.png", alt: "Algome results — performance by market conditions: volatility regime, trading session, and per-asset returns with risk checks passed", w: 1919, h: 940, label: "algome — results & analytics" },
      { src: "/projects/algome/market-data.png", alt: "Algome market data — 11 forex pairs across 5 timeframes, 55 datasets spanning 2015–2026", w: 1919, h: 942, label: "algome — market data" },
    ],
    summary:
      "A professional quant platform for systematic Forex and equities traders: event-driven backtesting with realistic execution, Docker-sandboxed strategy code, survivorship-bias-aware data, and immutable, auditable results.",
    problem:
      "Backtests lie when execution is unrealistic, data is biased, or results can't be reproduced. Serious systematic trading needs an auditable, reproducible engine.",
    approach: [
      "Event-driven backtest engine with proper execution / fill modeling",
      "Code-first Python strategies with strict versioning",
      "Untrusted strategy code executed in Docker sandboxes",
      "Survivorship-bias-aware market data with corporate actions",
      "Immutable results with full lineage tracing for auditability",
    ],
    highlights: [
      "Event-driven engine with realistic fills",
      "Docker-sandboxed strategy execution",
      "Immutable, auditable backtest lineage",
      "Sharpe / Sortino / drawdown analytics",
    ],
    stack: ["FastAPI", "PostgreSQL", "TimescaleDB", "Redis", "SQLAlchemy", "Docker", "React 18", "Recharts"],
    role: "Design & build (solo)",
  },
  {
    slug: "pg-tailor",
    name: "PG-Tailor",
    tagline: "AI career platform — résumé tailoring, fit scoring & interview coaching",
    year: "2026",
    category: "AI · Career Platform",
    visibility: "private",
    status: "active",
    mock: "tailor",
    images: [
      { src: "/projects/pg-tailor/tailor.png", alt: "PG-Tailor tailoring view — upload a CV, paste a job description, pick a template, and a tailored résumé renders live", w: 1919, h: 944, label: "pg-tailor — tailor a résumé" },
      { src: "/projects/pg-tailor/classic.png", alt: "PG-Tailor classic serif template rendering a tailored résumé preview", w: 1919, h: 941, label: "pg-tailor — classic template" },
      { src: "/projects/pg-tailor/two-column.png", alt: "PG-Tailor two-column template with a skills sidebar", w: 1919, h: 947, label: "pg-tailor — two-column template" },
      { src: "/projects/pg-tailor/jobs.png", alt: "PG-Tailor job listings — recent AI and backend roles with role and location filters", w: 1919, h: 941, label: "pg-tailor — job listings" },
      { src: "/projects/pg-tailor/autopilot.png", alt: "PG-Tailor autopilot — AI scans job boards and ranks the best matches for your profile", w: 1919, h: 943, label: "pg-tailor — autopilot" },
    ],
    summary:
      "A full-stack AI career platform with a FastAPI backend that orchestrates chained LLM calls across OpenAI and Claude — résumé tailoring, candidate fit scoring, live job-listing ingestion, and AI interview coaching, with prompt architecture tuned for quality, token efficiency, and latency under concurrent sessions.",
    problem:
      "Tailoring a CV to every role, judging fit, and prepping for interviews by hand is slow — and generic AI output doesn't hold up under real job-hunt volume.",
    approach: [
      "FastAPI backend orchestrating chained LLM calls across the OpenAI and Claude APIs",
      "Résumé tailoring and candidate fit scoring, per role",
      "Live job-listing ingestion and AI interview coaching",
      "Prompt architecture tuned for output quality, token efficiency, and latency under concurrent sessions",
    ],
    highlights: [
      "Chained OpenAI + Claude LLM calls",
      "Candidate fit scoring per role",
      "AI interview coaching",
      "Live job-listing ingestion",
    ],
    stack: ["FastAPI", "Python", "OpenAI", "Claude", "PostgreSQL", "React 18", "TypeScript", "TanStack Query", "Docker"],
    role: "Design & build (solo)",
  },
  {
    slug: "b2b-saas",
    name: "B2B SaaS Platform",
    repoName: "B2B-SaaS-Platoform",
    tagline: "Production-ready multi-tenant backend architecture",
    year: "2025",
    category: "Backend · Multi-tenant SaaS",
    visibility: "public",
    status: "shipped",
    repoUrl: "https://github.com/Conradgabe/B2B-SaaS-Platoform",
    mock: "saas",
    summary:
      "A scalable, multi-tenant B2B SaaS backend built with FastAPI, PostgreSQL, and Docker — designed for tenant isolation, role management, and asynchronous integration with external systems.",
    problem:
      "Multi-tenant SaaS needs hard data isolation, flexible roles, and resilient external integrations from day one — bolting them on later is painful.",
    approach: [
      "Tenant data isolation as a core architectural constraint",
      "Role-based access control for users within tenants",
      "External API integrations with asynchronous webhook processing",
      "Containerized, cloud-ready, and built for extensibility",
    ],
    highlights: [
      "Tenant data isolation",
      "Role-based access control",
      "Async webhook processing",
      "Cloud-ready & extensible",
    ],
    stack: ["FastAPI", "PostgreSQL", "Docker"],
    role: "Design & build (solo)",
  },
  {
    slug: "graphql-api",
    name: "GraphQL API",
    repoName: "graphql-api-1791",
    tagline: "Typed GraphQL schema design with FastAPI + Strawberry",
    year: "2025",
    category: "Backend · API",
    visibility: "public",
    status: "shipped",
    repoUrl: "https://github.com/Conradgabe/graphql-api-1791",
    mock: "graphql",
    summary:
      "A GraphQL API built with FastAPI and Strawberry, showcasing schema design, typed resolvers, and a clean, well-structured API surface.",
    problem:
      "REST endpoints sprawl as clients' data needs grow; a typed GraphQL schema gives clients exactly what they ask for with a single, self-documenting contract.",
    approach: [
      "Schema-first design with Strawberry's Python type system",
      "Typed resolvers wired into FastAPI",
      "Self-documenting, introspectable API surface",
    ],
    highlights: [
      "Schema-first GraphQL design",
      "Strawberry + FastAPI integration",
      "Typed, introspectable resolvers",
    ],
    stack: ["Python", "FastAPI", "Strawberry", "GraphQL"],
    role: "Design & build (solo)",
  },
];

/** Terminal command registry — every command also maps to a clickable nav target. */
export type Command = {
  cmd: string;
  label: string;
  description: string;
  href: string;
  group: "navigate" | "social" | "action";
};

export const commands: Command[] = [
  { cmd: "whoami", label: "Home", description: "Who I am", href: "/#top", group: "navigate" },
  { cmd: "cat about.md", label: "About", description: "Background & focus", href: "/#about", group: "navigate" },
  { cmd: "ls projects/", label: "Projects", description: "Featured work", href: "/#projects", group: "navigate" },
  { cmd: "ls posts/", label: "Writing", description: "Articles on Medium", href: "/#writing", group: "navigate" },
  { cmd: "git log", label: "GitHub activity", description: "Contributions & repos", href: "/#github", group: "navigate" },
  { cmd: "cat resume.pdf", label: "Résumé", description: "Download CV", href: "/resume", group: "navigate" },
  { cmd: "mail", label: "Contact", description: "Get in touch", href: "/#contact", group: "action" },
];
