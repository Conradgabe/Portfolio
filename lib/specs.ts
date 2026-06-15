/**
 * Real OpenAPI specs for the private FastAPI services, exported by Gabriel from /openapi.json.
 * The raw JSON lives in lib/specs/*.json (verbatim from each app) and is:
 *   - rendered on /projects/<slug>/api via OpenApiView
 *   - served for download via the /api-specs/<key> route handler
 * Add quant-platform and pg-tailor here when their specs arrive.
 */
import clipnSpec from "./specs/clipn.json";
import clipnRendererSpec from "./specs/clipn-renderer.json";
import pgTailorSpec from "./specs/pg-tailor.json";

export type OpenApiRef = { $ref: string };

export type OpenApiSchema = {
  type?: string | string[];
  title?: string;
  description?: string;
  default?: unknown;
  enum?: unknown[];
  minimum?: number;
  maximum?: number;
  pattern?: string;
  format?: string;
  required?: string[];
  properties?: Record<string, OpenApiSchema | OpenApiRef>;
  items?: OpenApiSchema | OpenApiRef;
  anyOf?: (OpenApiSchema | OpenApiRef)[];
  oneOf?: (OpenApiSchema | OpenApiRef)[];
  allOf?: (OpenApiSchema | OpenApiRef)[];
  additionalProperties?: boolean | OpenApiSchema | OpenApiRef;
  $ref?: string;
};

export type OpenApiParameter = {
  name: string;
  in: "query" | "path" | "header" | "cookie";
  required?: boolean;
  description?: string;
  schema?: OpenApiSchema | OpenApiRef;
};

export type OpenApiMediaType = { schema?: OpenApiSchema | OpenApiRef };

export type OpenApiOperation = {
  summary?: string;
  description?: string;
  tags?: string[];
  operationId?: string;
  parameters?: OpenApiParameter[];
  requestBody?: { required?: boolean; content?: Record<string, OpenApiMediaType> };
  responses?: Record<string, { description?: string; content?: Record<string, OpenApiMediaType> }>;
};

export type OpenApiSpec = {
  openapi: string;
  info: { title: string; description?: string; version: string };
  paths: Record<string, Record<string, OpenApiOperation>>;
  components?: { schemas?: Record<string, OpenApiSchema> };
  tags?: { name: string; description?: string }[];
};

/** Primary spec rendered as a project's main API reference, keyed by project slug. */
export const openApiSpecs: Record<string, OpenApiSpec> = {
  clipn: clipnSpec as unknown as OpenApiSpec,
  "pg-tailor": pgTailorSpec as unknown as OpenApiSpec,
};

/** Secondary "sidecar" specs documented alongside a project's main API. */
export const sidecarSpecs: Record<string, OpenApiSpec> = {
  clipn: clipnRendererSpec as unknown as OpenApiSpec,
};

/** Every downloadable raw spec, keyed by the /api-specs/<key> download slug. */
export const rawSpecs: Record<string, OpenApiSpec> = {
  clipn: clipnSpec as unknown as OpenApiSpec,
  "clipn-renderer": clipnRendererSpec as unknown as OpenApiSpec,
  "pg-tailor": pgTailorSpec as unknown as OpenApiSpec,
};

/** Count total operations (method + path pairs) in a spec. */
export function countOperations(spec: OpenApiSpec): number {
  const methods = new Set(["get", "post", "put", "patch", "delete", "options", "head"]);
  let n = 0;
  for (const ops of Object.values(spec.paths)) {
    for (const m of Object.keys(ops)) if (methods.has(m)) n++;
  }
  return n;
}
