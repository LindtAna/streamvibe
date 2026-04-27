import { useState, useEffect } from 'react'

import { apiService } from '../../../../api/api'

import MovieBannerCardTMDB from '../MovieBannerCardTMDB'

const MovieBannerTMDB = ({ tmdbId }) => {
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true)

        if (tmdbId) {
          const movieData = await apiService.getMovieById(tmdbId)
          setMovie(movieData)
        }
      } catch (err) {
        setError(err.message)
        console.error('Failed to fetch movie:', err)
      } finally {
        setLoading(false)
      }
    }

    if (tmdbId) {
      fetchMovie()
    }
  }, [tmdbId])

  if (loading) {
    return <div className="container">Vorspann läuft...</div>
  }

  if (error) {
    return <div className="container">Error: {error}</div>
  }

  if (!movie) {
    return <div className="container">Popcorn ist fertig, Film leider nicht</div>
  }

  return <MovieBannerCardTMDB movie={movie} />
}

export default MovieBannerTMDB