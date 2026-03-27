import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Header from './src/components/header/Header'
import Movie from './src/components/movie-page/Movie/Movie'
import Movies from './src/components/movies-page/Movies'
import SupportPage from './src/components/support-page/SupportPage/SupportPage'
import UserLogin from './src/components/home/UserLogin'
import HomePage from './src/components/home/HomePage'

function App() {
  return (
      <Router>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage/>} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/movie/:imdbId" element={<Movie />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/login" element={<UserLogin />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </Router>
  )
}

export default App