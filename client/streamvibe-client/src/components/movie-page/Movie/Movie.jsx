import './Movie.scss'
// import MovieBanner from '../MovieBanner'
// import MovieDetails from '../MovieDetails'
import MovieBannerTMDB from '../MovieBannerTMDB'
import MovieDetailsTMDB from '../MovieDetailsTMDB'
import { useParams } from 'react-router-dom'

const Movie = () => {

  // const { imdbId } = useParams()
  const { tmdbId } = useParams()
  return (
     <>
      {/* <MovieBanner imdbId={imdbId} /> */}
      {/* <MovieDetails imdbId={imdbId} /> */}
      <MovieBannerTMDB tmdbId={tmdbId} />
      <MovieDetailsTMDB tmdbId={tmdbId} />
    </>
  )
}

export default Movie