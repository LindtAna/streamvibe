import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./src/context/AuthProvider";
import RequiredAuth from "./src/app/RequiredAuth";

import Header from "./src/app/layouts/Header/Header";
import Layout from "./src/app/Layout";
import Footer from "./src/app/layouts/Footer"; 

import UserLogin from "./src/app/modals/Authentication/UserLogin";

import HomePage from "./src/app/pages/home/HomePage";
import Movies from "./src/app/pages/movies-page/Movies";
import Movie from "./src/app/pages/movie-page/Movie";
import Series from "./src/app/pages/series-page/Series";
import Serie from "./src/app/pages/serie-page/Serie";

import SavedPage from "./src/app/pages/saved-page/SavedPage";
import SearchPage from "./src/app/pages/search-page/SearchPage";

import SupportPage from "./src/app/pages/support-page/SupportPage";

import Videoplayer from "./src/app/components/Videoplayer/Videoplayer";

import RequireAdmin from "./src/app/pages/admin-page/RequireAdmin";
import AdminDashboard from "./src/app/pages/admin-page/AdminDashboard";
import AddMovie from "./src/app/pages/admin-page/AddMovie";
import SupportRequests from "./src/app/pages/admin-page/SupportRequests";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="/" element={<HomePage />} />

              <Route
                path="/movies"
                element={<Movies showRecommendations={true} />}
              />
              <Route
                path="/series"
                element={<Series showRecommendations={true} />}
              />

              {/* Database movies */}
              <Route path="/db-movie/:dbId" element={<Movie />} />

              {/* TMDB */}
              <Route path="/movie/:tmdbId" element={<Movie />} />
              <Route path="/serie/:tmdbId" element={<Serie />} />
              <Route path="/saved" element={<SavedPage />} />
              <Route path="/search" element={<SearchPage />} />

              <Route path="/stream/:yt_id" element={<Videoplayer />} />

              <Route path="/login" element={<UserLogin isPage={true} />} />
              <Route path="/support" element={<SupportPage />} />

              {/* Protected */}
              <Route path="/" element={<RequiredAuth />}></Route>
            </Route>

            {/* Admin routes */}
            <Route element={<RequireAdmin />}>
              <Route path="/admin" element={<AdminDashboard />}>
                <Route index element={<AddMovie />} />
                <Route path="support-requests" element={<SupportRequests />} />
              </Route>
            </Route>

            {/* fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
