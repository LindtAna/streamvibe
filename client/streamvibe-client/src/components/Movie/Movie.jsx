import './Movie.scss'
import MovieBanner from '../MovieBanner'
import MovieDetails from '../MovieDetails'

const Movie = ({imdbId}) => {
  return (
     <>
      <MovieBanner imdbId={imdbId} />
      <MovieDetails imdbId={imdbId} />
    </>
  )
}

export default Movie