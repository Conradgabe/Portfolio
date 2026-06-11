import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} · ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#0a0b0b";
const INK = "#ffffff";
const ACCENT = "#c1cfcf";
const FAINT = "rgba(193,207,207,0.62)";
const LINE = "rgba(193,207,207,0.18)";

// Branded "designed terminal" social card.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: BG,
          padding: 44,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            border: `1px solid ${LINE}`,
          }}
        >
          {/* window chrome */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "20px 28px",
              borderBottom: `1px solid ${LINE}`,
            }}
          >
            <div style={{ width: 13, height: 13, borderRadius: 99, border: `1px solid ${ACCENT}` }} />
            <div style={{ width: 13, height: 13, borderRadius: 99, border: `1px solid ${ACCENT}` }} />
            <div style={{ width: 13, height: 13, borderRadius: 99, border: `1px solid ${ACCENT}` }} />
            <div style={{ marginLeft: 14, color: FAINT, fontSize: 22 }}>gabriel-isuekebho · portfolio</div>
          </div>

          {/* body */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "0 60px",
            }}
          >
            <div style={{ display: "flex", color: ACCENT, fontSize: 30, marginBottom: 22 }}>$ whoami</div>
            <div style={{ display: "flex", color: INK, fontSize: 92, fontWeight: 700, letterSpacing: -2 }}>
              {site.name}
            </div>
            <div style={{ display: "flex", color: ACCENT, fontSize: 38, marginTop: 14 }}>{site.role}</div>
            <div style={{ display: "flex", color: FAINT, fontSize: 27, marginTop: 30, maxWidth: 880 }}>
              Building reliable backends for systems and products.
            </div>
          </div>

          {/* footer */}
          <div
            style={{
              display: "flex",
              gap: 28,
              padding: "20px 28px",
              borderTop: `1px solid ${LINE}`,
              color: FAINT,
              fontSize: 22,
            }}
          >
            <div style={{ display: "flex" }}>github.com/conradgabe</div>
            <div style={{ display: "flex" }}>linkedin.com/in/gabrielisuekebho</div>
            <div style={{ display: "flex" }}>{site.location}</div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
