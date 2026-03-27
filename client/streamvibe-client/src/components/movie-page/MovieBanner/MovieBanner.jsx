import { useState, useEffect } from 'react'
import MovieBannerCard from '../MovieBannerCard'
// import { api } from '../../../services/api'


const MovieBanner = ({ imdbId }) => {
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true)
        // Wenn eine bestimmte IMDb-ID angegeben wird, wird den entsprechenden Film geladen
        // Andernfalls werden alle Filme geladen und den ersten gewählt
        if (imdbId) {
          // Dieser Endpoint erfordert eine Autorisierung.
          //vorübergehend getMovies und filter verwenden
          const movies = await api.getMovies()
          const foundMovie = movies.find(m => m.imdb_id === imdbId)
          setMovie(foundMovie || movies[0])
        } else {
          const movies = await api.getMovies()
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