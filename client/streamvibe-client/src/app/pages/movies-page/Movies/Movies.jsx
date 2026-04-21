import { useState, useEffect } from 'react'

// import axiosClient from '../../../../api/axiosConfig'
import { apiService } from '../../../../api/api'

import Collections from '../../../components/Collections'

const Movies = ({ showRecommendations = false }) => {

  const [tmdbCollections, setTmdbCollections] = useState(null)
  const [dbMovies, setDbMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    const fetchMoviesData = async () => {
      setLoading(true)
      try {
  const [tmdbData, dbData] = await Promise.all([
          apiService.getMoviesPageCollections({
            signal: controller.signal
          }),
          apiService.getDBMovies({
            signal: controller.signal
          })
        ])
        setTmdbCollections(tmdbData)
        setDbMovies(dbData || [])
      } catch (err) {
        if (err.name !== 'CanceledError') {
          console.error('Fehler beim Laden der Kollektionen:', err)
          setError('Fehler beim Laden der Filme.')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchMoviesData()
    return () => controller.abort()
  }, [])

const isEmpty = !loading && !error && 
    (!tmdbCollections || !tmdbCollections.collections || tmdbCollections.collections.length === 0) &&
    (!dbMovies || dbMovies.length === 0)

  return (
    <div className="container">
      {loading && <p>Loading...</p>}
      {error && <h2 className="h3">{error}</h2>}
      {isEmpty && <h2 className="h4">Wir zaubern Dir die Filme gleich herbei!</h2>}
    
      {!loading && !error && (tmdbCollections || dbMovies.length > 0) && (
        <Collections
          genreCollections={tmdbCollections?.collections}
          dbMovies={dbMovies}
          showRecommendations={showRecommendations}
        />
      )}
    </div>
  )
}

export default Movies