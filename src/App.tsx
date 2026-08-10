import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageSelector } from './components/layout/LanguageSelector';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LocaleProvider } from './i18n/LocaleProvider';
import { GameView } from './pages/GameView';
import { Home } from './pages/Home';
import { Login } from './pages/Login';

function App() {
  return (
    <LocaleProvider>
      <AuthProvider>
        <BrowserRouter basename="/boardgame-tracker">
          <LanguageSelector />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/game/:gameId"
              element={
                <ProtectedRoute>
                  <GameView mode="list" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/game/:gameId/new"
              element={
                <ProtectedRoute>
                  <GameView mode="create" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/game/:gameId/edit/:recordId"
              element={
                <ProtectedRoute>
                  <GameView mode="edit" />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LocaleProvider>
  );
}

export default App;
