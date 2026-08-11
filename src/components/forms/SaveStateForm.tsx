import { getGameName } from '../../games';
import { useLocale } from '../../i18n/useLocale';
import type { GameConfig } from '../../types/game';

interface SaveStateFormProps {
  game: GameConfig;
}

export function SaveStateForm({ game }: SaveStateFormProps) {
  const { locale, t } = useLocale();

  return (
    <section className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-900">
      <h2 className="text-lg font-semibold">{t('saveState.title')}</h2>
      <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
        {t('saveState.placeholder', {
          gameName: getGameName(game, locale),
        })}
      </p>
    </section>
  );
}
