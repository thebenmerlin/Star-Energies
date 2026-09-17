"use client";

/**
 * A database-independent fallback for failures above the root layout. Global
 * error boundaries replace the root layout, so this intentionally carries its
 * own minimal styling rather than reading editable CMS settings.
 */
export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#e6e1d7", color: "#20201d", fontFamily: "Arial, Helvetica, sans-serif" }}>
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "32px" }}>
          <section style={{ width: "min(100%, 580px)", borderTop: "1px solid #b4772b", paddingTop: "24px" }}>
            <p style={{ margin: 0, color: "#9b641f", fontSize: "12px", letterSpacing: "0.12em" }}>STAR ENERGIES</p>
            <h1 style={{ margin: "16px 0 12px", fontSize: "clamp(30px, 7vw, 52px)", fontWeight: 500, letterSpacing: "-0.04em" }}>Something needs another look.</h1>
            <p style={{ margin: 0, maxWidth: "42ch", color: "#595750", fontSize: "16px", lineHeight: 1.6 }}>Please try again, or return to the public website and contact us directly if the issue continues.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "28px" }}>
              <button type="button" onClick={retry} style={{ border: 0, background: "#20201d", color: "#f7f3eb", cursor: "pointer", padding: "12px 18px", font: "inherit" }}>Try again</button>
              <a href="/" style={{ border: "1px solid #77736a", color: "#20201d", padding: "11px 17px", textDecoration: "none" }}>Return home</a>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
