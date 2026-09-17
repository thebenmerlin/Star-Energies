import { Arrow } from "./arrow";

export function SectionLabel({ children, inverse = false }: { children: React.ReactNode; inverse?: boolean }) {
  return <span className={`section-label ${inverse ? "section-label--inverse" : ""}`}><i />{children}</span>;
}

export function ArrowLink({ href, children, inverse = false }: { href: string; children: React.ReactNode; inverse?: boolean }) {
  return <a className={`arrow-link ${inverse ? "arrow-link--inverse" : ""}`} href={href}><span>{children}</span><Arrow diagonal /></a>;
}

export function RequirementPrompt({ inverse = false }: { inverse?: boolean }) {
  return (
    <div className={`requirement-prompt ${inverse ? "requirement-prompt--inverse" : ""}`}>
      <span>IF YOU KNOW IT, TELL US</span>
      <div><b>GRADE</b><b>SIZE</b><b>QUANTITY</b><b>DESTINATION</b></div>
    </div>
  );
}
