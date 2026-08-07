import { BrowserRouter, Route, Routes } from 'react-router-dom';

function HomePage() {
  return (
    <main className="flex min-h-svh items-center justify-center">
      <h1 className="text-2xl font-semibold">Boardgame Tracker</h1>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter basename="/boardgame-tracker">
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
