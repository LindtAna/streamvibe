import { Image } from 'minista'
import './MovieCard.scss'
import Badge from '@/components/Badge'
import RatingView from '@/components/RatingView'

import CatalogIcon from '@/assets/icons/catalog.svg'
import EyeIcon from '@/assets/icons/eye.svg'
import ClockIcon from '@/assets/icons/clock.svg'



const MovieCard = (props) => {
    const {
        title,
        imgSrc,
        duration,
        views,
        released,
        rating,
        season,
        href = '/movie',

    } = props

    return (
        <a
            className="movie-card"
            href={href}
            title={title}
        >
            <h3 className="visually-hidden">{title}</h3>

            <Image
                className="movie-card__image"
                src={imgSrc}
            />
            <div className="movie-card__body">
                {duration && (
                    <Badge
                        iconName="clock"
                        iconSrc={ClockIcon}
                        iconAriaLabel="Duration"
                        hasFillIcon
                    >
                        {duration}
                    </Badge>
                )}

                {season && (
                  <Badge
                    iconName="catalog"
                    iconSrc={CatalogIcon}
                    hasFillIcon
                  >
                    {season}
                  </Badge>
                )}
        
                {rating && (
                    <Badge className="movie-card__rating-badge">
                        <RatingView {...rating} />
                    </Badge>
                )}

                {views && (
                    <Badge
                        iconName="eye"
                        iconSrc={EyeIcon}
                        iconAriaLabel="Views"
                        hasFillIcon
                    >
                        {views}
                    </Badge>
                )}
                {released && (
                    <Badge
                        className="movie-card__released-badge"
                    >
                        Released at <time className="movie-card__released-badge-label" datetime={released.dateTime}>{released.label}</time>
                    </Badge>
                )}
            </div>
        </a>
    )
}


export default MovieCard