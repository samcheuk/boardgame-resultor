import { useLocale } from '../../i18n/useLocale';
import type { GameConfig } from '../../types/game';

interface SaveStateFormProps {
  game: GameConfig;
}

export function SaveStateForm({ game }: SaveStateFormProps) {
  const { t } = useLocale();

  return (
    <section className="rounded-lg border border-neutral-200 p-6">
      <h2 className="text-lg font-semibold">{t('saveState.title')}</h2>
      <p className="mt-2 text-sm text-neutral-500">
        {t('saveState.placeholder', { gameName: game.name })}
      </p>
    </section>
  );
}
