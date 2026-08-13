import bearIcon from './assets/tokens/bear.webp';
import elkIcon from './assets/tokens/elk.webp';
import foxIcon from './assets/tokens/fox.webp';
import hawkIcon from './assets/tokens/hawk.webp';
import natureTokenIcon from './assets/tokens/nature-token.webp';
import salmonIcon from './assets/tokens/salmon.webp';
import desertIcon from './assets/tiles/desert.webp';
import forestIcon from './assets/tiles/forest.webp';
import lakeIcon from './assets/tiles/lake.webp';
import mountainIcon from './assets/tiles/mountain.webp';
import swampIcon from './assets/tiles/swamp.webp';

/** Score category key → local asset (webp equivalents of the png mapping). */
export const SCORE_ICONS = {
  bears: bearIcon,
  salmon: salmonIcon,
  elk: elkIcon,
  hawks: hawkIcon,
  foxes: foxIcon,
  mountains: mountainIcon,
  forests: forestIcon,
  prairies: desertIcon,
  wetlands: swampIcon,
  rivers: lakeIcon,
  natureTokens: natureTokenIcon,
} as const;

export type CascadiaScoreIconKey = keyof typeof SCORE_ICONS;

export function ScoreIcon({
  scoreKey,
  alt = '',
  className = 'size-5 shrink-0',
}: {
  scoreKey: string;
  alt?: string;
  className?: string;
}) {
  const src =
    scoreKey in SCORE_ICONS
      ? SCORE_ICONS[scoreKey as CascadiaScoreIconKey]
      : undefined;

  if (!src) {
    return null;
  }

  return (
    <img src={src} alt={alt} className={className} draggable={false} />
  );
}
