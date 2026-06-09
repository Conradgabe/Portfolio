/**
 * Résumé data. Summary/expertise/projects/skills are derived from the live
 * site data; experience & education are placeholders until Gabriel supplies
 * the real CV content (then these arrays get filled and the page is complete).
 */

export type ResumeJob = {
  role: string;
  org: string;
  period: string;
  location?: string;
  bullets: string[];
};

export type Education = {
  credential: string;
  school: string;
  period: string;
};

export const resumeSummary =
  "Backend & systems engineer (~5 years) specializing in AI pipelines, Bitcoin/Lightning, and fintech infrastructure. I build correctness-critical services — APIs, data pipelines, and payment-adjacent systems — primarily in Python and TypeScript, with FastAPI, PostgreSQL/TimescaleDB, Redis, and Docker.";

// TODO(Gabriel): provide roles/companies + dates.
export const experience: ResumeJob[] = [];

// TODO(Gabriel): provide education + certifications.
export const education: Education[] = [];
export const certifications: string[] = [];
