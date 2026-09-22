"use client";

import { useState, useRef, useEffect } from "react";

type MarkProps = {
  inverse?: boolean;
  compact?: boolean;
  brandName: string;
};

/**
 * The brand mark layers the 3D obsidian star core and each of its trailing
 * mineral chunks so they can animate independently on hover and tap.
 */
export function Mark({ brandName, inverse = false, compact = false }: MarkProps) {
  const [primaryWord, ...secondaryWords] = brandName.split(" ");
  const secondaryWord = secondaryWords.join(" ");
  const [tapCount, setTapCount] = useState(0);
  const touchPosRef = useRef<{ x: number; y: number } | null>(null);
  const isTouchRef = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    isTouchRef.current = true;
    const touch = e.touches[0];
    touchPosRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchPosRef.current) return;
    const touch = e.changedTouches[0];
    const dx = Math.abs(touch.clientX - touchPosRef.current.x);
    const dy = Math.abs(touch.clientY - touchPosRef.current.y);
    touchPosRef.current = null;
    if (dx > 8 || dy > 8) return; // Ignore scrolling gestures

    setTapCount((prev) => prev + 1);
  };

  const handleClick = () => {
    if (isTouchRef.current) {
      // Prevent double firing when mobile browser emits synthetic click after touch
      isTouchRef.current = false;
      return;
    }
    setTapCount((prev) => prev + 1);
  };

  const tapClass =
    tapCount === 0
      ? ""
      : tapCount % 2 === 1
      ? "brand-mark--tap-a"
      : "brand-mark--tap-b";

  return (
    <span
      className={`brand-mark ${inverse ? "brand-mark--inverse" : ""} ${tapClass}`}
      aria-label={brandName}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
    >
      <span className="brand-mark__symbol" aria-hidden="true">
        <img
          src="/images/logo/star-core-256.webp"
          alt=""
          className="brand-mark__core"
          width={40}
          height={40}
          loading="eager"
          decoding="async"
        />
        <span className="brand-mark__shard brand-mark__shard--1">
          <img
            src="/images/logo/chunk-1-256.webp"
            alt=""
            className="brand-mark__chunk"
            width={40}
            height={40}
            loading="eager"
            decoding="async"
          />
        </span>
        <span className="brand-mark__shard brand-mark__shard--2">
          <img
            src="/images/logo/chunk-2-256.webp"
            alt=""
            className="brand-mark__chunk"
            width={40}
            height={40}
            loading="eager"
            decoding="async"
          />
        </span>
        <span className="brand-mark__shard brand-mark__shard--3">
          <img
            src="/images/logo/chunk-3-256.webp"
            alt=""
            className="brand-mark__chunk"
            width={40}
            height={40}
            loading="eager"
            decoding="async"
          />
        </span>
        <span className="brand-mark__shard brand-mark__shard--4">
          <img
            src="/images/logo/chunk-4-256.webp"
            alt=""
            className="brand-mark__chunk"
            width={40}
            height={40}
            loading="eager"
            decoding="async"
          />
        </span>
        <span className="brand-mark__shard brand-mark__shard--5">
          <img
            src="/images/logo/chunk-5-256.webp"
            alt=""
            className="brand-mark__chunk"
            width={40}
            height={40}
            loading="eager"
            decoding="async"
          />
        </span>
      </span>
      <span className="brand-mark__words">
        <span className="brand-mark__word">{primaryWord}</span>
        {!compact && secondaryWord && <span className="brand-mark__word brand-mark__word--light">{secondaryWord}</span>}
      </span>
    </span>
  );
}
