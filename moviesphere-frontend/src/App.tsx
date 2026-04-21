// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/ui/navbar/NavBar';

import MoviesPage from './pages/MoviesPage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import SimilarMoviesPage from './pages/SimilarMoviesPage';
import AIRecommendationsPage from './pages/AIRecommendationsPage';

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<MoviesPage />} />
        <Route path="/movie/:id" element={<MovieDetailsPage />} />
        <Route path="/movie/:id/similar" element={<SimilarMoviesPage />} />
        <Route path="/movie/:id/ai-recommend" element={<AIRecommendationsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;