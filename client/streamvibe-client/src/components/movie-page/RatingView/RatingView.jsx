import './RatingView.scss'
import starsUnfilledImgSrc from '../../../assets/icons/stars_unfilled.svg'
import starsFilledImgSrc from '../../../assets/icons/stars_filled.svg'

const RatingView = ({ value = 5, label }) => {
  const ariaLabel = `Rating: ${value} stars`

  return (
    <div
      className="rating-view"
      aria-label={ariaLabel}
      title={ariaLabel}
      style={{ '--ratingViewValue': value }}
    >
      <div className="rating-view__stars">
        <img
          className="rating-view__stars-unfilled"
          src={starsUnfilledImgSrc}
          width={98}
          height={18}
          alt=""
        />
        <img
          className="rating-view__stars-filled"
          src={starsFilledImgSrc}
          width={98}
          height={18}
          alt=""
        />
      </div>
      {label && <div className="rating-view__label">{label}</div>}
    </div>
  )
}

export default RatingView