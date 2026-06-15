/**
 * API documentation, grounded in real source.
 *
 *  - graphql-api  : derived verbatim from the published Strawberry types, resolvers,
 *                   and the repo's own examples/ files (github.com/Conradgabe/graphql-api-1791).
 *  - b2b-saas     : the public repo is the architecture & data layer (no public HTTP routes),
 *                   so it is documented honestly as a multi-tenant schema reference, not invented endpoints.
 *  - clipn / quant-platform / pg-tailor : private FastAPI services. Each auto-generates an
 *                   OpenAPI 3.1 spec; the real reference drops in once Gabriel exports /openapi.json.
 *
 * Nothing here is fabricated. Pending entries say so plainly.
 */

export type ApiTag =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "QUERY"
  | "MUTATION"
  | "TYPE"
  | "TABLE";

export type ApiOperation = {
  tag: ApiTag;
  name: string;
  summary: string;
  /** Mono detail lines: columns, arguments, or return shape. */
  fields?: string[];
};

export type ApiGroup = {
  title: string;
  caption?: string;
  operations: ApiOperation[];
};

export type ApiExample = {
  label: string;
  lang: "graphql" | "json" | "bash" | "python";
  code: string;
  responseLang?: "json" | "graphql";
  response?: string;
};

export type ApiSpecLink =
  | { type: "page"; href: string; label: string }
  | { type: "openapi"; href: string; label: string }
  | { type: "source"; href: string; label: string };

export type ApiDoc = {
  slug: string;
  kind: "graphql" | "rest" | "schema" | "pending";
  /** One-line transport summary shown as a chip row. */
  protocol: string;
  endpoint?: string;
  auth: string;
  /** Honest framing sentence(s) for the section intro. */
  intro: string;
  groups: ApiGroup[];
  examples?: ApiExample[];
  spec?: ApiSpecLink;
  /** Set only when kind === "pending". */
  pending?: { note: string };
  /** Optional caveat rendered in faint mono under the intro. */
  note?: string;
};

export const apiDocs: Record<string, ApiDoc> = {
  "graphql-api": {
    slug: "graphql-api",
    kind: "graphql",
    protocol: "GraphQL over HTTP · Strawberry + FastAPI",
    endpoint: "POST /graphql",
    auth: "None · public demo schema",
    intro:
      "A schema-first GraphQL API: typed Strawberry types, resolver composition into a single Query/Mutation root, and DataLoader batching to kill N+1 queries. Everything below is taken straight from the published source.",
    note: "Argument names shown from the resolver source; the live GraphQL Playground at /graphql is the canonical schema.",
    groups: [
      {
        title: "Types",
        operations: [
          {
            tag: "TYPE",
            name: "UserType",
            summary: "A user, and the author of a post.",
            fields: ["id: Int!", "name: String!", "email: String!"],
          },
          {
            tag: "TYPE",
            name: "PostType",
            summary: "A post with its nested author.",
            fields: ["id: Int!", "title: String!", "content: String!", "author: UserType!"],
          },
        ],
      },
      {
        title: "Queries",
        operations: [
          { tag: "QUERY", name: "users", summary: "List all users.", fields: ["users: [UserType!]!"] },
          { tag: "QUERY", name: "posts", summary: "List all posts with authors.", fields: ["posts: [PostType!]!"] },
          {
            tag: "QUERY",
            name: "post",
            summary: "Fetch a single post by id (raises if missing).",
            fields: ["post(post_id: Int!): PostType!"],
          },
        ],
      },
      {
        title: "Mutations",
        operations: [
          {
            tag: "MUTATION",
            name: "createUser",
            summary: "Create a user; rejects a duplicate email.",
            fields: ["createUser(name: String!, email: String!): UserType!"],
          },
          {
            tag: "MUTATION",
            name: "createPost",
            summary: "Create a post for an existing author.",
            fields: ["createPost(title: String!, content: String!, author_id: Int!): PostType!"],
          },
          {
            tag: "MUTATION",
            name: "updatePost",
            summary: "Patch a post's title and/or content.",
            fields: ["updatePost(post_id: Int!, title: String, content: String): PostType!"],
          },
          {
            tag: "MUTATION",
            name: "deletePost",
            summary: "Delete a post by id.",
            fields: ["deletePost(post_id: Int!): Boolean!"],
          },
        ],
      },
    ],
    examples: [
      {
        label: "query GetAllPosts",
        lang: "graphql",
        code: `query GetAllPosts {
  posts {
    id
    title
    content
    author {
      id
      name
    }
  }
}`,
        responseLang: "json",
        response: `{
  "data": {
    "posts": [
      {
        "id": 1,
        "title": "GraphQL Rocks",
        "content": "Really loving this",
        "author": { "id": 1, "name": "Jane Doe" }
      }
    ]
  }
}`,
      },
      {
        label: "mutation createPost",
        lang: "graphql",
        code: `mutation {
  createPost(title: "GraphQL Rocks", content: "Really loving this", authorId: 1) {
    id
    title
    author { name }
  }
}`,
      },
    ],
    spec: { type: "page", href: "/projects/graphql-api/api", label: "view full schema" },
  },

  "b2b-saas": {
    slug: "b2b-saas",
    kind: "schema",
    protocol: "PostgreSQL · schema-per-tenant · SQLAlchemy 2.0 async",
    auth: "RBAC roles · admin · staff · member",
    intro:
      "The public repo is this platform's backend architecture and data layer — the multi-tenant schema below, with the HTTP surface kept in a private deployment. Tenant isolation, RBAC, audit logging, idempotent webhooks, and integration health are designed in from day one.",
    note: "Tables reproduced from the repo's SQLAlchemy ORM models; relationships shown as foreign keys.",
    groups: [
      {
        title: "Identity & tenancy",
        operations: [
          {
            tag: "TABLE",
            name: "tenants",
            summary: "An isolated customer org, mapped to its own DB schema.",
            fields: [
              "id: UUID",
              "company_name: str · unique",
              "schema_name: str · unique",
              "subscription_status: trial | active | cancelled",
            ],
          },
          {
            tag: "TABLE",
            name: "users",
            summary: "A global user identity.",
            fields: ["id: UUID", "email: str · unique", "password: str · hashed", "is_active: bool", "last_login: datetime?"],
          },
          {
            tag: "TABLE",
            name: "user_tenants",
            summary: "Binds a user to a tenant with a role (RBAC).",
            fields: ["user_id → users.id", "tenant_id → tenants.id", "role: admin | staff | member"],
          },
        ],
      },
      {
        title: "Reliability & integrations",
        operations: [
          {
            tag: "TABLE",
            name: "audit_logs",
            summary: "Immutable record of every create / update / delete.",
            fields: ["tenant_id, user_id", "action · table_name · record_id", "payload: JSON"],
          },
          {
            tag: "TABLE",
            name: "idempotency_keys",
            summary: "De-dupes webhooks and external calls so retries are safe.",
            fields: ["key: str · unique", "tenant_id → tenants.id"],
          },
          {
            tag: "TABLE",
            name: "integration_status",
            summary: "Per-tenant health of each third-party integration.",
            fields: ["service_name: str", "last_success / last_failure: datetime", "failure_count: int"],
          },
        ],
      },
      {
        title: "Client workflows · tenant schema",
        operations: [
          {
            tag: "TABLE",
            name: "clients",
            summary: "A tenant's own end customer.",
            fields: ["id: UUID", "name, email · unique", "phone?, address?", "is_active: bool"],
          },
          {
            tag: "TABLE",
            name: "workflows · workflow_steps",
            summary: "Named, ordered steps a client moves through.",
            fields: ["workflow → steps (ordered)", "step_name · step_order"],
          },
          {
            tag: "TABLE",
            name: "clients_workflow_progress",
            summary: "Tracks where each client is in a workflow.",
            fields: ["client_id, workflow_id", "current_step: int", "is_completed: bool"],
          },
          {
            tag: "TABLE",
            name: "communications",
            summary: "Logged client touchpoints (email / call / meeting).",
            fields: ["event_type, status", "external_message_id?"],
          },
        ],
      },
    ],
    spec: {
      type: "source",
      href: "https://github.com/Conradgabe/B2B-SaaS-Platoform",
      label: "view source on GitHub",
    },
  },

  clipn: {
    slug: "clipn",
    kind: "rest",
    protocol: "REST · OpenAPI 3.1 · FastAPI",
    endpoint: "/api/v1",
    auth: "Bearer session token · scoped API keys · SSE via ?token=",
    intro:
      "ClipN's API turns long-form video into ready-to-post shorts and runs a multi-tenant clip studio on top: upload or ingest a URL, stream clips over SSE as they render, spin up stylistic variants, manage per-client brand kits, and ship a magic-link client review portal. 80+ endpoints across 15 capability areas; a few highlights below.",
    note: "Rendering is offloaded to a HyperFrames sidecar (documented on the full-spec page). Full, $ref-resolved reference at the link below.",
    groups: [
      {
        title: "Videos & clips",
        operations: [
          { tag: "POST", name: "/api/v1/videos", summary: "Upload a video (multipart); optional client scoping." },
          { tag: "POST", name: "/api/v1/ingest/url", summary: "Submit a YouTube/Twitch URL for download + processing." },
          { tag: "POST", name: "/api/v1/videos/{id}/generate", summary: "Trigger AI clip generation (count, duration, vertical, hooks)." },
          { tag: "GET", name: "/api/v1/videos/{id}/clips/stream", summary: "SSE: clips pushed to the UI as each finishes rendering." },
          { tag: "POST", name: "/api/v1/clips/{id}/variants", summary: "N stylistic variants (caption × reframe × hook), no re-transcribe." },
          { tag: "GET", name: "/api/v1/clips/{id}/download", summary: "Download in 9:16 / 16:9 / 1:1 / 4:5 (FFmpeg, cached)." },
        ],
      },
      {
        title: "Studio: clients, portal & brand",
        operations: [
          { tag: "POST", name: "/api/v1/clients/{id}/invite", summary: "Email a magic-link token (shown once) to a client." },
          { tag: "POST", name: "/api/v1/portal/clips/{id}/review", summary: "Client approves / rejects / requests revision (append-only log)." },
          { tag: "PUT", name: "/api/v1/brand", summary: "Per-client brand kit: colors, watermark, intro/outro, avatar." },
          { tag: "POST", name: "/api/v1/brand/apply-to-existing", summary: "Queue a scoped rebrand of every ready clip; never cross-applies." },
        ],
      },
      {
        title: "Pipeline, social & platform",
        operations: [
          { tag: "GET", name: "/api/v1/operations/stream", summary: "SSE: background job status (queued/running/failed/retrying)." },
          { tag: "POST", name: "/api/v1/clips/{id}/publish", summary: "Publish a clip to a connected social platform." },
          { tag: "POST", name: "/api/v1/ingestion/sources", summary: "Auto-poll a YouTube channel and clip new uploads." },
          { tag: "POST", name: "/api/v1/api-keys", summary: "Mint a rate-limited API key (per-hour quota)." },
          { tag: "POST", name: "/api/v1/auth/signin", summary: "Beta-code sign-in → session token." },
        ],
      },
    ],
    examples: [
      {
        label: "sign in → ingest → stream clips",
        lang: "bash",
        code: `# 1 · sign in (beta) → session token
curl -X POST $API/api/v1/auth/signin -H 'Content-Type: application/json' \\
  -d '{"email":"you@studio.com","beta_code":"..."}'

# 2 · ingest a YouTube URL
curl -X POST $API/api/v1/ingest/url -H "Authorization: Bearer $TOKEN" \\
  -H 'Content-Type: application/json' -d '{"url":"https://youtu.be/..."}'

# 3 · stream clips as they render (SSE; EventSource can't set headers)
curl -N "$API/api/v1/videos/$VIDEO/clips/stream?token=$TOKEN"`,
        responseLang: "json",
        response: `// POST /api/v1/auth/signin → 200
{
  "token": "sess_…",
  "user_id": "…",
  "email": "you@studio.com",
  "expires_at": "2026-07-01T00:00:00Z"
}`,
      },
    ],
    spec: { type: "page", href: "/projects/clipn/api", label: "view full OpenAPI spec" },
  },

  "quant-platform": {
    slug: "quant-platform",
    kind: "rest",
    protocol: "REST · OpenAPI 3.1 · FastAPI",
    endpoint: "/api/v1",
    auth: "none declared (v1)",
    intro:
      "Algome runs systematic backtesting end-to-end: define a multi-file strategy, version and sandbox-validate its code, then enqueue worker-executed backtests over survivorship-bias-aware Forex data. Results come back with institutional metrics (Sharpe, Sortino, CAGR, drawdown, profit factor, VaR/CVaR, a confidence score), per-asset breakdowns, full trade logs, and paper portfolios.",
    note: "Code-first strategies are validated in a sandbox (syntax, forbidden imports, required BaseStrategy interface, security) before runs execute asynchronously on workers. v1 ships without an auth layer.",
    groups: [
      {
        title: "Strategies & validation",
        operations: [
          { tag: "POST", name: "/api/v1/strategies", summary: "Create a strategy across one or more asset classes." },
          { tag: "POST", name: "/api/v1/strategies/versions", summary: "New immutable, content-hashed version (multi-file)." },
          { tag: "POST", name: "/api/v1/strategies/versions/{id}/validate", summary: "Sandbox-validate: syntax, forbidden imports, BaseStrategy interface, security." },
          { tag: "GET", name: "/api/v1/strategies/templates/{id}", summary: "Starter templates: basic, advanced, wyckoff." },
        ],
      },
      {
        title: "Backtesting engine",
        operations: [
          { tag: "POST", name: "/api/v1/backtests", summary: "Enqueue an async, worker-executed backtest run." },
          { tag: "GET", name: "/api/v1/backtests/{id}/result", summary: "Sharpe, Sortino, CAGR, drawdown, profit factor, VaR/CVaR, confidence score." },
          { tag: "GET", name: "/api/v1/backtests/{id}/assets/{asset}", summary: "Per-asset metrics with equity + drawdown curves." },
          { tag: "GET", name: "/api/v1/backtests/{id}/trades", summary: "Every executed trade, paginated." },
        ],
      },
      {
        title: "Market data & portfolios",
        operations: [
          { tag: "GET", name: "/api/v1/market-data/data", summary: "OHLCV candles by symbol, timeframe, and date range." },
          { tag: "GET", name: "/api/v1/market-data/summary", summary: "Datasets, symbols, timeframes, and coverage." },
          { tag: "POST", name: "/api/v1/portfolios", summary: "Create a paper portfolio (default 100k balance)." },
          { tag: "POST", name: "/api/v1/portfolios/{id}/deposit", summary: "Deposit / withdraw paper funds." },
        ],
      },
    ],
    examples: [
      {
        label: "enqueue a backtest run",
        lang: "bash",
        code: `curl -X POST $API/api/v1/backtests \\
  -H 'Content-Type: application/json' \\
  -d '{
    "strategy_version_id": 12,
    "assets": ["EURUSD", "GBPUSD"],
    "timeframes": ["1H"],
    "start_date": "2020-01-01T00:00:00Z",
    "end_date": "2024-01-01T00:00:00Z"
  }'`,
        responseLang: "json",
        response: `// 201 Created — executed asynchronously by a worker
{
  "id": 87,
  "strategy_version_id": 12,
  "status": "pending",
  "engine_version": "1.0.0",
  "assets": ["EURUSD", "GBPUSD"],
  "job_id": "rq:job:…",
  "created_at": "2026-06-15T12:00:00Z"
}`,
      },
    ],
    spec: { type: "page", href: "/projects/quant-platform/api", label: "view full OpenAPI spec" },
  },

  "pg-tailor": {
    slug: "pg-tailor",
    kind: "rest",
    protocol: "REST · OpenAPI 3.1 · Next.js route handlers",
    endpoint: "/api",
    auth: "Cookie (auth-token) · 2 SSE streams",
    intro:
      "PG-Tailor's API parses a résumé, AI-tailors it to a job description (streamed token-by-token over SSE), and exports PDF/DOCX in seven templates. On top sits a cached SerpAPI job board, an Autopilot that scores every job against your profile with Gemini, history with status tracking, and a career chat grounded in a tailored résumé.",
    note: "Backend is Next.js App Router route handlers on the same origin as the UI; tailoring and the career chat stream Server-Sent Events. Everything but /api/auth/* sits behind a cookie gate.",
    groups: [
      {
        title: "Tailoring",
        operations: [
          { tag: "POST", name: "/api/parse-pg", summary: "Extract text from an uploaded PDF/DOCX résumé (≤10MB)." },
          { tag: "POST", name: "/api/tailor", summary: "SSE: stream a résumé tailored to a job description." },
          { tag: "POST", name: "/api/generate", summary: "Render tailored markdown to PDF/DOCX across 7 templates." },
        ],
      },
      {
        title: "Jobs board & autopilot",
        operations: [
          { tag: "GET", name: "/api/jobs", summary: "Search the cached job board (SerpAPI-backed, paginated)." },
          { tag: "POST", name: "/api/jobs/refresh", summary: "Pull fresh jobs from SerpAPI and archive stale ones." },
          { tag: "POST", name: "/api/autopilot/scan", summary: "Score every cached job vs your profile with Gemini (skips 24h)." },
          { tag: "GET", name: "/api/autopilot/results", summary: "Ranked matches, score-desc; results ≥70 count as matches." },
        ],
      },
      {
        title: "History, saved résumés & chat",
        operations: [
          { tag: "POST", name: "/api/records", summary: "Save a tailored résumé to history with application status." },
          { tag: "GET", name: "/api/saved-pgs", summary: "Stored master résumés, de-duped by name + length." },
          { tag: "POST", name: "/api/chats/{id}/messages", summary: "SSE: career assistant grounded in a tailored résumé." },
          { tag: "POST", name: "/api/auth/login", summary: "Cookie-based login gate (sets httpOnly auth-token)." },
        ],
      },
    ],
    examples: [
      {
        label: "stream a tailored résumé (SSE)",
        lang: "bash",
        code: `curl -N -X POST $API/api/tailor \\
  -H 'Content-Type: application/json' --cookie 'auth-token=…' \\
  -d '{"pgText":"<your résumé>","jobDescription":"<job description>"}'`,
        responseLang: "json",
        response: `data: {"type":"text","text":"## Gabriel Isuekebho\\n"}
data: {"type":"text","text":"- Backend & systems engineer…"}
data: {"type":"done"}`,
      },
    ],
    spec: { type: "page", href: "/projects/pg-tailor/api", label: "view full OpenAPI spec" },
  },
};

/** Full GraphQL SDL for the public schema, derived from the real Strawberry source. */
export const graphqlSdl = `type UserType {
  id: Int!
  name: String!
  email: String!
}

type PostType {
  id: Int!
  title: String!
  content: String!
  author: UserType!
}

type Query {
  users: [UserType!]!
  posts: [PostType!]!
  post(post_id: Int!): PostType!
}

type Mutation {
  createUser(name: String!, email: String!): UserType!
  createPost(title: String!, content: String!, author_id: Int!): PostType!
  updatePost(post_id: Int!, title: String, content: String): PostType!
  deletePost(post_id: Int!): Boolean!
}`;

/** The repo's own example operations, reproduced verbatim. */
export const graphqlExamples = {
  queries: `query GetAllPosts {
  posts {
    id
    title
    content
    author {
      id
      name
    }
  }
}

query GetAllUsers {
  users {
    id
    name
    email
  }
}

query GetPostById {
  post(post_id: 3) {
    id
    title
    content
    author {
      id
      name
    }
  }
}`,
  mutations: `mutation {
  createPost(title: "GraphQL Rocks", content: "Really loving this", authorId: 1) {
    id
    title
    author {
      name
    }
  }
}

mutation {
  createUser(name: "Jane Doe", email: "Doe@example.com") {
    id
    name
    email
  }
}

mutation {
  updatePost(id: 1, title: "GraphQL is Awesome", content: "Updated content") {
    id
    title
    content
    author {
      id
      name
      email
    }
  }
}

mutation {
  deletePost(post_id: 1)
}`,
};
