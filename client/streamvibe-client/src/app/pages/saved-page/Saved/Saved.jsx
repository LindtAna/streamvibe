import './Saved.scss'

import { useState, useEffect } from 'react'

import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'

import MovieCard from '../../../components/MovieCard'

const Saved = () => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const axiosPrivate = useAxiosPrivate()

  const titleId = 'saved-movies-title'

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        setLoading(true)
        const response = await axiosPrivate.get('/watchlist')
        setMovies(response.data || [])
      } catch (err) {
        console.error('Fehler beim Laden der Merkliste:', err)
        setError('Fehler beim Laden der gespeicherten Filme.')
      } finally {
        setLoading(false)
      }
    }

    fetchWatchlist()
  }, [])

  if (loading) {
    return <div className="container">Lade gespeicherte Filme...</div>
  }

  if (error) {
    return <div className="container">{error}</div>
  }

  return (
    <section className="saved container" aria-labelledby={titleId}>
      <h1 className="saved__title h3" id={titleId}>
        Meine Merkliste
      </h1>

      {movies.length === 0 ? (
        <div className="saved__empty">
          <p>Du hast noch keine Filme gespeichert.</p>
          <p>Füge Filme zu Deiner Merkliste hinzu, um sie hier zu sehen.</p>
        </div>
      ) : (
        <div className="saved__grid">
          {movies.map((movie) => (
            <MovieCard
              key={movie.imdb_id}
              title={movie.title}
              imgSrc={movie.poster_path}
              rating={{
                value: movie.ranking?.ranking_value || 0,
                label: movie.ranking?.ranking_name || 'N/A',
              }}
              href={`/movie/${movie.imdb_id}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default Saved