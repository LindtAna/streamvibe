import MovieBanner from '@/sections/MovieBanner'
import MovieDetails from '@/sections/MovieDetails'

export const metadata = {
  title: 'Avengers : Endgame',
}

export default () => {
  return (
    <>
      <MovieBanner />
      <MovieDetails />
    </>
  )
}
