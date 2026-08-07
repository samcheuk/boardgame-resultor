import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';

function HomePage() {
  const { user, signOut } = useAuth();

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">Boardgame Tracker</h1>
      {user?.email ? (
        <p className="text-sm text-neutral-500">{user.email}</p>
      ) : null}
      <button
        type="button"
        onClick={() => {
          void signOut();
        }}
        className="rounded-md border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50"
      >
        Sign out
      </button>
    </main>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/boardgame-tracker">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
