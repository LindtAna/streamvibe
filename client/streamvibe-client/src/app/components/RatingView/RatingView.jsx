import './RatingView.scss'

import { useState } from 'react'

import starsUnfilledImgSrc from '../../../assets/icons/stars_unfilled.svg'
import starsFilledImgSrc from '../../../assets/icons/stars_filled.svg'

const RatingView = ({ value = 5, label, onChange, isInteractive = false }) => {
  const ariaLabel = `Rating: ${value} stars`

  const [hoverValue, setHoverValue] = useState(0)

  const handleStarClick = (starIndex) => {
    if (!isInteractive || !onChange) return
    onChange(starIndex + 1)
  }

  const handleKeyDown = (e, starIndex) => {
    if (!isInteractive || !onChange) return

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onChange(starIndex + 1)
    }
  }

  if (isInteractive) {
    return (
      <div
        className="rating-view rating-view--interactive"
        aria-label={ariaLabel}
        title={ariaLabel}
        style={{ '--ratingViewValue': value }}
        role="radiogroup"
        aria-labelledby="rating-label"
      >
        <div className="rating-view__stars rating-view__stars--clickable">
          {[0, 1, 2, 3, 4].map((starIndex) => (
            <button
              key={starIndex}
              type="button"
              className="rating-view__star-button"
              onClick={() => handleStarClick(starIndex)}
              onKeyDown={(e) => handleKeyDown(e, starIndex)}
              onMouseEnter={() => isInteractive && setHoverValue(starIndex + 1)}
              onMouseLeave={() => isInteractive && setHoverValue(0)}
              aria-label={`${starIndex + 1} star${starIndex !== 0 ? 's' : ''}`}
              role="radio"
              aria-checked={value === starIndex + 1}
              tabIndex={value === starIndex + 1 ? 0 : -1}
            >
              <svg
                className={`rating-view__star ${(hoverValue || value) > starIndex ? 'rating-view__star--filled' : ''}`}
                width="20"
                height="19"
                viewBox="0 0 20 19"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 0L12.2451 6.90983H19.5106L13.6327 11.1803L15.8779 18.0902L10 13.8197L4.12215 18.0902L6.36729 11.1803L0.489435 6.90983H7.75486L10 0Z"
                />
              </svg>
            </button>
          ))}
        </div>
        {label && <div className="rating-view__label">{label}</div>}
        {value === 0 && (
          <div className="rating-view__hint">Klicke auf einen Stern, um zu bewerten</div>
        )}
      </div>
    )
  }

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