import { useEffect, useState } from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import Movies from '../components/movies-page/Movies'
import axios from 'axios'

const Recommended = () => {
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState()
    const axiosPrivate = useAxiosPrivate()

    useEffect(() => {
        const fetchRecommendedMovies = async () => {
            setLoading(true)
            setMessage("")

            try{
                const response = await axiosPrivate.get('/recommendedmovies')
                setMovies(response.data)

            }catch(error){
                console.error('Fehler beim Laden der Filme:', error)
            } finally{
                setLoading(false)
            }
        }
        fetchRecommendedMovies()
    }, [])

  return (
    <>
    {loading ? (
        <h2>Loading...</h2>
    ):(
        <Movies movies = {movies} message= {message} />
    )}
    </>
  )
}

export default Recommended