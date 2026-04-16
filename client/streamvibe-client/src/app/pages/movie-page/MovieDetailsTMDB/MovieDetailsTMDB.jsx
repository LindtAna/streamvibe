import './MovieDetailsTMDB.scss'

import { useState, useEffect } from 'react'
import { apiService } from '../../../../api/api'

import Slider from '../../../components/Slider'
import SliderNavigation from '../../../components/SliderNavigation'
import Button from '../../../components/Button'
import Icon from '../../../components/Icon'
import Tags from '../../../components/Tags'

import PersonCardTMDB from '../PersonCardTMDB'
import ReviewCard from '../ReviewCard'
import Ratings from '../Ratings'

import AddReview from '../../../modals/AddReview'

import CalenderIcon from '../../../../assets/icons/calender.svg'
import TranslateIcon from '../../../../assets/icons/translate.svg'
import PlusIcon from '../../../../assets/icons/plus.svg'
import StarIcon from '../../../../assets/icons/star.svg'
import GenresIcon from '../../../../assets/icons/genres.svg'


const MovieDetailsTMDB = ({ tmdbId, seasons }) => {
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userReviews, setUserReviews] = useState([])
  const [isReviewOpen, setIsReviewOpen] = useState(false)

  const titleId = 'movie-details-title'
  const castSliderNavigationId = 'movie-cast-slider-navigation'

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true)
        const movieData = await apiService.getMovieById(tmdbId)
        
        setMovie(movieData)
        setUserReviews(movieData?.user_reviews || [])
      } catch (err) {
        setError(err.message)
        console.error('Failed to fetch movie:', err)
      } finally {
        setLoading(false)
      }
    }

    if (tmdbId) {
      fetchMovie()
    }
  }, [tmdbId])

  const handleReviewAdded = (newReview) => {
    setUserReviews((prev) => [...prev, newReview])
  }

  if (loading) {
    return <div className="container">Loading movie details...</div>
  }

  if (error) {
    return <div className="container">Error: {error}</div>
  }

  if (!movie) {
    return <div className="container">No movie found</div>
  }

  // Формат года из даты выхода
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'
  
  // Рейтинг TMDB (округлённый до 1 знака)
  const tmdbRating = movie.rating ? parseFloat(movie.rating.toFixed(1)) : 0
  
  // Названия жанров
  const genreNames = movie.genres?.map(g => g.name) || []
  
  // Язык оригинала
  const originalLanguage = movie.original_language || 'N/A'

  return (
    <section className="movie-details container" aria-labelledby={titleId}>
      <h2 className="visually-hidden" id={titleId}>
        Detailed movie information
      </h2>

      <div className="movie-details__main">
        {/* Seasons (for series only) */}
        {seasons && (
          <div className="movie-details__panel movie-details__panel--order-seasons">
            <div className="movie-details__group movie-details__group--big-gap-y">
              <h3 className="h4">Seasons and Episodes</h3>
              {seasons}
            </div>
          </div>
        )}

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

        {/* Cast */}
        {movie.cast && movie.cast.length > 0 && (
          <div className="movie-details__panel">
            <header className="movie-details__panel-header">
              <h3 className="movie-details__title">Schauspieler</h3>
              <SliderNavigation
                id={castSliderNavigationId}
                hasPagination={false}
                mode="rounded"
                buttonMode="black-08"
              />
            </header>
            <Slider
              navigationTargetElementId={castSliderNavigationId}
              sliderParams={{
                slidesPerView: 'auto',
                spaceBetween: 10,
                breakpoints: {
                  1024: {
                    slidesPerView: 'auto',
                    spaceBetween: 20,
                    allowTouchMove: false,
                  },
                },
              }}
            >
              {movie.cast.map((castMember, index) => (
                <PersonCardTMDB
                  key={index}
                  imgSrc={castMember.profile_path || ''}
                  imgAlt={castMember.name}
                  name={castMember.name}
                  hideNameText={true}
                />
              ))}
            </Slider>
          </div>
        )}

        {/* Reviews */}
        <div className="movie-details__panel movie-details__panel--large-gap-y">
          <header className="movie-details__panel-header">
            <h3 className="movie-details__title">Bewertungen</h3>
            
            <Button
              mode="black-08"
              iconSrc={PlusIcon}
              iconName="plus"
              label="Bewertung hinzufügen"
              onClick={() => setIsReviewOpen(true)}
            />
          </header>

          <AddReview
            tmdbId={tmdbId}
            onReviewAdded={handleReviewAdded}
            isOpen={isReviewOpen}
            onClose={() => setIsReviewOpen(false)}
          />

          {userReviews.length > 0 ? (
            <Slider
              navigationMode="rounded"
              isNavigationHiddenMobile={false}
              sliderParams={{
                slidesPerView: 2,
                slidesPerGroup: 2,
                breakpoints: {
                  0: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                    spaceBetween: 16,
                  },
                  1024: {
                    slidesPerView: 2,
                    slidesPerGroup: 2,
                    allowTouchMove: false,
                    spaceBetween: 20,
                  },
                },
              }}
            >
              {userReviews.map((review, index) => (
                <ReviewCard
                  key={review.review_id || index}
                  name={review.user_name}
                  subtitle={`Aus ${review.country}`}
                  description={review.text}
                  ratingValue={review.rating}
                />
              ))}
            </Slider>
          ) : (
            <div className="movie-details__no-reviews">
              <p>Noch keine Bewertungen. Sei der Erste!</p>
            </div>
          )}
        </div>
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

            {/* Languages */}
            <div className="movie-details__group">
              <h3 className="movie-details__title">
                <Icon iconName="translate" src={TranslateIcon} />
                <span>Originalsprache</span>
              </h3>
              <Tags items={[originalLanguage]} />
            </div>

            {/* Ratings */}
            <div className="movie-details__group">
              <h3 className="movie-details__title">
                <Icon iconName="star" src={StarIcon} />
                <span>Ratings</span>
              </h3>
              <Ratings
                items={[
                  { title: 'TMDB', ratingValue: tmdbRating },
                ]}
              />
            </div>

            {/* Genres */}
            {genreNames.length > 0 && (
              <div className="movie-details__group">
                <h3 className="movie-details__title">
                  <Icon iconName="genres" src={GenresIcon} />
                  <span>Genres</span>
                </h3>
                <Tags items={genreNames} />
              </div>
            )}

            {/* Director */}
            {movie.director && (
              <div className="movie-details__group">
                <h3 className="movie-details__title">Regie</h3>
                <PersonCardTMDB
                  name={movie.director.name}
                  imgSrc={movie.director.profile_path || ''}
                />
              </div>
            )}

            {/* Composer */}
            {movie.composer && (
              <div className="movie-details__group">
                <h3 className="movie-details__title">Composer</h3>
                <PersonCardTMDB
                  name={movie.composer.name}
                  imgSrc={movie.composer.profile_path || ''}
                />
              </div>
            )}
          </div>
        </div>
      </aside>
    </section>
  )
}

export default MovieDetailsTMDB