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
  theme?: "light" | "dark";
};

export function EditorialRichEditor({ label, value, onChange, required, max = 150, theme = "light" }: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [paneVisible, setPaneVisible] = useState(false);
  const [panePos, setPanePos] = useState({ top: 0, left: 0 });
  const [isCursive, setIsCursive] = useState(false);
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
      const clampedLeft = Math.max(100, Math.min(wrapperRect.width - 100, left));
      setPanePos({ top: Math.max(-10, top), left: clampedLeft });
      setPaneVisible(true);
      setIsCursive(document.queryCommandState("italic"));
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
      e.preventDefault();
    }
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
      hint="Select text in this field to apply the signature Gold Cursive emphasis, insert line breaks, or clear formatting."
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
              title="Gold Cursive Emphasis (Project Standard)"
            >
              <i>I</i> Cursive (Gold)
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
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onKeyUp={updateSelectionPane}
          onMouseUp={updateSelectionPane}
          role="textbox"
          aria-multiline="true"
          aria-label={label}
        />
      </div>

      <div className={`admin-headline-preview ${theme === "dark" ? "admin-headline-preview--dark" : "admin-headline-preview--light"}`} aria-live="polite">
        <span className="admin-headline-preview__label">Live page render {theme === "dark" ? "(dark surface)" : ""}</span>
        <div className="admin-headline-preview__content">
          <EditorialLines lines={value} />
        </div>
      </div>
    </Field>
  );
}
