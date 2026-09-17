"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { EditorialLine } from "@/types/content";
import { EditorialLines, domToEditorialLines, editorialLinesToHtml } from "@/components/content-text";
import { Field } from "./admin-primitives";

type Props = {
  label: string;
  value: readonly EditorialLine[];
  onChange: (lines: EditorialLine[]) => void;
  required?: boolean;
  max?: number;
};

export function EditorialRichEditor({ label, value, onChange, required, max = 150 }: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [paneVisible, setPaneVisible] = useState(false);
  const [panePos, setPanePos] = useState({ top: 0, left: 0 });
  const [isCursive, setIsCursive] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isAccent, setIsAccent] = useState(false);
  const isUpdatingRef = useRef(false);

  useEffect(() => {
    if (!editorRef.current || isUpdatingRef.current) return;
    const html = editorialLinesToHtml(value);
    if (editorRef.current.innerHTML !== html) {
      editorRef.current.innerHTML = html;
    }
  }, [value]);

  const syncContent = useCallback(() => {
    if (!editorRef.current) return;
    isUpdatingRef.current = true;
    const lines = domToEditorialLines(editorRef.current);
    onChange(lines);
    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 50);
  }, [onChange]);

  const updateSelectionPane = useCallback(() => {
    if (!editorRef.current) {
      setPaneVisible(false);
      return;
    }
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.rangeCount) {
      setPaneVisible(false);
      return;
    }
    const range = sel.getRangeAt(0);
    if (!editorRef.current.contains(range.commonAncestorContainer)) {
      setPaneVisible(false);
      return;
    }
    const text = sel.toString().trim();
    if (!text) {
      setPaneVisible(false);
      return;
    }

    const rangeRect = range.getBoundingClientRect();
    const wrapperRect = wrapperRef.current?.getBoundingClientRect();

    if (wrapperRect) {
      const top = rangeRect.top - wrapperRect.top - 42;
      const left = rangeRect.left - wrapperRect.left + rangeRect.width / 2;
      const clampedLeft = Math.max(140, Math.min(wrapperRect.width - 140, left));
      setPanePos({ top: Math.max(-10, top), left: clampedLeft });
      setPaneVisible(true);

      setIsCursive(document.queryCommandState("italic"));
      setIsBold(document.queryCommandState("bold"));
      let node: Node | null = range.commonAncestorContainer;
      let hasAccent = false;
      while (node && node !== editorRef.current) {
        if (
          node instanceof HTMLElement &&
          (node.classList.contains("editorial-accent") || (node.style.color && node.style.color.includes("amber")))
        ) {
          hasAccent = true;
          break;
        }
        node = node.parentNode;
      }
      setIsAccent(hasAccent);
    }
  }, []);

  useEffect(() => {
    const handleDocSelection = () => {
      setTimeout(updateSelectionPane, 10);
    };
    document.addEventListener("selectionchange", handleDocSelection);
    return () => document.removeEventListener("selectionchange", handleDocSelection);
  }, [updateSelectionPane]);

  const toggleItalic = (e: React.MouseEvent) => {
    e.preventDefault();
    editorRef.current?.focus();
    document.execCommand("italic", false);
    syncContent();
    updateSelectionPane();
  };

  const toggleBold = (e: React.MouseEvent) => {
    e.preventDefault();
    editorRef.current?.focus();
    document.execCommand("bold", false);
    syncContent();
    updateSelectionPane();
  };

  const toggleAccent = (e: React.MouseEvent) => {
    e.preventDefault();
    editorRef.current?.focus();
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;
    const range = sel.getRangeAt(0);

    let parentSpan: HTMLElement | null = null;
    let curr: Node | null = range.commonAncestorContainer;
    while (curr && curr !== editorRef.current) {
      if (curr instanceof HTMLElement && curr.classList.contains("editorial-accent")) {
        parentSpan = curr;
        break;
      }
      curr = curr.parentNode;
    }

    if (parentSpan) {
      const text = parentSpan.textContent ?? "";
      parentSpan.replaceWith(document.createTextNode(text));
    } else {
      const span = document.createElement("span");
      span.className = "editorial-accent";
      try {
        range.surroundContents(span);
      } catch {
        document.execCommand("foreColor", false, "#bb803c");
      }
    }
    syncContent();
    updateSelectionPane();
  };

  const insertBreak = (e: React.MouseEvent) => {
    e.preventDefault();
    editorRef.current?.focus();
    document.execCommand("insertLineBreak");
    syncContent();
    updateSelectionPane();
  };

  const clearFormat = (e: React.MouseEvent) => {
    e.preventDefault();
    editorRef.current?.focus();
    document.execCommand("removeFormat");
    syncContent();
    updateSelectionPane();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
    syncContent();
  };

  const totalLength = value.reduce((sum, item) => sum + item.text.length, 0);
  const error = required && totalLength === 0 ? `${label} is required.` : totalLength > max ? `Keep this below ${max} characters.` : undefined;

  return (
    <Field
      label={label}
      required={required}
      hint="Select text in this field to format with Cursive, Bold, Amber, or Line breaks."
      error={error}
      count={`${totalLength}/${max}`}
    >
      <div className="admin-rich-editor-wrapper" ref={wrapperRef}>
        {paneVisible && (
          <div
            className="admin-select-pane"
            style={{ top: `${panePos.top}px`, left: `${panePos.left}px` }}
            role="toolbar"
            aria-label="Format selection"
          >
            <button
              type="button"
              className={`admin-select-pane__btn admin-select-pane__btn--cursive ${isCursive ? "is-active" : ""}`}
              onMouseDown={toggleItalic}
              title="Cursive serif emphasis"
            >
              <i>I</i> Cursive
            </button>
            <button
              type="button"
              className={`admin-select-pane__btn admin-select-pane__btn--bold ${isBold ? "is-active" : ""}`}
              onMouseDown={toggleBold}
              title="Bold weight"
            >
              <b>B</b> Bold
            </button>
            <button
              type="button"
              className={`admin-select-pane__btn admin-select-pane__btn--amber ${isAccent ? "is-active" : ""}`}
              onMouseDown={toggleAccent}
              title="Amber brand accent"
            >
              <span style={{ color: "var(--amber-pale)" }}>✦</span> Amber
            </button>
            <div className="admin-select-pane__divider" />
            <button
              type="button"
              className="admin-select-pane__btn"
              onMouseDown={insertBreak}
              title="Insert line break"
            >
              ↵ Break
            </button>
            <button
              type="button"
              className="admin-select-pane__btn"
              onMouseDown={clearFormat}
              title="Clear formatting"
            >
              ⊘ Clear
            </button>
          </div>
        )}

        <div
          ref={editorRef}
          className="admin-rich-editor"
          contentEditable
          suppressContentEditableWarning
          onInput={syncContent}
          onPaste={handlePaste}
          onKeyUp={updateSelectionPane}
          onMouseUp={updateSelectionPane}
          role="textbox"
          aria-multiline="true"
          aria-label={label}
        />
      </div>

      <div className="admin-headline-preview" aria-live="polite">
        <span className="admin-headline-preview__label">Live page render</span>
        <div className="admin-headline-preview__content">
          <EditorialLines lines={value} />
        </div>
      </div>
    </Field>
  );
}
