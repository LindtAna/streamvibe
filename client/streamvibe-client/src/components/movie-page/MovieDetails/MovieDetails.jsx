import Slider from '../Slider'
import SliderNavigation from '../SliderNavigation'
import PersonCard from '../PersonCard'
import ReviewCard from '../ReviewCard'
import Button from '../Button'
import Icon from '../Icon'
import Tags from '../Tags'
import Ratings from '../Ratings'
import AddReview from '../AddReview'

import { apiService } from '../../../api/api'
import './MovieDetails.scss'
import { useState, useEffect } from 'react'

import CalenderIcon from '../../../assets/icons/calender.svg'
import TranslateIcon from '../../../assets/icons/translate.svg'
import PlusIcon from '../../../assets/icons/plus.svg'
import StarIcon from '../../../assets/icons/star.svg'
import GenresIcon from '../../../assets/icons/genres.svg'

import Actor1 from '../../../assets/test-images/actor1.jpg'
import Actor2 from '../../../assets/test-images/actor2.jpg'


const castItems = [
  { imgSrc: Actor1, imgAlt: 'Actor Test' },
  { imgSrc: Actor2, imgAlt: 'Actress Test' },
  { imgSrc: Actor1, imgAlt: 'Actor Test' },
  { imgSrc: Actor2, imgAlt: 'Actress Test' },
  { imgSrc: Actor1, imgAlt: 'Actor Test' },
  { imgSrc: Actor2, imgAlt: 'Actress Test' },
  { imgSrc: Actor1, imgAlt: 'Actor Test' },
  { imgSrc: Actor2, imgAlt: 'Actress Test' },
  { imgSrc: Actor1, imgAlt: 'Actor Test' },
  { imgSrc: Actor2, imgAlt: 'Actress Test' },
  { imgSrc: Actor1, imgAlt: 'Actor Test' },
  { imgSrc: Actor2, imgAlt: 'Actress Test' },
  { imgSrc: Actor1, imgAlt: 'Actor Test' },
  { imgSrc: Actor2, imgAlt: 'Actress Test' },
  { imgSrc: Actor1, imgAlt: 'Actor Test' },
  { imgSrc: Actor2, imgAlt: 'Actress Test' },
]

const MovieDetails = ({ imdbId, seasons }) => {
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
        const movies = await apiService.getMovies()

        if (imdbId) {
          const foundMovie = movies.find(m => m.imdb_id === imdbId)
          setMovie(foundMovie || movies[0])
          setUserReviews(foundMovie?.user_reviews || [])
        } else {
          setMovie(movies[0])
          setUserReviews(movies[0]?.user_reviews || [])
        }
      } catch (err) {
        setError(err.message)
        console.error('Failed to fetch movie:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMovie()
  }, [imdbId])

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

  // IMDb-Bewertung (falls vorhanden) extrahieren
  const imdbRating = movie.ranking?.ranking_value || 0
  const streamVibeRating = movie.ranking?.ranking_value || 0
  const genreNames = movie.genre?.map(g => g.genre_name) || []

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
                {movie.admin_review || 'No description available.'}
              </p>
            </div>
          </div>
        </div>

        {/* Cast */}
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
            {castItems.map((item, index) => (
              <PersonCard key={index} {...item} />
            ))}
          </Slider>
        </div>

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
              imdbId={imdbId}
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
            </Slider>)
            : (
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
                <time className="h6" dateTime="2019">2019</time>
              </div>
            </div>

            {/* Languages */}
            <div className="movie-details__group">
              <h3 className="movie-details__title">
                <Icon iconName="translate" src={TranslateIcon} />
                <span>Originalsprache</span>
              </h3>
              <Tags items={['English']} />
            </div>

            {/* Ratings */}
            <div className="movie-details__group">
              <h3 className="movie-details__title">
                <Icon iconName="star" src={StarIcon} />
                <span>Ratings</span>
              </h3>
              <Ratings
                items={[
                  { title: 'IMDb', ratingValue: imdbRating },
                  { title: 'StreamVibe', ratingValue: streamVibeRating },
                ]}
              />
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
                name="Anthony Russo"
                subtitle="From USA"
                imgSrc={Actor2}
              />
            </div>

            {/* Composer */}
            <div className="movie-details__group">
              <h3 className="movie-details__title">Composer</h3>
              <PersonCard
                name="Alan Silvestri"
                subtitle="From USA"
                imgSrc={Actor1}
              />
            </div>
          </div>
        </div>
      </aside>
    </section>
  )
}

export default MovieDetails