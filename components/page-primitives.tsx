import { Arrow } from "./arrow";
import type { RequirementDimension } from "@/types/content";

export function SectionLabel({ children, inverse = false }: { children: React.ReactNode; inverse?: boolean }) {
  return <span className={`section-label ${inverse ? "section-label--inverse" : ""}`}><i />{children}</span>;
}

export function ArrowLink({ href, children, inverse = false }: { href: string; children: React.ReactNode; inverse?: boolean }) {
  return <a className={`arrow-link ${inverse ? "arrow-link--inverse" : ""}`} href={href}><span>{children}</span><Arrow diagonal /></a>;
}

export function RequirementPrompt({
  dimensions,
  label,
  inverse = false,
}: {
  dimensions: readonly Pick<RequirementDimension, "id" | "label">[];
  label: string;
  inverse?: boolean;
}) {
  return (
    <div className={`requirement-prompt ${inverse ? "requirement-prompt--inverse" : ""}`}>
      <span>{label}</span>
      <div>{dimensions.map((dimension) => <b key={dimension.id}>{dimension.label.toUpperCase()}</b>)}</div>
    </div>
  );
}
