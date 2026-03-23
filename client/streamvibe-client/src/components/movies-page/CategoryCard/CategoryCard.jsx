import './CategoryCard.scss'
import Badge from '../../movie-page/Badge'
import Icon from '../../movie-page/Icon'

import arrowRightSrc from '../../../assets/icons/arrow-right.svg'

const CategoryCard = ({ title, images = [], badge, href = '/movies' }) => {
  return (
    <a className="category-card" href={href}>
      <div className="category-card__images">
        {images.map((imgSrc, index) => (
          <img
            key={index}
            className="category-card__image"
            src={imgSrc}
            alt=""
            loading="lazy"
          />
        ))}
      </div>
      <div className="category-card__body">
        <h3 className="category-card__title">
          {badge && (
            <Badge className="category-card__badge" mode="red" isBig>
              {badge}
            </Badge>
          )}
          <span>{title}</span>
        </h3>
        <Icon
          className="category-card__icon"
          name="arrow-right"
          src={arrowRightSrc}
        />
      </div>
    </a>
  )
}

export default CategoryCard