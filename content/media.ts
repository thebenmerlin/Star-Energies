import type { MediaAsset } from "@/types/content";

/** Development media only. These records seed the Cloudinary-backed media library. */
export const mediaAssets = [
  {
    id: "star-energies-wordmark",
    url: "",
    title: "Star Energies text wordmark",
    altText: "Star Energies text wordmark",
    label: "TEXT WORDMARK",
    category: "logo",
    placeholder: true,
  },
  {
    id: "hero-development-plate",
    url: "/images/placeholder-coal-yard.png",
    title: "Coal stocking yard",
    altText: "Coal stockpiles in an industrial stocking yard at first light",
    label: "COAL / STOCKING YARD",
    category: "hero",
    placeholder: true,
  },
  {
    id: "coal-material-placeholder",
    url: "/images/placeholder-coal-material.png",
    title: "Coal material study",
    altText: "Close view of industrial coal material",
    label: "COAL / MATERIAL STUDY",
    category: "coal",
    placeholder: true,
  },
  {
    id: "wani-yard-placeholder",
    url: "/images/placeholder-coal-yard.png",
    title: "Wani stocking yard",
    altText: "Coal stockpiles in an industrial stocking yard",
    label: "WANI / STOCKING YARD",
    category: "facility",
    placeholder: true,
  },
  {
    id: "industrial-environment-placeholder",
    url: "/images/placeholder-coal-yard.png",
    title: "Industrial environment",
    altText: "Industrial coal handling environment",
    label: "INDUSTRIAL ENVIRONMENT",
    category: "industrial",
    placeholder: true,
  },
  {
    id: "process-environment-placeholder",
    url: "/images/placeholder-coal-material.png",
    title: "Industrial process environment",
    altText: "Coal material in an industrial process environment",
    label: "PROCESS ENVIRONMENT",
    category: "operations",
    placeholder: true,
  },
] satisfies MediaAsset[];

export const mediaById: Record<string, MediaAsset> = Object.fromEntries(
  mediaAssets.map((asset) => [asset.id, asset]),
);
