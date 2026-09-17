import Link from "next/link";
import { Arrow } from "@/components/arrow";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-page__top"><span>PAGE STATE / 404</span><span>STAR ENERGIES</span></div>
      <div className="not-found-page__grid"><span className="not-found-page__number">404</span><div><p>THE PAGE YOU REQUESTED IS NOT HERE.</p><h1>Let’s get back<br /><em>to the useful work.</em></h1><nav aria-label="Helpful links"><Link href="/">Home <Arrow diagonal /></Link><Link href="/coal">Coal &amp; Products <Arrow diagonal /></Link><Link href="/contact">Contact <Arrow diagonal /></Link></nav></div></div>
    </main>
  );
}
