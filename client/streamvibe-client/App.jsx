import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Header from './src/components/header/Header'
import Movie from './src/components/movie-page/Movie/Movie'
import Movies from './src/components/movies-page/Movies'
import SupportPage from './src/components/support-page/SupportPage/SupportPage'
import UserLogin from './src/components/auth/UserLogin'
import HomePage from './src/components/home/HomePage'
import { AuthProvider } from './src/context/AuthProvider'
import Layout from './src/components/Layout'
import RequiredAuth from './src/components/RequiredAuth'
import SavedPage from './src/components/saved-page/SavedPage'
import Videoplayer from './src/components/videoplayer/Videoplayer'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <main>
          <Routes>

            {/* Layout */}
            <Route path="/" element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/movies" element={<Movies showRecommendations={true} />} />
              {/* <Route path="/movie/:imdbId" element={<Movie />} /> */}
               <Route path="/movie/:tmdbId" element={<Movie />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/login" element={<UserLogin />} />
              <Route path="/stream/:yt_id" element={<Videoplayer />} />
               <Route path="/saved" element={<SavedPage />} />

              {/* Protected */}
              <Route path="/" element={<RequiredAuth />}>
              </Route>

            </Route>

            {/* fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </main>
      </Router>
    </AuthProvider>
  )
}

export default App