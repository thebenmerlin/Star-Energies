type MarkProps = {
  inverse?: boolean;
  compact?: boolean;
};

export function Mark({ inverse = false, compact = false }: MarkProps) {
  return (
    <span className={`brand-mark ${inverse ? "brand-mark--inverse" : ""}`} aria-label="Star Energies">
      <span className="brand-mark__star" aria-hidden="true">✦</span>
      <span className="brand-mark__word">STAR</span>
      {!compact && <span className="brand-mark__word brand-mark__word--light">ENERGIES</span>}
    </span>
  );
}
