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
