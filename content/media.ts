import type { MediaAsset } from "@/types/content";

/** Development media only. These records seed the Cloudinary-backed media library. */
export const mediaAssets = [
  {
    id: "star-energies-wordmark",
    url: "",
    title: "Star Energies text wordmark placeholder",
    altText: "Star Energies text logo placeholder",
    label: "DEVELOPMENT WORDMARK",
    category: "logo",
    placeholder: true,
  },
  {
    id: "hero-development-plate",
    url: "/images/placeholder-coal-yard.png",
    title: "Coal stocking development plate",
    altText: "Temporary coal stocking visual placeholder",
    label: "DEVELOPMENT IMAGE PLATE",
    category: "hero",
    placeholder: true,
  },
  {
    id: "coal-material-placeholder",
    url: "/images/placeholder-coal-material.png",
    title: "Coal material development placeholder",
    altText: "Temporary coal material image placeholder",
    label: "DEVELOPMENT IMAGE / COAL MATERIAL",
    category: "coal",
    placeholder: true,
  },
  {
    id: "wani-yard-placeholder",
    url: "/images/placeholder-coal-yard.png",
    title: "Wani stocking-yard development placeholder",
    altText: "Temporary industrial stocking-yard image placeholder",
    label: "DEVELOPMENT IMAGE / STOCKING YARD",
    category: "facility",
    placeholder: true,
  },
  {
    id: "industrial-environment-placeholder",
    url: "/images/placeholder-coal-yard.png",
    title: "Industrial environment development placeholder",
    altText: "Temporary industrial environment image placeholder",
    label: "DEVELOPMENT IMAGE / INDUSTRIAL ENVIRONMENT",
    category: "industrial",
    placeholder: true,
  },
  {
    id: "process-environment-placeholder",
    url: "/images/placeholder-coal-material.png",
    title: "Process environment development placeholder",
    altText: "Temporary industrial process image placeholder",
    label: "DEVELOPMENT IMAGE / PROCESS ENVIRONMENT",
    category: "operations",
    placeholder: true,
  },
] satisfies MediaAsset[];

export const mediaById: Record<string, MediaAsset> = Object.fromEntries(
  mediaAssets.map((asset) => [asset.id, asset]),
);
