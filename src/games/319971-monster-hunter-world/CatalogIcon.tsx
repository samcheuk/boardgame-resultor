import { resolveCatalogIcon } from './iconAssets';
import type { AssetPath } from './catalog';

interface CatalogIconProps {
  icon: AssetPath;
  alt: string;
  className?: string;
}

export function CatalogIcon({ icon, alt, className }: CatalogIconProps) {
  const src = resolveCatalogIcon(icon);
  if (!src) {
    return (
      <span
        aria-hidden
        className={`inline-block size-6 shrink-0 rounded bg-neutral-200 dark:bg-neutral-700 ${className ?? ''}`}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`size-6 shrink-0 object-contain ${className ?? ''}`}
    />
  );
}
