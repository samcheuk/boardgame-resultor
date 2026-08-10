import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { GameView } from './pages/GameView';
import { Home } from './pages/Home';
import { Login } from './pages/Login';

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
  );
}

export default App;
