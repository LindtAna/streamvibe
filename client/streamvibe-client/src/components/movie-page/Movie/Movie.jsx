import './Movie.scss'
import MovieBanner from '../MovieBanner'
import MovieDetails from '../MovieDetails'
import AddReview from '../AddReview'
import { useParams } from 'react-router-dom'

const Movie = () => {

  const { imdbId } = useParams()
  return (
     <>
      <MovieBanner imdbId={imdbId} />
      <MovieDetails imdbId={imdbId} />
      {/* <AddReview /> */}
    </>
  )
}

export default Movie