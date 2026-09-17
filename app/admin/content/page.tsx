import Link from "next/link";
import { PageHeader } from "@/components/admin/admin-primitives";

const pages = [
  { number: "01", title: "Home", href: "/admin/content/home", body: "Hero, sourcing, featured content, facility, quality, experience and final enquiry copy." },
  { number: "02", title: "About", href: "/admin/content/about", body: "New-business positioning, industry experience distinction, approach and ambition." },
  { number: "03", title: "Contact", href: "/admin/content/contact", body: "Direct contact page copy, quote-form helper text and reassurance language." },
];

export default function ContentOverviewPage() {
  return <>
    <PageHeader eyebrow="WEBSITE CONTENT" title="Edit the approved public pages." description="Content is arranged by real website section. Layout, typography, colour and responsive behaviour remain protected." />
    <section className="admin-content-directory">{pages.map((page) => <Link href={page.href} key={page.href}><span>{page.number}</span><div><h3>{page.title}</h3><p>{page.body}</p></div><i>→</i></Link>)}</section>
  </>;
}
