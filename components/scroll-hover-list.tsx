"use client";

import { useEffect, useRef } from "react";
import type { ComponentPropsWithoutRef } from "react";

/**
 * Browsers can defer :hover recalculation while a wheel/trackpad scroll is in
 * flight. Keep the row under a fine pointer visually active on every scroll
 * frame so editorial lists feel continuous rather than lag behind the page.
 */
export function ScrollHoverList({ children, ...props }: ComponentPropsWithoutRef<"div">) {
  const listRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const activeRowRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const updateActiveRow = () => {
      frameRef.current = null;
      const list = listRef.current;
      const pointer = pointerRef.current;
      const candidate = pointer
        ? document.elementFromPoint(pointer.x, pointer.y)?.closest<HTMLElement>("[data-scroll-hover-row]") ?? null
        : null;
      const nextRow = candidate && list?.contains(candidate) ? candidate : null;

      if (nextRow === activeRowRef.current) return;
      activeRowRef.current?.classList.remove("is-scroll-hovered");
      nextRow?.classList.add("is-scroll-hovered");
      activeRowRef.current = nextRow;
    };

    const scheduleUpdate = () => {
      if (frameRef.current === null) frameRef.current = requestAnimationFrame(updateActiveRow);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      pointerRef.current = { x: event.clientX, y: event.clientY };
      scheduleUpdate();
    };
    const clearActiveRow = () => {
      pointerRef.current = null;
      scheduleUpdate();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("blur", clearActiveRow);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("blur", clearActiveRow);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      activeRowRef.current?.classList.remove("is-scroll-hovered");
    };
  }, []);

  return <div ref={listRef} {...props}>{children}</div>;
}
