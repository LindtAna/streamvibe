import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import { AuthProvider } from './src/context/AuthProvider'
import RequiredAuth from './src/app/RequiredAuth'

import Header from './src/app/layouts/Header/Header'
import Layout from './src/app/Layout'

import UserLogin from './src/app/modals/Authentication/UserLogin'

import HomePage from './src/app/pages/home/HomePage'
import Movies from './src/app/pages/movies-page/Movies'
import Movie from './src/app/pages/movie-page/Movie'
import SavedPage from './src/app/pages/saved-page/SavedPage'
import SupportPage from './src/app/pages/support-page/SupportPage'

import Videoplayer from './src/app/components/Videoplayer/Videoplayer'

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