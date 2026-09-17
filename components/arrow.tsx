type ArrowProps = {
  diagonal?: boolean;
};

export function Arrow({ diagonal = false }: ArrowProps) {
  return (
    <svg className="arrow-icon" viewBox="0 0 18 18" aria-hidden="true">
      <path d={diagonal ? "M3.5 14.5 14.5 3.5M6 3.5h8.5V12" : "M2 9h13M10.5 4.5 15 9l-4.5 4.5"} fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
