/**
 * Résumé data: sourced from Gabriel's master résumé (Gabriel-Isuekebho-Resume.pdf).
 * The on-brand /resume page renders this; the PDF is the canonical download.
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
  "Software engineer with 5+ years building scalable backend systems, AI-integrated platforms, and production APIs across fintech, SaaS, and real estate. Deep expertise in Python and C#, shipping backend services, microservices architectures, and live LLM/NLP integrations, across the full lifecycle from architecture to deployment with Docker, Kubernetes, and CI/CD.";

export const experience: ResumeJob[] = [
  {
    role: "Full Stack Engineer",
    org: "Lustrew Dynamics",
    period: "Dec 2025 – Present",
    location: "Remote",
    bullets: [
      "Architected and own the full backend of a production SaaS platform (Python, FastAPI): server-side logic, data models, and service integrations from the ground up.",
      "Lead all AI integration: deploying and orchestrating LLM, STT, TTS, and vision models on GPU servers, with prompt engineering, context-window strategy, and multi-model coordination for a live user base.",
      "Built a real-time AI conversation system over WebSockets (vision models + parallel STT pipelines), Stripe billing, and an enterprise access layer with RBAC, SSO, and audit logging.",
      "Stood up CI/CD and the release workflow from scratch for a 5-person team: zero-downtime deploys in minutes; Docker + Kubernetes across all environments.",
    ],
  },
  {
    role: "Software Engineer",
    org: "Codeware",
    period: "Feb 2025 – Dec 2025",
    location: "Lagos, Nigeria",
    bullets: [
      "Built and maintained C#/ASP.NET Core backends, redesigning architecture for multi-industry SaaS (retail, restaurant, pharmacy): cut integration time 35%.",
      "Optimised database schemas and query logic, reducing response times 30%; clean architecture (repositories, interfaces, DTOs, mappers) reduced bugs 25%.",
      "Containerised services with Docker, cutting deployment cycles 50% and standardising releases.",
    ],
  },
  {
    role: "Backend Engineer",
    org: "Carbonnote",
    period: "Dec 2024 – Apr 2025",
    location: "Remote (US)",
    bullets: [
      "Led a microservices architecture for an AI research platform: 40% less downtime, 75% faster deploys.",
      "Embedded ML and conversational-AI models with the ML team (+35% performance); built database, security, and monitoring solutions plus full API docs (Swagger/Redoc).",
    ],
  },
  {
    role: "Backend Engineer",
    org: "Ajay Tech",
    period: "Dec 2023 – Jun 2024",
    location: "Remote",
    bullets: [
      "Built and deployed an AI-powered fintech chatbot (Python) that automated payment-record management.",
      "Integrated NLP and fine-tuned ML models on financial-domain data (+25% accuracy); built API endpoints for payment processing and transaction management.",
    ],
  },
  {
    role: "Technical Writer",
    org: "Chimoney",
    period: "Oct 2022 – Oct 2023",
    location: "Remote",
    bullets: [
      "Authored technical documentation and step-by-step integration guides for a financial-services API, reducing developer onboarding friction.",
    ],
  },
  {
    role: "Full Stack Developer",
    org: "Zuri Team",
    period: "Mar 2021 – Mar 2022",
    location: "Nigeria",
    bullets: [
      "Led a team building an image-resizing embed application end-to-end: architecture, coordination, and on-time delivery.",
    ],
  },
  {
    role: "Backend Engineer",
    org: "HNG Internship",
    period: "Oct 2022 – Dec 2022",
    location: "Remote",
    bullets: [
      "Developed predictive stock algorithms (Python) and secure financial-data pipelines with Stripe payments, collaborating across the full SDLC.",
    ],
  },
];

export const education: Education[] = [
  { credential: "BSc, Biochemistry", school: "University of Benin", period: "2021 – 2024" },
];

export const certifications: string[] = [
  "Kubernetes & Cloud Native Associate (KCNA) · CNCF",
  "Google Project Management Certificate · Coursera",
  "Google Cybersecurity Certificate · Coursera",
  "AI-Augmented Professional Development · Harmony Naija DAO",
];
