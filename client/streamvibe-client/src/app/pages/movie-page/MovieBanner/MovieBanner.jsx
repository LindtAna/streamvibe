import { useState, useEffect } from 'react'

import { apiService } from '../../../../api/api'

import MovieBannerCard from '../MovieBannerCard'

const MovieBanner = ({ imdbId }) => {
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true)

        const movies = await apiService.getMovies()

        // Wenn eine bestimmte IMDb-ID angegeben wird, wird den entsprechenden Film geladen
        // Andernfalls werden alle Filme geladen und den ersten gewählt
        if (imdbId) {
          const foundMovie = movies.find(m => m.imdb_id === imdbId)
          setMovie(foundMovie || movies[0])
        } else {
          setMovie(movies[0])
        }
      } catch (err) {
        setError(err.message)
        console.error('Failed to fetch movie:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMovie()
  }, [imdbId])

  if (loading) {
    return <div className="container">Loading...</div>
  }

  if (error) {
    return <div className="container">Error: {error}</div>
  }

  if (!movie) {
    return <div className="container">No movie found</div>
  }


  return (
    <MovieBannerCard
      movie={movie} />
  )
}

export default MovieBanner