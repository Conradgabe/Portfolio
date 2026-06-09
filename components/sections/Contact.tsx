"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { site } from "@/lib/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

type Status = "idle" | "sending" | "success" | "error";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [copied, setCopied] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") || "");
    const email = String(fd.get("email") || "");
    const message = String(fd.get("message") || "");

    // No backend key configured yet → fall back to the user's mail client.
    if (!WEB3FORMS_KEY) {
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
        `Portfolio enquiry from ${name}`,
      )}&body=${encodeURIComponent(`${message}\n\n— ${name} (${email})`)}`;
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Portfolio enquiry from ${name}`,
          name,
          email,
          message,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  function copyEmail() {
    navigator.clipboard?.writeText(site.email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <section id="contact" className="border-t border-line">
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28">
        <Reveal>
          <SectionHeading
            command="mail"
            index="05"
            title="Get in touch"
            blurb="Open to backend, systems, AI, and Bitcoin/fintech work. Send a message or reach me directly."
          />
        </Reveal>

        <div className="grid gap-px overflow-hidden border border-line bg-line lg:grid-cols-[1.4fr_1fr]">
          {/* Form */}
          <Reveal className="bg-bg">
            <form onSubmit={onSubmit} className="space-y-4 p-6 sm:p-8">
              <Field label="name">
                <input
                  name="name"
                  required
                  autoComplete="name"
                  placeholder="Ada Lovelace"
                  className="w-full border border-line bg-transparent px-3 py-2.5 font-mono text-sm text-ink outline-none transition-colors placeholder:text-faint focus:border-accent-ink"
                />
              </Field>
              <Field label="email">
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="ada@example.com"
                  className="w-full border border-line bg-transparent px-3 py-2.5 font-mono text-sm text-ink outline-none transition-colors placeholder:text-faint focus:border-accent-ink"
                />
              </Field>
              <Field label="message">
                <textarea
                  name="message"
                  required
                  rows={4}
                  placeholder="What are you building?"
                  className="w-full resize-y border border-line bg-transparent px-3 py-2.5 font-mono text-sm text-ink outline-none transition-colors placeholder:text-faint focus:border-accent-ink"
                />
              </Field>

              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="inline-flex items-center gap-2 border border-line-strong bg-accent/10 px-4 py-2.5 font-mono text-sm text-ink transition-colors hover:bg-accent/20 disabled:opacity-60"
                >
                  <span className="text-accent-ink">$</span>
                  {status === "sending" ? "sending…" : "send message"}
                </button>
                {status === "success" && (
                  <span className="inline-flex items-center gap-1.5 font-mono text-sm text-accent-ink">
                    <Check size={15} /> sent — I&apos;ll reply soon
                  </span>
                )}
                {status === "error" && (
                  <span className="font-mono text-sm text-muted">
                    something went wrong — email me directly
                  </span>
                )}
              </div>
            </form>
          </Reveal>

          {/* Direct contact */}
          <Reveal delay={0.06} className="bg-bg">
            <div className="flex h-full flex-col gap-6 p-6 sm:p-8">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-faint">direct</p>
                <button
                  onClick={copyEmail}
                  className="group mt-2 flex items-center gap-2 font-mono text-sm text-ink transition-colors hover:text-accent-ink"
                >
                  {site.email}
                  {copied ? (
                    <Check size={14} className="text-accent-ink" />
                  ) : (
                    <Copy size={14} className="text-faint group-hover:text-accent-ink" />
                  )}
                </button>
              </div>

              <div>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-faint">elsewhere</p>
                <ul className="mt-2 space-y-2">
                  {site.socials
                    .filter((s) => s.label !== "Email")
                    .map((s) => (
                      <li key={s.label}>
                        <a
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-baseline gap-3 font-mono text-sm transition-colors"
                        >
                          <span className="w-20 shrink-0 text-muted group-hover:text-accent-ink">
                            {s.label}
                          </span>
                          <span className="min-w-0 break-all text-faint group-hover:text-muted">
                            {s.handle}
                          </span>
                        </a>
                      </li>
                    ))}
                </ul>
              </div>

              <div className="mt-auto">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-faint">based in</p>
                <p className="mt-2 font-mono text-sm text-muted">{site.location}</p>
                <p className="mt-1 inline-flex items-center gap-2 font-mono text-sm text-accent-ink">
                  <span className="h-2 w-2 rounded-full bg-accent-ink" />
                  available for work
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-xs text-muted">
        <span className="text-accent-ink">$</span> {label}
      </span>
      {children}
    </label>
  );
}
