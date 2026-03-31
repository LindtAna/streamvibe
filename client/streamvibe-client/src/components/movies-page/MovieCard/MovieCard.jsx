import './MovieCard.scss'
import Badge from '../../movie-page/Badge'
import RatingView from '../../movie-page/RatingView'
import { Link } from 'react-router-dom'

import CatalogIcon from '../../../assets/icons/catalog.svg'
import EyeIcon from '../../../assets/icons/eye.svg'
import ClockIcon from '../../../assets/icons/clock.svg'

const MovieCard = ({
  title,
  imgSrc,
  duration,
  views,
  released,
  rating,
  season,
  href = '/movie',
}) => {
  return (
    <Link className="movie-card" to={href} title={title}>
      <h3 className="visually-hidden">{title}</h3>

      <img
        className="movie-card__image"
        src={imgSrc}
        alt={title}
        loading="lazy"
      />

      <div className="movie-card__body">
        {duration && (
          <Badge iconName="clock" iconSrc={ClockIcon} iconAriaLabel="Duration" hasFillIcon>
            {duration}
          </Badge>
        )}

        {rating && (
          <Badge className="movie-card__rating-badge">
            <RatingView {...rating} />
          </Badge>
        )}

        {views && (
          <Badge iconName="eye" iconSrc={EyeIcon} iconAriaLabel="Views" hasFillIcon>
            {views}
          </Badge>
        )}

        {released && (
          <Badge className="movie-card__released-badge">
            Released at{' '}
            <time
              className="movie-card__released-badge-label"
              dateTime={released.dateTime}
            >
              {released.label}
            </time>
          </Badge>
        )}
      </div>
    </Link>
  )
}

export default MovieCard