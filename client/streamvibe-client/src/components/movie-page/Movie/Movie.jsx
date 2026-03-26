import './Movie.scss'
import MovieBanner from '../MovieBanner'
import MovieDetails from '../MovieDetails'
import AddReview from '../AddReview'

const Movie = ({imdbId}) => {
  return (
     <>
      <MovieBanner imdbId={imdbId} />
      <MovieDetails imdbId={imdbId} />
      {/* <AddReview /> */}
    </>
  )
}

export default Movie