import type { GameConfig } from '../../types/game';

interface SaveStateFormProps {
  game: GameConfig;
}

export function SaveStateForm({ game }: SaveStateFormProps) {
  return (
    <section className="rounded-lg border border-neutral-200 p-6">
      <h2 className="text-lg font-semibold">Save State Form</h2>
      <p className="mt-2 text-sm text-neutral-500">
        Placeholder form for saving {game.name} campaign status.
      </p>
    </section>
  );
}
