import type { AssetPath } from './catalog';

const iconModules = import.meta.glob<string>('./assets/**/*.webp', {
  eager: true,
  import: 'default',
});

export function resolveCatalogIcon(icon: AssetPath): string | undefined {
  return iconModules[`./assets/${icon}`];
}
