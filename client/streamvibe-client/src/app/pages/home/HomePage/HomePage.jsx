import { useState, useEffect } from 'react'

import { apiService } from '../../../../api/api'

import Hero from '../../../components/Hero'
import Collections from '../../../components/Collections'
import CollectionsSeries from '../../../components/CollectionsSeries'

const HomePage = () => {

  const [movieCollections, setMovieCollections] = useState(null)
  const [seriesCollections, setSeriesCollections] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    const fetchHomeData = async () => {
      setLoading(true)
      try {
        //  Film- und Serien-Collections gleichzeitig heruntedgeladet
        const [moviesData, seriesData] = await Promise.all([
          apiService.getHomeCollections({ signal: controller.signal }),
          apiService.getHomeCollectionsSeries({ signal: controller.signal })
        ])
        
        setMovieCollections(moviesData)
        setSeriesCollections(seriesData)
      } catch (err) {
        if (err.name !== 'CanceledError') {
          console.error('Fehler beim Laden der Kollektionen:', err)
          setError('Fehler beim Laden der Daten.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchHomeData()
    return () => controller.abort()
  }, [])

  const isMoviesEmpty = !movieCollections || Object.values(movieCollections).every(arr => arr.length === 0)
  const isSeriesEmpty = !seriesCollections || Object.values(seriesCollections).every(arr => arr.length === 0)
  const isEmpty = !loading && !error && isMoviesEmpty && isSeriesEmpty

  return (
    <>
      <Hero>
        <p>
          Entdecke Millionen von Filmen & Serien. <br />
          Du kannst auch Deine eigenen Merklisten erstellen, <br />
          um die Inhalte, die Du ansehen möchtest, leichter zu finden.
        </p>
      </Hero>


      <div className="container">
        {loading && <p>Loading...</p>}
        {error && <h2 className="h3">{error}</h2>}
        {isEmpty && <h2 className="h3">Zurzeit sind keine Filmdaten vorhanden.</h2>}

        {!loading && !error && movieCollections && !isMoviesEmpty && (
          <Collections
            tmdbCollections={movieCollections}
            showRecommendations={false}
          />
        )}

        {!loading && !error && seriesCollections && !isSeriesEmpty && (
          <CollectionsSeries
            tmdbCollections={seriesCollections}
            showRecommendations={false}
          />
        )}

      </div>
    </>
  )
}

export default HomePage