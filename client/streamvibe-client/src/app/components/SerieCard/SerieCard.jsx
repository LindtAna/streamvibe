import './SerieCard.scss'

import { Link } from 'react-router-dom'

import Badge from '../Badge'
import RatingView from '../RatingView'


const SerieCard = ({
  title,
  imgSrc,
  released,
  rating,
  href = '/serie',
}) => {
  return (
    <Link className="serie-card" to={href} title={title}>
      <h3 className="visually-hidden">{title}</h3>

      <img
        className="serie-card__image"
        src={imgSrc}
        alt={title}
        loading="lazy"
      />

      <div className="serie-card__body">
      
        {rating && (
          <Badge className="serie-card__rating-badge">
            <RatingView {...rating} />
          </Badge>
        )}

        {Boolean(released) && (
          <Badge className="serie-card__released-badge">
            <time
              className="serie-card__released-badge-label"
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

export default SerieCard