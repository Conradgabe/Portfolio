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

function Tag({ children, strong }: { children: React.ReactNode; strong?: boolean }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center border border-line px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
        strong ? "text-ink" : "text-faint"
      }`}
    >
      {children}
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

function SchemaProperties({ spec, schema }: { spec: OpenApiSpec; schema?: OpenApiSchema }) {
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

function Operation({
  spec,
  method,
  path,
  op,
}: {
  spec: OpenApiSpec;
  method: string;
  path: string;
  op: OpenApiOperation;
}) {
  const params = op.parameters ?? [];
  const pathParams = params.filter((p) => p.in === "path");
  const queryParams = params.filter((p) => p.in === "query");

  // Request body: prefer JSON, fall back to multipart.
  const content = op.requestBody?.content ?? {};
  const bodyMedia = content["application/json"] ?? content["multipart/form-data"];
  const bodyContentType = content["application/json"] ? "application/json" : content["multipart/form-data"] ? "multipart/form-data" : null;
  const bodySchema = resolve(spec, bodyMedia?.schema);

  const okSchema = op.responses?.["200"]?.content?.["application/json"]?.schema;
  const okLabel = okSchema ? typeLabel(okSchema) : null;

  return (
    <section className="border border-line">
      <header className="flex flex-wrap items-center gap-3 border-b border-line bg-surface px-4 py-3">
        <Tag strong>{method}</Tag>
        <code className="font-mono text-[12.5px] text-ink">{path}</code>
        {op.requestBody?.required && (
          <span className="font-mono text-[10px] uppercase tracking-wider text-faint">body required</span>
        )}
        {okLabel && <span className="ml-auto font-mono text-[10.5px] text-faint">→ {okLabel}</span>}
      </header>
      <div className="px-4 py-4">
        {op.summary && <p className="font-sans text-[14.5px] text-ink">{op.summary}</p>}
        {op.description && (
          <p className="mt-2 max-w-2xl whitespace-pre-line font-sans text-[13px] leading-relaxed text-muted">
            {op.description}
          </p>
        )}

        {(pathParams.length > 0 || queryParams.length > 0) && (
          <div className="mt-4">
            <h4 className="mb-2 font-mono text-[10.5px] uppercase tracking-wider text-muted">Parameters</h4>
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
            <SchemaProperties spec={spec} schema={bodySchema} />
          </div>
        )}

        {op.responses && (
          <div className="mt-4">
            <h4 className="mb-2 font-mono text-[10.5px] uppercase tracking-wider text-muted">Responses</h4>
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
    </section>
  );
}

/** Renders a real OpenAPI document in the site's terminal style, grouped by tag. */
export function OpenApiView({ spec }: { spec: OpenApiSpec }) {
  // Collect operations grouped by their first tag, preserving first-seen order.
  const groups: { tag: string; ops: { method: string; path: string; op: OpenApiOperation }[] }[] = [];
  const byTag = new Map<string, { method: string; path: string; op: OpenApiOperation }[]>();

  for (const [path, methods] of Object.entries(spec.paths)) {
    for (const method of METHOD_ORDER) {
      const op = methods[method];
      if (!op) continue;
      const tag = op.tags?.[0] ?? "default";
      if (!byTag.has(tag)) {
        const bucket: { method: string; path: string; op: OpenApiOperation }[] = [];
        byTag.set(tag, bucket);
        groups.push({ tag, ops: bucket });
      }
      byTag.get(tag)!.push({ method, path, op });
    }
  }

  const tagDesc = new Map((spec.tags ?? []).map((t) => [t.name, t.description]));

  return (
    <div className="space-y-12">
      {groups.map((group) => (
        <section key={group.tag}>
          <div className="mb-4 flex items-baseline gap-3 border-b border-line pb-2">
            <h3 className="font-mono text-sm uppercase tracking-wider text-ink">{group.tag}</h3>
            <span className="font-mono text-[11px] text-faint">{group.ops.length}</span>
            {tagDesc.get(group.tag) && (
              <span className="font-sans text-[12.5px] text-muted">{tagDesc.get(group.tag)}</span>
            )}
          </div>
          <div className="space-y-4">
            {group.ops.map(({ method, path, op }) => (
              <Operation key={`${method} ${path}`} spec={spec} method={method} path={path} op={op} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
