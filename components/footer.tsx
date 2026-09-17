import { navigation, siteConfig } from "@/lib/site";
import { Mark } from "./mark";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer__top shell-grid">
        <div className="footer__identity">
          <Mark inverse />
          <p>Requirement-led industrial coal sourcing and supply, based in Wani.</p>
        </div>
        <div className="footer__links">
          <span className="eyebrow">Navigate</span>
          {navigation.slice(1).map((item) => <a key={item.label} href={item.href}>{item.label}</a>)}
        </div>
        <address className="footer__contact">
          <span className="eyebrow">Start a requirement</span>
          <a href={siteConfig.contact.phoneHref}>{siteConfig.contact.phoneDisplay}</a>
          <a href={siteConfig.contact.emailHref}>{siteConfig.contact.email}</a>
          <p>{siteConfig.location}</p>
        </address>
      </div>
      <div className="footer__base"><span>© {year} Star Energies</span><span>Industrial coal supply · India</span></div>
    </footer>
  );
}
