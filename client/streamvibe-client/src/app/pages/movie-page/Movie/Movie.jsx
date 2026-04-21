import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import MovieBannerTMDB from '../MovieBannerTMDB'
import MovieDetailsTMDB from '../MovieDetailsTMDB'
import MovieBanner from '../MovieBanner'
import MovieDetails from '../MovieDetails'

//Fungiert als Wrapper/Controller, um basierend auf der ID-Struktur
//zwischen Filmen aus der eigenen Datenbank und der externen TMDB-API zu unterscheiden
const Movie = () => {
  const { tmdbId, dbId } = useParams()

  const [isDBMovie, setIsDBMovie] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    //Logik zur Ermittlung der Datenquelle:
    //ID mit einem Buchstaben beginnt oder Unterstriche enthält-> internes Format db_movie_1,_2...
    //numerische IDs -> TMDB-IDs
    const checkMovieSource = () => {
      const isDatabase = /^[a-zA-Z]/.test(tmdbId) || tmdbId.includes('_')
      setIsDBMovie(isDatabase)
      setLoading(false)
    }

    checkMovieSource()
  }, [tmdbId, dbId])

  if (loading) {
    return <div className="container">Ladevorgang...</div>
  }

  if (!tmdbId && !dbId) {
    return <div className="container">Film-ID nicht gefunden</div>
  }

  return (
    <>
      {isDBMovie ? (
        <>
        {/* Sektion für Filme aus der eigenen Datenbank */}
          <MovieBanner dbId={dbId} />
          <MovieDetails dbId={dbId} />
        </>
      ) : (
        <>
        {/* Sektion für externe TMDB-Filmdaten */}
          <MovieBannerTMDB tmdbId={tmdbId} />
          <MovieDetailsTMDB tmdbId={tmdbId} />
        </>
      )}
    </>
  )
}

export default Movie