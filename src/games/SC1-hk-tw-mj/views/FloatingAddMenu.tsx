import { useEffect, useId, useRef, useState } from 'react';
import { useLocale } from '../../../i18n/useLocale';
import { hkTwMjText } from '../i18n';

interface FloatingAddMenuProps {
  onAddResult: () => void;
  onAddIncense: () => void;
}

export function FloatingAddMenu({
  onAddResult,
  onAddIncense,
}: FloatingAddMenuProps) {
  const { locale } = useLocale();
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      const root = rootRef.current;
      if (!root || !(event.target instanceof Node)) {
        return;
      }
      if (!root.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="fixed right-5 bottom-5 z-20">
      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label={hkTwMjText(locale, 'addMenuLabel')}
          className="absolute right-0 bottom-16 w-48 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
        >
          <button
            type="button"
            role="menuitem"
            className="block w-full px-4 py-3 text-left text-sm text-neutral-800 hover:bg-neutral-50 dark:text-neutral-100 dark:hover:bg-neutral-800"
            onClick={() => {
              setOpen(false);
              onAddResult();
            }}
          >
            {hkTwMjText(locale, 'addResult')}
          </button>
          <button
            type="button"
            role="menuitem"
            className="block w-full border-t border-neutral-100 px-4 py-3 text-left text-sm text-neutral-800 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-800"
            onClick={() => {
              setOpen(false);
              onAddIncense();
            }}
          >
            {hkTwMjText(locale, 'addIncense')}
          </button>
        </div>
      ) : null}

      <button
        type="button"
        aria-label={hkTwMjText(locale, 'addMenuLabel')}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => {
          setOpen((current) => !current);
        }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-900 text-2xl text-white shadow-lg transition hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
      >
        {open ? '×' : '+'}
      </button>
    </div>
  );
}
