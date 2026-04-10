import { useState, useEffect } from 'react'

import axiosClient from '../../../../api/axiosConfig'

import Collections from '../../../components/Collections'

const Movies = ({ showRecommendations = false }) => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()


    const fetchMovies = async () => {
      setLoading(true)
      try {
        const response = await axiosClient.get('/movies', {
          signal: controller.signal,
        })
        setMovies(response.data)
      } catch (err) {
        if (err.name !== 'CanceledError') {
          console.error('Fehler beim Laden der Filme:', err)
          setError('Fehler beim Laden der Filme.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()

    return () => controller.abort()
  }, [])

  const isEmpty = !loading && !error && movies.length === 0

  return (
    <div className="container">
      {loading && <p>Loading...</p>}
      {error && <h2 className="h3">{error}</h2>}
      {/* {isEmpty && <h2 className="h3">Zurzeit sind keine Filmdaten vorhanden.</h2>} */}
      {!loading && !error && !isEmpty && (
        <Collections movies={movies} showRecommendations={showRecommendations} />
      )}
    </div>
  )
}

export default Movies