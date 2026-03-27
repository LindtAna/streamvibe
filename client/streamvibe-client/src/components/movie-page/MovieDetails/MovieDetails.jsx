import Slider from '../Slider'
import SliderNavigation from '../SliderNavigation'
import PersonCard from '../PersonCard'
import ReviewCard from '../ReviewCard'
import Button from '../Button'
import Icon from '../Icon'
import Tags from '../Tags'
import Ratings from '../Ratings'

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

const reviewItems = [
  {
    name: 'Dennis Donohue',
    subtitle: 'From USA',
    description:
      'Whereas Infinity War was a pulsating caffiene rush from beginning to end that could leave one shaking from the adrenaline dump, Endgame was an emotional walk home after a long night out.',
    ratingValue: 5,
  },
  {
    name: 'Klaus Martin',
    subtitle: 'From Germany',
    description:
      'Nicht mehr die Avengers aus den Hit- und Marvel Comics. Mit Emotiönchen versehen, weil mitfühlen so gut zum Zeitgeist passt.',
    ratingValue: 3,
  },
  {
    name: 'Dennis Donohue',
    subtitle: 'From USA',
    description:
      'Whereas Infinity War was a pulsating caffiene rush from beginning to end that could leave one shaking from the adrenaline dump, Endgame was an emotional walk home after a long night out.',
    ratingValue: 5,
  },
  {
    name: 'Klaus Martin',
    subtitle: 'From Germany',
    description:
      'Nicht mehr die Avengers aus den Hit- und Marvel Comics. Mit Emotiönchen versehen, weil mitfühlen so gut zum Zeitgeist passt.',
    ratingValue: 3,
  },
]


const MovieDetails = ({ imdbId, seasons }) => {
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
        } else {
          setMovie(movies[0])
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
                {/* The surviving members of the Avengers and their allies attempt to
                reverse Thanos's actions in Infinity War which erased half of all
                life in the universe. */}
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
              href="/"
            />
          </header>
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
            {reviewItems.map((item, index) => (
              <ReviewCard key={index} {...item} />
            ))}
          </Slider>
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
                  { title: 'IMDb', ratingValue: 4.5 },
                  { title: 'StreamVibe', ratingValue: 4 },
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