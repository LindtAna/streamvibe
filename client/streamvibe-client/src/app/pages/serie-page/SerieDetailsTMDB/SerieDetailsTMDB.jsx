import './SerieDetailsTMDB.scss'

import { useState, useEffect } from 'react'
import { apiService } from '../../../../api/api'

import Slider from '../../../components/Slider'
import SliderNavigation from '../../../components/SliderNavigation'
import Button from '../../../components/Button'
import Icon from '../../../components/Icon'
import Tags from '../../../components/Tags'

import PersonCardTMDB from '../../movie-page/PersonCardTMDB'
import ReviewCard from '../../movie-page/ReviewCard'
import Ratings from '../../movie-page/Ratings'

import AddReview from '../../../modals/AddReview'

import CalenderIcon from '../../../../assets/icons/calender.svg'
import TranslateIcon from '../../../../assets/icons/translate.svg'
import PlusIcon from '../../../../assets/icons/plus.svg'
import StarIcon from '../../../../assets/icons/star.svg'
import GenresIcon from '../../../../assets/icons/genres.svg'


const SerieDetailsTMDB = ({ tmdbId, seasons }) => {
  const [serie, setSerie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userReviews, setUserReviews] = useState([])
  const [isReviewOpen, setIsReviewOpen] = useState(false)

  const titleId = 'serie-details-title'
  const castSliderNavigationId = 'serie-cast-slider-navigation'

  useEffect(() => {
    const fetchSerie = async () => {
      try {
        setLoading(true)
        const serieData = await apiService.getSerieById(tmdbId)
        
        setSerie(serieData)
        setUserReviews(serieData?.user_reviews || [])
      } catch (err) {
        setError(err.message)
        console.error('Failed to fetch serie:', err)
      } finally {
        setLoading(false)
      }
    }

    if (tmdbId) {
      fetchSerie()
    }
  }, [tmdbId])

  const handleReviewAdded = (newReview) => {
    setUserReviews((prev) => [...prev, newReview])
  }

  if (loading) {
    return <div className="container">Loading serie details...</div>
  }

  if (error) {
    return <div className="container">Error: {error}</div>
  }

  if (!serie) {
    return <div className="container">No serie found</div>
  }


  const releaseYear = serie.first_air_date ? new Date(serie.first_air_date).getFullYear() : 'N/A'
  
  const tmdbRating = serie.rating ? parseFloat(serie.rating.toFixed(1)) : 0
  
  const genreNames = serie.genres?.map(g => g.name) || []
  
  const originalLanguage = serie.original_language?.toUpperCase() || 'N/A'

  return (
    <section className="serie-details container" aria-labelledby={titleId}>
      <h2 className="visually-hidden" id={titleId}>
        Detailed serie information
      </h2>

      <div className="serie-details__main">
  
        {/* Description */}
        <div className="serie-details__panel serie-details__panel--description-tablet-order">
          <div className="serie-details__group">
            <h3 className="serie-details__title">Handlung</h3>
            <div className="serie-details__description">
              <p>
                {serie.overview || 'Keine Beschreibung verfügbar.'}
              </p>
            </div>
          </div>
        </div>

        {/* Cast */}
        {serie.cast && serie.cast.length > 0 && (
          <div className="serie-details__panel">
            <header className="serie-details__panel-header">
              <h3 className="serie-details__title">Schauspieler</h3>
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
              {serie.cast.map((castMember, index) => (
                <PersonCardTMDB
                  key={index}
                  imgSrc={castMember.profile_path || ''}
                  imgAlt={`${castMember.name} als ${castMember.character}`}
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
      <aside className="serie-details__info">
        <div className="serie-details__panel">
          <div className="serie-details__groups">
            {/* Released Year */}
            <div className="serie-details__group">
              <h3 className="serie-details__title">
                <Icon iconName="calender" src={CalenderIcon} />
                <span>Veröffentlicht</span>
              </h3>
              <div className="serie-details__description">
                <time className="h6" dateTime={releaseYear.toString()}>
                  {releaseYear}
                </time>
              </div>
            </div>

             {/* Status */}
            <div className="serie-details__group">
              <h3 className="serie-details__title">
                <Icon iconName="genres" src={GenresIcon} />
                <span>Status</span>
              </h3>
              <div className="serie-details__description">
                  {serie.status || 'N/A'}
              </div>
            </div>
{/* Network / Sender */}
            <div className="serie-details__group">
              <h3 className="serie-details__title">
                <Icon iconName="genres" src={GenresIcon} />
                <span>Sender</span>
              </h3>
              <div className="serie-details__description">
      
                  {serie.network && serie.network.logo_path ? (
                    <img 
                      src={serie.network.logo_path} 
                      alt={serie.network.name} 
                      title={serie.network.name}
                      style={{ maxHeight: '30px', objectFit: 'contain' }} 
                    />
                  ) : (
                    serie.network?.name || 'N/A'
                  )}
              </div>
            </div>

            {/* Languages */}
            <div className="serie-details__group">
              <h3 className="serie-details__title">
                <Icon iconName="translate" src={TranslateIcon} />
                <span>Originalsprache</span>
              </h3>
              <Tags items={[originalLanguage]} />
            </div>

            {/* Ratings */}
            <div className="serie-details__group">
              <h3 className="serie-details__title">
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
              <div className="serie-details__group">
                <h3 className="serie-details__title">
                  <Icon iconName="genres" src={GenresIcon} />
                  <span>Genres</span>
                </h3>
                <Tags items={genreNames} />
              </div>
            )}

            {/* Creator */}
            {serie.creator && (
              <div className="serie-details__group">
                <h3 className="serie-details__title">Regie</h3>
                <PersonCardTMDB
                  name={serie.creator.name}
                  imgSrc={serie.creator.profile_path || ''}
                />
              </div>
            )}

          </div>
        </div>
      </aside>
    </section>
  )
}

export default SerieDetailsTMDB