import { LanguageSelector } from './LanguageSelector';
import { ThemeSegmentControl } from './ThemeSegmentControl';

export function TopControls() {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-end px-3 pt-[max(0.75rem,env(safe-area-inset-top))] pr-[max(0.75rem,env(safe-area-inset-right))]">
      <div className="pointer-events-auto flex items-center gap-2">
        <ThemeSegmentControl />
        <LanguageSelector />
      </div>
    </div>
  );
}
