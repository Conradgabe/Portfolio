"use client";

import { useMemo, useState } from "react";
import type {
  OpenApiOperation,
  OpenApiParameter,
  OpenApiRef,
  OpenApiSchema,
  OpenApiSpec,
} from "@/lib/specs";

const METHOD_ORDER = ["get", "post", "put", "patch", "delete"];

function isRef(s: unknown): s is OpenApiRef {
  return !!s && typeof s === "object" && "$ref" in (s as object);
}

function refName(ref: string): string {
  return ref.split("/").pop() ?? ref;
}

/** Resolve a $ref against components.schemas; returns the schema (one level). */
function resolve(spec: OpenApiSpec, s?: OpenApiSchema | OpenApiRef): OpenApiSchema | undefined {
  if (!s) return undefined;
  if (isRef(s)) return spec.components?.schemas?.[refName(s.$ref)];
  return s;
}

function memberLabel(m: OpenApiSchema | OpenApiRef): string {
  return isRef(m) ? refName(m.$ref) : typeLabel(m);
}

/** Human label for a property/param type, including nullable + arrays + refs + composites. */
function typeLabel(s?: OpenApiSchema | OpenApiRef): string {
  if (!s) return "any";
  if (isRef(s)) return refName(s.$ref);
  const union = s.anyOf ?? s.oneOf;
  if (union) {
    const parts = union.map(memberLabel);
    const nonNull = parts.filter((p) => p !== "null");
    const nullable = parts.includes("null");
    return (nonNull.length ? nonNull.join(" | ") : "any") + (nullable ? " | null" : "");
  }
  if (s.allOf) return s.allOf.map(memberLabel).join(" & ");
  if (Array.isArray(s.type)) {
    const nonNull = s.type.filter((t) => t !== "null");
    return nonNull.join(" | ") + (s.type.includes("null") ? " | null" : "");
  }
  if (s.type === "array") {
    const item = s.items;
    return `${isRef(item) ? refName(item.$ref) : item?.type ?? "any"}[]`;
  }
  if (s.$ref) return refName(s.$ref);
  return (s.type as string) ?? "object";
}

/** A small rotating disclosure caret rendered in the terminal style. */
function Caret({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden
      className={`inline-block font-mono text-[11px] text-faint transition-transform duration-200 ${
        open ? "rotate-90" : ""
      }`}
    >
      ▸
    </span>
  );
}

function MethodTag({ method }: { method: string }) {
  return (
    <span className="inline-flex w-[52px] shrink-0 items-center justify-center border border-line px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-ink">
      {method}
    </span>
  );
}

function PropertyRow({
  name,
  schema,
  required,
}: {
  name: string;
  schema: OpenApiSchema | OpenApiRef;
  required: boolean;
}) {
  const flags: string[] = [];
  if (required) flags.push("required");
  if (!isRef(schema)) {
    if (schema.default !== undefined) flags.push(`default: ${JSON.stringify(schema.default)}`);
    if (schema.minimum !== undefined || schema.maximum !== undefined) {
      flags.push(`${schema.minimum ?? "−∞"}..${schema.maximum ?? "∞"}`);
    }
    if (schema.pattern) flags.push(`/${schema.pattern}/`);
  }
  const enums = !isRef(schema) ? schema.enum : undefined;
  const desc = !isRef(schema) ? schema.description : undefined;
  return (
    <div className="border-t border-line px-4 py-2.5 first:border-t-0">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <code className="font-mono text-[12px] text-ink">{name}</code>
        <span className="font-mono text-[11px] text-accent-ink">{typeLabel(schema)}</span>
        {flags.map((f) => (
          <span key={f} className="border border-line px-1 py-0.5 font-mono text-[10px] text-faint">
            {f}
          </span>
        ))}
      </div>
      {enums && (
        <p className="mt-1 font-mono text-[10.5px] text-faint">
          enum: {enums.map((e) => JSON.stringify(e)).join(" · ")}
        </p>
      )}
      {desc && <p className="mt-1 font-sans text-[12.5px] leading-relaxed text-muted">{desc}</p>}
    </div>
  );
}

function SchemaProperties({ schema }: { schema?: OpenApiSchema }) {
  if (!schema?.properties) return null;
  const requiredSet = new Set(schema.required ?? []);
  return (
    <div className="border border-line">
      {Object.entries(schema.properties).map(([name, prop]) => (
        <PropertyRow key={name} name={name} schema={prop} required={requiredSet.has(name)} />
      ))}
    </div>
  );
}

type Entry = { method: string; path: string; op: OpenApiOperation; key: string };

/** A single collapsible operation row (Swagger-style), styled as terminal output. */
function Operation({
  spec,
  entry,
  open,
  onToggle,
}: {
  spec: OpenApiSpec;
  entry: Entry;
  open: boolean;
  onToggle: () => void;
}) {
  const { method, path, op } = entry;
  const params = op.parameters ?? [];
  const pathParams = params.filter((p) => p.in === "path");
  const queryParams = params.filter((p) => p.in === "query");

  // Request body: prefer JSON, fall back to multipart.
  const content = op.requestBody?.content ?? {};
  const bodyMedia = content["application/json"] ?? content["multipart/form-data"];
  const bodyContentType = content["application/json"]
    ? "application/json"
    : content["multipart/form-data"]
      ? "multipart/form-data"
      : null;
  const bodySchema = resolve(spec, bodyMedia?.schema);

  const okSchema = op.responses?.["200"]?.content?.["application/json"]?.schema;
  const okLabel = okSchema ? typeLabel(okSchema) : null;

  return (
    <section className="border border-line">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full flex-wrap items-center gap-3 bg-surface px-4 py-3 text-left transition-colors hover:bg-surface-2"
      >
        <Caret open={open} />
        <MethodTag method={method} />
        <code className="font-mono text-[12.5px] text-ink">{path}</code>
        {op.summary && (
          <span className="hidden truncate font-sans text-[12.5px] text-muted sm:inline">
            {op.summary}
          </span>
        )}
        {op.requestBody?.required && (
          <span className="font-mono text-[10px] uppercase tracking-wider text-faint">body</span>
        )}
        {okLabel && <span className="ml-auto font-mono text-[10.5px] text-faint">→ {okLabel}</span>}
      </button>

      {open && (
        <div className="border-t border-line px-4 py-4">
          {op.summary && <p className="font-sans text-[14.5px] text-ink sm:hidden">{op.summary}</p>}
          {op.description && (
            <p className="mt-2 max-w-2xl whitespace-pre-line font-sans text-[13px] leading-relaxed text-muted">
              {op.description}
            </p>
          )}

          {(pathParams.length > 0 || queryParams.length > 0) && (
            <div className="mt-4">
              <h4 className="mb-2 font-mono text-[10.5px] uppercase tracking-wider text-muted">
                Parameters
              </h4>
              <div className="border border-line">
                {[...pathParams, ...queryParams].map((p: OpenApiParameter) => (
                  <PropertyRow
                    key={`${p.in}:${p.name}`}
                    name={`${p.name}  (${p.in})`}
                    schema={{ ...(resolve(spec, p.schema) ?? {}), description: p.description }}
                    required={!!p.required}
                  />
                ))}
              </div>
            </div>
          )}

          {bodySchema && (
            <div className="mt-4">
              <h4 className="mb-2 font-mono text-[10.5px] uppercase tracking-wider text-muted">
                Request body · {bodyContentType}
              </h4>
              <SchemaProperties schema={bodySchema} />
            </div>
          )}

          {op.responses && (
            <div className="mt-4">
              <h4 className="mb-2 font-mono text-[10.5px] uppercase tracking-wider text-muted">
                Responses
              </h4>
              <ul className="space-y-1">
                {Object.entries(op.responses).map(([code, res]) => {
                  const schema = res.content?.["application/json"]?.schema;
                  return (
                    <li key={code} className="font-mono text-[11.5px] text-muted">
                      <span className="text-accent-ink">{code}</span> · {res.description}
                      {schema && <span className="text-faint"> → {typeLabel(schema)}</span>}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

/** A single collapsible schema (model) row for the Schemas panel. */
function SchemaRow({
  name,
  schema,
  open,
  onToggle,
}: {
  name: string;
  schema: OpenApiSchema;
  open: boolean;
  onToggle: () => void;
}) {
  const hasProps = !!schema.properties;
  return (
    <section className="border border-line">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-3 bg-surface px-4 py-2.5 text-left transition-colors hover:bg-surface-2"
      >
        <Caret open={open} />
        <code className="font-mono text-[12.5px] text-ink">{name}</code>
        <span className="ml-auto font-mono text-[10.5px] text-faint">{typeLabel(schema)}</span>
      </button>
      {open && (
        <div className="border-t border-line px-4 py-3">
          {schema.description && (
            <p className="mb-3 max-w-2xl font-sans text-[12.5px] leading-relaxed text-muted">
              {schema.description}
            </p>
          )}
          {hasProps ? (
            <SchemaProperties schema={schema} />
          ) : schema.enum ? (
            <p className="font-mono text-[11px] text-faint">
              enum: {schema.enum.map((e) => JSON.stringify(e)).join(" · ")}
            </p>
          ) : (
            <p className="font-mono text-[11px] text-faint">{typeLabel(schema)}</p>
          )}
        </div>
      )}
    </section>
  );
}

/** Renders a real OpenAPI document in the site's terminal style: filterable, collapsible, grouped by tag. */
export function OpenApiView({ spec }: { spec: OpenApiSpec }) {
  const [query, setQuery] = useState("");
  const [openOps, setOpenOps] = useState<Set<string>>(new Set());
  const [openSchemas, setOpenSchemas] = useState<Set<string>>(new Set());

  // Collect operations grouped by their first tag, preserving first-seen order.
  const groups = useMemo(() => {
    const list: { tag: string; ops: Entry[] }[] = [];
    const byTag = new Map<string, Entry[]>();
    for (const [path, methods] of Object.entries(spec.paths)) {
      for (const method of METHOD_ORDER) {
        const op = methods[method];
        if (!op) continue;
        const tag = op.tags?.[0] ?? "default";
        if (!byTag.has(tag)) {
          const bucket: Entry[] = [];
          byTag.set(tag, bucket);
          list.push({ tag, ops: bucket });
        }
        byTag.get(tag)!.push({ method, path, op, key: `${method} ${path}` });
      }
    }
    return list;
  }, [spec]);

  const tagDesc = useMemo(
    () => new Map((spec.tags ?? []).map((t) => [t.name, t.description])),
    [spec],
  );

  const schemas = useMemo(
    () => Object.entries(spec.components?.schemas ?? {}),
    [spec],
  );

  // Filter operations by path / method / summary / tag.
  const q = query.trim().toLowerCase();
  const filteredGroups = useMemo(() => {
    if (!q) return groups;
    return groups
      .map((g) => ({
        tag: g.tag,
        ops: g.ops.filter(
          (e) =>
            e.path.toLowerCase().includes(q) ||
            e.method.includes(q) ||
            e.op.summary?.toLowerCase().includes(q) ||
            g.tag.toLowerCase().includes(q),
        ),
      }))
      .filter((g) => g.ops.length > 0);
  }, [groups, q]);

  const visibleKeys = useMemo(
    () => filteredGroups.flatMap((g) => g.ops.map((e) => e.key)),
    [filteredGroups],
  );

  const toggleOp = (key: string) =>
    setOpenOps((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const toggleSchema = (name: string) =>
    setOpenSchemas((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });

  const expandAll = () => setOpenOps(new Set(visibleKeys));
  const collapseAll = () => setOpenOps(new Set());

  return (
    <div className="space-y-10">
      {/* Toolbar: filter + expand/collapse all */}
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex flex-1 items-center gap-2 border border-line bg-bg px-3 py-1.5">
          <span className="shrink-0 whitespace-nowrap font-mono text-[12px] text-accent-ink">$ grep</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="filter endpoints…"
            className="w-full bg-transparent font-mono text-[12.5px] text-ink placeholder:text-faint focus:outline-none"
            aria-label="Filter endpoints"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="font-mono text-[11px] text-faint hover:text-ink"
              aria-label="Clear filter"
            >
              clear
            </button>
          )}
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={expandAll}
            className="border border-line px-3 py-1.5 font-mono text-[12px] text-muted transition-colors hover:border-line-strong hover:text-ink"
          >
            expand all
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="border border-line px-3 py-1.5 font-mono text-[12px] text-muted transition-colors hover:border-line-strong hover:text-ink"
          >
            collapse all
          </button>
        </div>
      </div>

      {filteredGroups.length === 0 ? (
        <p className="border border-dashed border-line px-4 py-8 text-center font-mono text-[12.5px] text-faint">
          no endpoints match “{query}”
        </p>
      ) : (
        filteredGroups.map((group) => (
          <section key={group.tag}>
            <div className="mb-4 flex items-baseline gap-3 border-b border-line pb-2">
              <h3 className="font-mono text-sm uppercase tracking-wider text-ink">{group.tag}</h3>
              <span className="font-mono text-[11px] text-faint">{group.ops.length}</span>
              {tagDesc.get(group.tag) && (
                <span className="font-sans text-[12.5px] text-muted">{tagDesc.get(group.tag)}</span>
              )}
            </div>
            <div className="space-y-2">
              {group.ops.map((entry) => (
                <Operation
                  key={entry.key}
                  spec={spec}
                  entry={entry}
                  open={openOps.has(entry.key)}
                  onToggle={() => toggleOp(entry.key)}
                />
              ))}
            </div>
          </section>
        ))
      )}

      {/* Schemas panel — like Swagger's models section */}
      {schemas.length > 0 && (
        <section>
          <div className="mb-4 flex items-baseline gap-3 border-b border-line pb-2">
            <h3 className="font-mono text-sm text-ink">
              <span className="text-accent-ink">$</span> cat schemas/
            </h3>
            <span className="font-mono text-[11px] text-faint">{schemas.length}</span>
          </div>
          <div className="space-y-2">
            {schemas.map(([name, schema]) => (
              <SchemaRow
                key={name}
                name={name}
                schema={schema}
                open={openSchemas.has(name)}
                onToggle={() => toggleSchema(name)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
