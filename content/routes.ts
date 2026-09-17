import type { RouteKey } from "@/types/content";

/** Public route paths live here so content and presentation share one vocabulary. */
export const routes: Record<RouteKey, string> = {
  home: "/",
  about: "/about",
  coal: "/coal",
  industries: "/industries",
  capabilities: "/capabilities",
  operations: "/operations",
  contact: "/contact",
  privacy: "/privacy",
};

export const quoteRoute = `${routes.contact}#quote`;
