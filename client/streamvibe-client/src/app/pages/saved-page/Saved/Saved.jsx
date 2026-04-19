import './Saved.scss'

import { useState, useEffect } from 'react'

import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'

import MovieCard from '../../../components/MovieCard'

const Saved = () => {
  const [movies, setMovies] = useState([])
  const [series, setSeries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const axiosPrivate = useAxiosPrivate()

  const titleId = 'saved-movies-title'

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        setLoading(true)
        const response = await axiosPrivate.get('/watchlist')
        setMovies(response.data.movies || [])
        setSeries(response.data.series || [])
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

  const hasContent = movies.length > 0 || series.length > 0

  return (
    <section className="saved container" aria-labelledby={titleId}>
      <h1 className="saved__title h2" id={titleId}>
        Deine Merkliste
      </h1>

      {!hasContent ? (
        <div className="saved__empty">
          <p>Du hast noch keine Filme oder Serien gespeichert.</p>
          <p>Füge Inhalte zu Deiner Merkliste hinzu, um sie hier zu sehen.</p>
        </div>
      ) : (
        <>
          {movies.length > 0 && (
            <>
              <h2 className="saved__category-title h3">
                Filme
              </h2>
              <div className="saved__grid">
                {movies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    title={movie.title}
                    imgSrc={movie.poster_path}
                    rating={{
                      value: movie.rating || 0,
                      label: movie.rating ? movie.rating.toFixed(1) : 'N/A',
                    }}
                    href={`/movie/${movie.id}`}
                  />
                ))}
              </div>
            </>
          )}

          {series.length > 0 && (
            <>
              <h2 className="saved__category-title h3">
                Serien
              </h2>
              <div className="saved__grid">
                {series.map((serie) => (
                  <MovieCard
                    key={serie.id}
                    title={serie.title}
                    imgSrc={serie.poster_path}
                    rating={{
                      value: serie.rating || 0,
                      label: serie.rating ? serie.rating.toFixed(1) : 'N/A',
                    }}
                    href={`/serie/${serie.id}`}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

    </section>
  )
}

export default Saved