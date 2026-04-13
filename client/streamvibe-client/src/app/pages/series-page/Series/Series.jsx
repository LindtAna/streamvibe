import { useState, useEffect } from 'react'

// import axiosClient from '../../../../api/axiosConfig'
import { apiService } from '../../../../api/api'

import CollectionsSeries from '../../../components/CollectionsSeries'

const Series = ({ showRecommendations = false }) => {

  const [collections, setCollections] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    const fetchSeriesData = async () => {
      setLoading(true)
      try {
        const data = await apiService.getSeriesPageCollections({
          signal: controller.signal
        })
        setCollections(data)
      } catch (err) {
        if (err.name !== 'CanceledError') {
          console.error('Fehler beim Laden der Kollektionen:', err)
          setError('Fehler beim Laden der Serien.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchSeriesData()
    return () => controller.abort()
  }, [])


  const isEmpty = !loading && !error && (!collections || !collections.collections || collections.collections.length === 0)

  return (
    <div className="container">
      {loading && <p>Loading...</p>}
      {error && <h2 className="h3">{error}</h2>}
      {isEmpty && <h2 className="h4">Wir zaubern Dir die Serien gleich herbei!n.</h2>}
    
      {!loading && !error && collections && (
        <CollectionsSeries
          genreCollections={collections.collections}
          showRecommendations={showRecommendations}
        />
      )}
    </div>
  )
}

export default Series