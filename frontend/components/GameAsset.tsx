type GameAssetProps = {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
};

/** Renders a PNG from /public/assets (UI kit extracts). */
export function GameAsset({ src, alt, className, width, height }: GameAssetProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- local game art assets
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading="lazy"
      decoding="async"
      draggable={false}
    />
  );
}
