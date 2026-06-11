import { cn } from "@/lib/utils";
import type { Project } from "@/lib/site";

const LABELS: Record<Project["mock"], string> = {
  clipn: "clipn · render queue",
  quant: "backtest · equity curve",
  tailor: "pg-tailor · tailor view",
  saas: "architecture · multi-tenant",
  graphql: "playground · query · response",
};

/**
 * Stylized, monochrome "mock UI" for each project: a placeholder until
 * Gabriel supplies real screenshots. Pure CSS/SVG, on-brand silver-phosphor.
 */
export function ProjectMock({
  type,
  className,
}: {
  type: Project["mock"];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative aspect-[16/10] w-full select-none overflow-hidden border border-line bg-surface",
        className,
      )}
      aria-hidden
    >
      <div className="flex items-center gap-1.5 border-b border-line px-3 py-2">
        <span className="h-2 w-2 rounded-full border border-line-strong" />
        <span className="h-2 w-2 rounded-full border border-line-strong" />
        <span className="h-2 w-2 rounded-full border border-line-strong" />
        <span className="ml-2 truncate font-mono text-[10px] text-faint">{LABELS[type]}</span>
      </div>
      <div className="h-[calc(100%-33px)] p-4">{renderContent(type)}</div>
    </div>
  );
}

function renderContent(type: Project["mock"]) {
  switch (type) {
    case "clipn":
      return <ClipnMock />;
    case "quant":
      return <QuantMock />;
    case "tailor":
      return <TailorMock />;
    case "saas":
      return <SaasMock />;
    case "graphql":
      return <GraphqlMock />;
  }
}

function ClipnMock() {
  return (
    <div className="flex h-full gap-3">
      <div className="relative flex-1 border border-line bg-bg/40">
        {/* 9:16 crop guide */}
        <div className="absolute inset-y-2 left-1/2 w-[34%] -translate-x-1/2 border border-dashed border-accent/50" />
        <div className="absolute bottom-2 left-1/2 w-[34%] -translate-x-1/2">
          <div className="mx-auto h-2 w-4/5 bg-accent/40" />
          <div className="mx-auto mt-1 h-2 w-3/5 bg-accent/25" />
        </div>
        {/* waveform */}
        <div className="absolute inset-x-2 top-2 flex h-4 items-end gap-[2px]">
          {[3, 7, 5, 9, 4, 8, 6, 10, 5, 7, 3, 8, 6, 4, 9, 5].map((h, i) => (
            <span key={i} className="flex-1 bg-accent-ink/40" style={{ height: `${h * 10}%` }} />
          ))}
        </div>
      </div>
      <div className="flex w-[34%] flex-col gap-2">
        {["clip_01", "clip_02", "clip_03"].map((c, i) => (
          <div key={c} className="border border-line p-1.5">
            <div className="h-6 bg-line" />
            <div className="mt-1 flex items-center justify-between font-mono text-[8px] text-faint">
              <span>{c}</span>
              <span className="text-accent-ink">{i === 0 ? "✓" : "···"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuantMock() {
  return (
    <div className="flex h-full flex-col">
      <svg viewBox="0 0 200 70" preserveAspectRatio="none" className="h-[64%] w-full">
        <line x1="0" y1="69" x2="200" y2="69" stroke="var(--line)" />
        <line x1="0" y1="35" x2="200" y2="35" stroke="var(--line)" strokeDasharray="2 3" />
        <polyline
          points="0,60 18,58 34,62 52,50 70,52 88,42 104,44 122,30 140,34 158,22 176,18 200,8"
          fill="none"
          stroke="var(--accent-ink)"
          strokeWidth="1.5"
        />
      </svg>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {["Sharpe", "Sortino", "Max DD"].map((m) => (
          <div key={m} className="border border-line p-1.5">
            <div className="font-mono text-[8px] uppercase tracking-wider text-faint">{m}</div>
            <div className="mt-1 h-1.5 w-full bg-line">
              <div className="h-full bg-accent-ink/60" style={{ width: m === "Max DD" ? "32%" : "72%" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TailorMock() {
  return (
    <div className="flex h-full gap-3 font-mono text-[8px]">
      <div className="flex-1 space-y-1.5 border border-line p-2">
        <div className="h-2 w-1/2 bg-ink/70" />
        <div className="h-1.5 w-full bg-line" />
        <div className="h-1.5 w-full bg-accent/40" />
        <div className="h-1.5 w-5/6 bg-accent/40" />
        <div className="h-1.5 w-full bg-line" />
        <div className="h-1.5 w-2/3 bg-accent/40" />
        <div className="mt-2 text-accent-ink">tailored ✓</div>
      </div>
      <div className="w-[40%] space-y-2">
        <div className="border border-line p-2">
          <div className="text-faint">JOB</div>
          <div className="mt-1 h-1.5 w-full bg-line" />
          <div className="mt-1 h-1.5 w-3/4 bg-line" />
          <div className="mt-2 flex items-center gap-1 text-accent-ink">
            <span className="h-1.5 flex-1 bg-accent-ink/50" />
            <span>match</span>
          </div>
        </div>
        <div className="border border-line p-2 text-faint">
          <div>· applied</div>
          <div className="text-accent-ink">· tailored</div>
        </div>
      </div>
    </div>
  );
}

function SaasMock() {
  return (
    <div className="flex h-full flex-col gap-2 font-mono text-[8px] text-muted">
      <div className="grid flex-1 grid-cols-[1fr_auto_1.15fr_auto_1fr] items-center gap-1.5">
        <div className="space-y-1">
          <div className="text-[7px] uppercase tracking-wider text-faint">tenants</div>
          <Box>acme · JWT</Box>
          <Box>globex · JWT</Box>
          <Box>initech · JWT</Box>
        </div>
        <Arrow />
        <div className="space-y-1.5">
          <div className="border border-accent/40 bg-accent/5 p-1.5 text-center text-accent-ink">
            API Gateway
            <div className="mt-0.5 text-[7px] text-faint">auth · RBAC · rate-limit</div>
          </div>
          <div className="border border-line p-1.5 text-center">
            FastAPI
            <div className="mt-0.5 text-[7px] text-faint">tenant context · async</div>
          </div>
        </div>
        <Arrow />
        <div className="space-y-1">
          <div className="text-[7px] uppercase tracking-wider text-faint">schema-per-tenant</div>
          <Store>db · acme</Store>
          <Store>db · globex</Store>
          <Store>db · initech</Store>
        </div>
      </div>
      <div className="flex items-center gap-2 border border-line bg-bg/30 px-2 py-1 text-[7px] text-faint">
        <span className="text-accent-ink">events</span>
        <span>→ queue</span>
        <span className="flex-1 border-t border-dashed border-line-strong/60" />
        <span>retry · backoff</span>
        <span className="text-line-strong">→</span>
        <span className="text-muted">webhooks</span>
      </div>
    </div>
  );
}

function Box({ children }: { children: React.ReactNode }) {
  return <div className="border border-line px-1.5 py-1 text-center">{children}</div>;
}

function Store({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden border border-line py-1 pl-2.5 pr-1.5 text-center">
      <span className="absolute inset-y-0 left-0 w-1 bg-accent-ink/30" />
      {children}
    </div>
  );
}

function Arrow() {
  return <div className="text-center text-line-strong">→</div>;
}

function GraphqlMock() {
  return (
    <div className="flex h-full flex-col font-mono text-[8px] leading-[1.55]">
      <div className="flex items-center gap-2 border-b border-line pb-1.5 text-[7px] uppercase tracking-wider text-faint">
        <span className="text-accent-ink">query</span>
        <span>variables</span>
        <span className="ml-auto flex items-center gap-1 normal-case tracking-normal">
          <span className="h-1 w-1 rounded-full bg-accent-ink" /> 200 · 14ms
        </span>
      </div>
      <div className="grid flex-1 grid-cols-2 gap-3 pt-2">
        <pre className="overflow-hidden whitespace-pre text-muted">
          <span className="text-accent-ink">query</span> {"{"}
          {"\n  "}user(id: <span className="text-ink">42</span>) {"{"}
          {"\n    "}id
          {"\n    "}name
          {"\n    "}repos {"{"}
          {"\n      "}name
          {"\n      "}stars
          {"\n    "}{"}"}
          {"\n  "}{"}"}
          {"\n"}{"}"}
        </pre>
        <pre className="overflow-hidden whitespace-pre border-l border-line pl-3 text-faint">
          {"{"}
          {"\n  "}<span className="text-muted">&quot;data&quot;</span>: {"{"}
          {"\n    "}<span className="text-muted">&quot;user&quot;</span>: {"{"}
          {"\n      "}<span className="text-muted">&quot;id&quot;</span>: <span className="text-ink">42</span>,
          {"\n      "}<span className="text-muted">&quot;name&quot;</span>: <span className="text-accent-ink">&quot;gabriel&quot;</span>,
          {"\n      "}<span className="text-muted">&quot;repos&quot;</span>: <span className="text-faint">[ … ]</span>
          {"\n    "}{"}"}
          {"\n  "}{"}"}
          {"\n"}{"}"}
        </pre>
      </div>
      <div className="mt-2 flex items-center gap-2 border-t border-line pt-1.5 text-[7px] text-faint">
        <span className="text-accent-ink">schema</span>
        <span>type User {"{"} id · name · repos: [Repo!]! {"}"}</span>
        <span className="ml-auto">strawberry · introspectable</span>
      </div>
    </div>
  );
}
