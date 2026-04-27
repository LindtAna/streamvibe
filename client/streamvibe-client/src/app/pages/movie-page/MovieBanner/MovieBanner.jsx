import { useState, useEffect } from 'react'

import { apiService } from '../../../../api/api'

import MovieBannerCard from '../MovieBannerCard'

const MovieBanner = ({ dbId }) => {
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true)
        if (dbId) {
          const movieData = await apiService.getDBMovieById(dbId)
          setMovie(movieData)
        }
      } catch (err) {
        setError(err.message)
        console.error('Failed to fetch movie:', err)
      } finally {
        setLoading(false)
      }
    }
    if (dbId) {
      fetchMovie()
    }
  }, [dbId])

  if (loading) {
    return <div className="container">Vorspann läuft...</div>
  }

  if (error) {
    return <div className="container">Error: {error}</div>
  }

  if (!movie) {
    return <div className="container">No movie found</div>
  }


  return (
    <MovieBannerCard movie={movie} />
  )
}

export default MovieBanner