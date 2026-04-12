import './MovieCard.scss'

import { Link } from 'react-router-dom'

import Badge from '../Badge'
import RatingView from '../RatingView'

import ClockIcon from '../../../assets/icons/clock.svg'

const MovieCard = ({
  title,
  imgSrc,
  duration,
  views,
  released,
  rating,
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

        {Boolean(released) && (
          <Badge className="movie-card__released-badge">
            <time
              className="movie-card__released-badge-label"
              dateTime={released}
            >
              {released}
            </time>
          </Badge>
        )}
      </div>
    </Link>
  )
}

export default MovieCard