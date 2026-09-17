import type { MediaAsset } from "@/types/content";

/** Development media only. These records seed the S3-compatible media library. */
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
    storagePath: "images/placeholder-coal-yard.png",
    title: "Coal stocking development plate",
    altText: "Temporary coal stocking visual placeholder",
    label: "DEVELOPMENT IMAGE PLATE",
    category: "hero",
    placeholder: true,
  },
  {
    id: "coal-material-placeholder",
    url: "/images/placeholder-coal-material.png",
    storagePath: "images/placeholder-coal-material.png",
    title: "Coal material development placeholder",
    altText: "Temporary coal material image placeholder",
    label: "DEVELOPMENT IMAGE / COAL MATERIAL",
    category: "coal",
    placeholder: true,
  },
  {
    id: "wani-yard-placeholder",
    url: "/images/placeholder-coal-yard.png",
    storagePath: "images/placeholder-coal-yard.png",
    title: "Wani stocking-yard development placeholder",
    altText: "Temporary industrial stocking-yard image placeholder",
    label: "DEVELOPMENT IMAGE / STOCKING YARD",
    category: "facility",
    placeholder: true,
  },
  {
    id: "industrial-environment-placeholder",
    url: "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?auto=format&fit=crop&w=1800&q=85",
    title: "Industrial environment development placeholder",
    altText: "Temporary industrial environment image placeholder",
    label: "DEVELOPMENT IMAGE / INDUSTRIAL ENVIRONMENT",
    category: "industrial",
    placeholder: true,
  },
  {
    id: "process-environment-placeholder",
    url: "https://images.unsplash.com/photo-1565610222536-ef125c59da2e?auto=format&fit=crop&w=1500&q=85",
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
