type MarkProps = {
  inverse?: boolean;
  compact?: boolean;
  brandName: string;
};

/**
 * The brand mark layers the 3D obsidian star core and each of its trailing
 * mineral chunks so they can animate independently on hover.
 */
export function Mark({ brandName, inverse = false, compact = false }: MarkProps) {
  const [primaryWord, ...secondaryWords] = brandName.split(" ");
  const secondaryWord = secondaryWords.join(" ");

  return (
    <span className={`brand-mark ${inverse ? "brand-mark--inverse" : ""}`} aria-label={brandName}>
      <span className="brand-mark__symbol" aria-hidden="true">
        <img
          src="/images/logo/star-core-256.webp"
          alt=""
          className="brand-mark__core"
          width={38}
          height={38}
          loading="eager"
          decoding="async"
        />
        <img
          src="/images/logo/chunk-1-256.webp"
          alt=""
          className="brand-mark__chunk brand-mark__chunk--1"
          width={38}
          height={38}
          loading="eager"
          decoding="async"
        />
        <img
          src="/images/logo/chunk-2-256.webp"
          alt=""
          className="brand-mark__chunk brand-mark__chunk--2"
          width={38}
          height={38}
          loading="eager"
          decoding="async"
        />
        <img
          src="/images/logo/chunk-3-256.webp"
          alt=""
          className="brand-mark__chunk brand-mark__chunk--3"
          width={38}
          height={38}
          loading="eager"
          decoding="async"
        />
        <img
          src="/images/logo/chunk-4-256.webp"
          alt=""
          className="brand-mark__chunk brand-mark__chunk--4"
          width={38}
          height={38}
          loading="eager"
          decoding="async"
        />
        <img
          src="/images/logo/chunk-5-256.webp"
          alt=""
          className="brand-mark__chunk brand-mark__chunk--5"
          width={38}
          height={38}
          loading="eager"
          decoding="async"
        />
      </span>
      <span className="brand-mark__words">
        <span className="brand-mark__word">{primaryWord}</span>
        {!compact && secondaryWord && <span className="brand-mark__word brand-mark__word--light">{secondaryWord}</span>}
      </span>
    </span>
  );
}
