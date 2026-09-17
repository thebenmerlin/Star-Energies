import { Fragment } from "react";
import type { EditorialLine } from "@/types/content";

/** Small presentation helpers for structured editorial copy; layout remains in the page. */
export function EditorialLines({ lines }: { lines: readonly EditorialLine[] }) {
  return (
    <>
      {lines.map((line, index) => (
        <Fragment key={`${line.text}-${index}`}>
          {line.emphasis ? <em>{line.text}</em> : line.text}
          {line.breakAfter && index < lines.length - 1 ? <br /> : index < lines.length - 1 && " "}
        </Fragment>
      ))}
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
