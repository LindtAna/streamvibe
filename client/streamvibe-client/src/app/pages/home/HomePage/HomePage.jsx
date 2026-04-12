import { useState, useEffect } from 'react'

import { apiService } from '../../../../api/api'

import Hero from '../../../components/Hero'
import Collections from '../../../components/Collections'

const HomePage = () => {

  const [collections, setCollections] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    const fetchHomeData = async () => {
      setLoading(true)
      try {
        // home-collections endpoint
        const data = await apiService.getHomeCollections({
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

    fetchHomeData()
    return () => controller.abort()
  }, [])

  const isEmpty = !loading && !error && (!collections || Object.values(collections).every(arr => arr.length === 0))
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
        {!loading && !error && collections && (
          <Collections
            tmdbCollections={collections}
            showRecommendations={false}
          />
        )}
      </div>
    </>
  )
}

export default HomePage