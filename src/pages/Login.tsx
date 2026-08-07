import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Login() {
  const { user, loading, error, signInWithGoogle } = useAuth();

  if (loading) {
    return (
      <main className="flex min-h-svh items-center justify-center">
        <p className="text-sm text-neutral-500">Loading...</p>
      </main>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 px-4">
      <h1 className="text-2xl font-semibold tracking-tight">Boardgame Tracker</h1>
      <p className="text-sm text-neutral-500">Sign in to continue</p>

      <button
        type="button"
        onClick={() => {
          void signInWithGoogle();
        }}
        className="rounded-md border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 transition hover:bg-neutral-50"
      >
        Sign in with Google
      </button>

      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </main>
  );
}
