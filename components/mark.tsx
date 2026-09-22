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
  const [animating, setAnimating] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerTap = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setAnimating(true);
    timeoutRef.current = setTimeout(() => {
      setAnimating(false);
    }, 750);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <span
      className={`brand-mark ${inverse ? "brand-mark--inverse" : ""} ${animating ? "brand-mark--animating" : ""}`}
      aria-label={brandName}
      onTouchStart={triggerTap}
      onClick={triggerTap}
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
