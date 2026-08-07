import type { GameConfig } from '../../types/game';

interface ScoreSubmissionFormProps {
  game: GameConfig;
}

export function ScoreSubmissionForm({ game }: ScoreSubmissionFormProps) {
  return (
    <section className="rounded-lg border border-neutral-200 p-6">
      <h2 className="text-lg font-semibold">Score Submission Form</h2>
      <p className="mt-2 text-sm text-neutral-500">
        Placeholder form for recording a {game.name} result.
      </p>
    </section>
  );
}
