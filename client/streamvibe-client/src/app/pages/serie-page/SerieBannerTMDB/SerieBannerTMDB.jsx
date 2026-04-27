import { useState, useEffect } from 'react'

import { apiService } from '../../../../api/api'

import SerieBannerCardTMDB from '../SerieBannerCardTMDB'

const SerieBannerTMDB = ({ tmdbId }) => {
  const [serie, setSerie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSerie = async () => {
      try {
        setLoading(true)

        if (tmdbId) {
          const serieData = await apiService.getSerieById(tmdbId)
          setSerie(serieData)
        }
      } catch (err) {
        setError(err.message)
        console.error('Failed to fetch serie:', err)
      } finally {
        setLoading(false)
      }
    }

    if (tmdbId) {
      fetchSerie()
    }
  }, [tmdbId])

  if (loading) {
    return <div className="container">Vorspann läuft...</div>
  }

  if (error) {
    return <div className="container">Error: {error}</div>
  }

  if (!serie) {
    return <div className="container">Popcorn ist fertig, Serie leider nicht</div>
  }

  return <SerieBannerCardTMDB serie={serie} />
}

export default SerieBannerTMDB