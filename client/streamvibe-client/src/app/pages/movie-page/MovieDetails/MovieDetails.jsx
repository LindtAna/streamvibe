import './MovieDetails.scss'

import { useState, useEffect } from 'react'
import { apiService } from '../../../../api/api'

import Button from '../../../components/Button'
import Icon from '../../../components/Icon'
import Tags from '../../../components/Tags'
import PersonCard from '../PersonCard'

import CalenderIcon from '../../../../assets/icons/calender.svg'
import TranslateIcon from '../../../../assets/icons/translate.svg'
// import PlusIcon from '../../../../assets/icons/plus.svg'
import GenresIcon from '../../../../assets/icons/genres.svg'

const MovieDetails = ({ dbId, seasons }) => {
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const titleId = 'movie-details-title'

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true)
        if (dbId) {
          const movieData = await apiService.getDBMovieById(dbId)
          setMovie(movieData)
        }
      } catch (err) {
        setError(err.message)
        console.error('Failed to fetch movie:', err)
      } finally {
        setLoading(false)
      }
    }
    if (dbId) {
      fetchMovie()
    }
  }, [dbId])


  if (loading) {
    return <div className="container">Loading movie details...</div>
  }

  if (error) {
    return <div className="container">Error: {error}</div>
  }

  if (!movie) {
    return <div className="container">No movie found</div>
  }

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : 'N/A'

  const genreNames = movie.genre?.map(g => g.genre_name) || []

  const originalLanguage = movie.original_language || 'N/A'

  return (
    <section className="movie-details container" aria-labelledby={titleId}>
      <h2 className="visually-hidden" id={titleId}>
        Detaillierte Filminformationen
      </h2>

      <div className="movie-details__main">
        {/* Description */}
        <div className="movie-details__panel movie-details__panel--description-tablet-order">
          <div className="movie-details__group">
            <h3 className="movie-details__title">Handlung</h3>
            <div className="movie-details__description">
              <p>
                {movie.overview || 'Keine Beschreibung verfügbar.'}
              </p>
            </div>
          </div>
        </div>

        {/* Admin Review */}
        {movie.admin_review && (
          <div className="movie-details__panel">
            <div className="movie-details__group">
              <h3 className="movie-details__title">Redaktions-Review</h3>
              <div className="movie-details__description">
                <p>{movie.admin_review}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar info */}
      <aside className="movie-details__info">
        <div className="movie-details__panel">
          <div className="movie-details__groups">
            {/* Released Year */}
            <div className="movie-details__group">
              <h3 className="movie-details__title">
                <Icon iconName="calender" src={CalenderIcon} />
                <span>Veröffentlicht</span>
              </h3>
              <div className="movie-details__description">
                <time className="h6" dateTime={releaseYear.toString()}>
                  {releaseYear}
                </time>
              </div>
            </div>

            {/* Sprache */}
            <div className="movie-details__group">
              <h3 className="movie-details__title">
                <Icon iconName="translate" src={TranslateIcon} />
                <span>Originalsprache</span>
              </h3>
              <Tags items={[originalLanguage]} />
            </div>


            {/* Genres */}
            <div className="movie-details__group">
              <h3 className="movie-details__title">
                <Icon iconName="genres" src={GenresIcon} />
                <span>Genres</span>
              </h3>
              <Tags items={genreNames} />
            </div>

            {/* Director */}
            <div className="movie-details__group">
              <h3 className="movie-details__title">Regie</h3>
              <PersonCard
                name={movie.director.name}
                imgSrc={movie.director.profile_path || ''}
              />
            </div>

            {/* Screenwriter */}
            <div className="movie-details__group">
              <h3 className="movie-details__title">Drehbuch</h3>
              <PersonCard
                name={movie.screenwriter.name}
                imgSrc={movie.screenwriter.profile_path || ''}
              />
            </div>
          </div>
        </div>
      </aside>
    </section>
  )
}

export default MovieDetails