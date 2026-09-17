import type { CSSProperties } from "react";

type MediaAsset = {
  src: string;
  alt: string;
  label: string;
};

type MediaPlateProps = {
  asset: MediaAsset;
  className?: string;
  caption?: string;
};

export function MediaPlate({ asset, className = "", caption }: MediaPlateProps) {
  return (
    <figure className={`media-plate ${className}`}>
      <div className="media-plate__image" style={{ "--media-image": `url("${asset.src}")` } as CSSProperties} role="img" aria-label={asset.alt} />
      <div className="media-plate__scrim" />
      <figcaption><span>{asset.label}</span><span>{caption ?? "REPLACE WITH CLIENT PHOTOGRAPHY"}</span></figcaption>
    </figure>
  );
}
