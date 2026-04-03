import './Movie.scss'
import MovieBanner from '../MovieBanner'
import MovieDetails from '../MovieDetails'
import { useParams } from 'react-router-dom'

const Movie = () => {

  const { imdbId } = useParams()
  return (
     <>
      <MovieBanner imdbId={imdbId} />
      <MovieDetails imdbId={imdbId} />
    </>
  )
}

export default Movie