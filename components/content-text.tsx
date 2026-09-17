import { Fragment } from "react";
import type { EditorialLine } from "@/types/content";

/** Small presentation helpers for structured editorial copy; layout remains in the page. */
export function EditorialLines({ lines }: { lines: readonly EditorialLine[] }) {
  return (
    <>
      {lines.map((line, index) => {
        let textNode: React.ReactNode = line.text;
        if (line.accent) {
          textNode = <span className="editorial-accent">{textNode}</span>;
        }
        if (line.bold) {
          textNode = <strong>{textNode}</strong>;
        }
        if (line.emphasis) {
          textNode = <em>{textNode}</em>;
        }
        return (
          <Fragment key={`${line.text}-${index}`}>
            {textNode}
            {line.breakAfter && index < lines.length - 1 ? <br /> : index < lines.length - 1 && " "}
          </Fragment>
        );
      })}
    </>
  );
}

export function LineBreaks({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, index, lines) => (
        <Fragment key={`${line}-${index}`}>
          {line}
          {index < lines.length - 1 && <br />}
        </Fragment>
      ))}
    </>
  );
}

/** Converts structured editorial lines into Markdown-annotated text for single-field editors. */
export function editorialLinesToText(lines: readonly EditorialLine[]): string {
  let result = "";
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const formatted = line.emphasis ? `*${line.text}*` : line.text;
    result += formatted;
    if (line.breakAfter && i < lines.length - 1) {
      result += "\n";
    } else if (i < lines.length - 1) {
      result += " ";
    }
  }
  return result;
}

/** Parses single-field Markdown-annotated copy (*text* for cursive emphasis, newlines for line breaks) back into EditorialLine[]. */
export function textToEditorialLines(text: string): EditorialLine[] {
  const rawLines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (rawLines.length === 0) return [{ text: "" }];

  const allLines: EditorialLine[] = [];

  for (let lineIdx = 0; lineIdx < rawLines.length; lineIdx++) {
    const rawLine = rawLines[lineIdx];
    const isLastLine = lineIdx === rawLines.length - 1;
    const regex = /(\*([^*]+)\*|_([^_]+)_)/g;
    const lineSegments: EditorialLine[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(rawLine)) !== null) {
      if (match.index > lastIndex) {
        const before = rawLine.slice(lastIndex, match.index).trim();
        if (before) {
          lineSegments.push({ text: before });
        }
      }
      const emphasizedText = (match[2] ?? match[3]).trim();
      if (emphasizedText) {
        lineSegments.push({ text: emphasizedText, emphasis: true });
      }
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < rawLine.length) {
      const remaining = rawLine.slice(lastIndex).trim();
      if (remaining) {
        lineSegments.push({ text: remaining });
      }
    }

    if (lineSegments.length === 0 && rawLine) {
      lineSegments.push({ text: rawLine });
    }

    if (!isLastLine && lineSegments.length > 0) {
      lineSegments[lineSegments.length - 1].breakAfter = true;
    }

    allLines.push(...lineSegments);
  }

  return allLines;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Converts EditorialLine[] into HTML for the rich contenteditable editor. */
export function editorialLinesToHtml(lines: readonly EditorialLine[]): string {
  if (!lines || lines.length === 0) return "";
  let html = "";
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let seg = escapeHtml(line.text);
    if (line.accent) seg = `<span class="editorial-accent">${seg}</span>`;
    if (line.bold) seg = `<strong>${seg}</strong>`;
    if (line.emphasis) seg = `<em>${seg}</em>`;
    html += seg;
    if (line.breakAfter && i < lines.length - 1) {
      html += "<br>";
    } else if (i < lines.length - 1) {
      html += " ";
    }
  }
  return html;
}

/** Converts DOM tree from contenteditable element back into clean EditorialLine[]. */
export function domToEditorialLines(root: Node): EditorialLine[] {
  const segments: EditorialLine[] = [];

  function walk(node: Node, current: { emphasis?: boolean; bold?: boolean; accent?: boolean }) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent ?? "";
      if (text) {
        segments.push({
          text,
          ...(current.emphasis ? { emphasis: true } : {}),
          ...(current.bold ? { bold: true } : {}),
          ...(current.accent ? { accent: true } : {}),
        });
      }
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tag = el.tagName.toLowerCase();

      if (tag === "br") {
        if (segments.length > 0) {
          segments[segments.length - 1].breakAfter = true;
        }
        return;
      }

      const isEmphasis = tag === "em" || tag === "i" || el.style.fontStyle === "italic" || el.classList.contains("editorial-emphasis");
      const isBold = tag === "strong" || tag === "b" || el.style.fontWeight === "bold" || parseInt(el.style.fontWeight, 10) >= 600;
      const isAccent = el.classList.contains("editorial-accent") || Boolean(el.style.color && (el.style.color.includes("amber") || el.style.color.includes("187") || el.style.color.includes("bb803c")));
      const isBlock = tag === "div" || tag === "p";

      const next = {
        emphasis: current.emphasis || isEmphasis,
        bold: current.bold || isBold,
        accent: current.accent || isAccent,
      };

      for (let i = 0; i < el.childNodes.length; i++) {
        walk(el.childNodes[i], next);
      }

      if (isBlock && segments.length > 0 && !segments[segments.length - 1].breakAfter) {
        segments[segments.length - 1].breakAfter = true;
      }
    }
  }

  walk(root, {});

  // Merge adjacent segments that share exact same formatting
  const merged: EditorialLine[] = [];
  for (const seg of segments) {
    if (!seg.text && !seg.breakAfter) continue;
    if (
      merged.length > 0 &&
      !merged[merged.length - 1].breakAfter &&
      Boolean(merged[merged.length - 1].emphasis) === Boolean(seg.emphasis) &&
      Boolean(merged[merged.length - 1].bold) === Boolean(seg.bold) &&
      Boolean(merged[merged.length - 1].accent) === Boolean(seg.accent)
    ) {
      merged[merged.length - 1].text += seg.text;
      if (seg.breakAfter) {
        merged[merged.length - 1].breakAfter = true;
      }
    } else {
      merged.push({ ...seg });
    }
  }

  return merged.length > 0 ? merged : [{ text: "" }];
}
