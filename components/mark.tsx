type MarkProps = {
  inverse?: boolean;
  compact?: boolean;
  brandName: string;
};

export function Mark({ brandName, inverse = false, compact = false }: MarkProps) {
  const [primaryWord, ...secondaryWords] = brandName.split(" ");
  const secondaryWord = secondaryWords.join(" ");

  return (
    <span className={`brand-mark ${inverse ? "brand-mark--inverse" : ""}`} aria-label={brandName}>
      <span className="brand-mark__star" aria-hidden="true">✦</span>
      <span className="brand-mark__word">{primaryWord}</span>
      {!compact && secondaryWord && <span className="brand-mark__word brand-mark__word--light">{secondaryWord}</span>}
    </span>
  );
}
