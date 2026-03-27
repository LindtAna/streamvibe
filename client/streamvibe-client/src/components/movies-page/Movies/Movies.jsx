import { useState, useEffect } from 'react'
import axiosClient from '../../../api/axiosConfig'
import Collections from '../Collections'


const Movies = () => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true)
      setMessage('')
      try {
        const response = await axiosClient.get('/movies')
        setMovies(response.data)
        if (response.data.length === 0) {
          setMessage('Zurzeit sind keine Filmdaten vorhanden.')
        }
      } catch (error) {
        console.error('Fehler beim Laden der Filme:', error)
        setMessage('Fehler beim Laden der Filme.')
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [])

  if (loading) {
    return <p>Loading...</p>
  }

  if (message) {
    return (
      <div className="container">
        <h2 className="h3">{message}</h2>
      </div>
    )
  }

  return <Collections movies={movies} />
}

export default Movies