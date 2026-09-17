import type { CSSProperties } from "react";
import type { MediaAsset } from "@/types/content";

type MediaPlateProps = {
  asset: MediaAsset;
  className?: string;
  caption?: string;
};

export function MediaPlate({ asset, className = "", caption }: MediaPlateProps) {
  return (
    <figure className={`media-plate ${className}`}>
      <div className="media-plate__image" style={{ "--media-image": `url("${asset.url}")` } as CSSProperties} role="img" aria-label={asset.altText} />
      <div className="media-plate__scrim" />
      <figcaption><span>{asset.label}</span><span>{caption ?? asset.caption ?? "REPLACE WITH CLIENT PHOTOGRAPHY"}</span></figcaption>
    </figure>
  );
}
