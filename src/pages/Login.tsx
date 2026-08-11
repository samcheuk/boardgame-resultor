import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { localizeError } from '../i18n/errors';
import { useLocale } from '../i18n/useLocale';

export function Login() {
  const { user, loading, error, signInWithGoogle } = useAuth();
  const { t } = useLocale();

  if (loading) {
    return (
      <main className="flex min-h-svh items-center justify-center">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {t('common.loading')}
        </p>
      </main>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 px-4 pt-[max(4.5rem,calc(env(safe-area-inset-top)+3.5rem))]">
      <h1 className="text-2xl font-semibold tracking-tight">Boardgame Resultor</h1>
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        {t('auth.signInPrompt')}
      </p>

      <button
        type="button"
        onClick={() => {
          void signInWithGoogle();
        }}
        className="rounded-md border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 transition hover:bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
      >
        {t('auth.signInWithGoogle')}
      </button>

      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {localizeError(error, t, 'auth.signInFailed')}
        </p>
      ) : null}
    </main>
  );
}
