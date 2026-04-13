import { useState, useEffect } from 'react'

// import axiosClient from '../../../../api/axiosConfig'
import { apiService } from '../../../../api/api'

import Collections from '../../../components/Collections'

const Movies = ({ showRecommendations = false }) => {

  const [collections, setCollections] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    const fetchMoviesData = async () => {
      setLoading(true)
      try {
        // Для страницы Movies используем новый эндпоинт с жанрами
        const data = await apiService.getMoviesPageCollections({
          signal: controller.signal
        })
        setCollections(data)
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


  const isEmpty = !loading && !error && (!collections || !collections.collections || collections.collections.length === 0)

  return (
    <div className="container">
      {loading && <p>Loading...</p>}
      {error && <h2 className="h3">{error}</h2>}
      {isEmpty && <h2 className="h4">Wir zaubern Dir die Filme gleich herbei!</h2>}
    
      {!loading && !error && collections && (
        <Collections
          genreCollections={collections.collections}
          showRecommendations={showRecommendations}
        />
      )}
    </div>
  )
}

export default Movies