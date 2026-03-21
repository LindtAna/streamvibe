import './MovieBannerCard.scss'
import Button from '../Button'
import playIcon from '../../assets/icons/play.svg'
import plusIcon from '../../assets/icons/plus.svg'
import likeIcon from '../../assets/icons/like.svg'
import volumeIcon from '../../assets/icons/volume.svg'

const MovieBannerCard = ({
  title,
  titleId,
  TitleTag = 'h2',
  description,
  imgSrc,
  isSmallPaddingY = false,
}) => {
  return (
    <div className="movie-banner-card">
      <img
        className="movie-banner-card__image"
        src={imgSrc}
        alt={title}
      />
      <div
        className={classNames('movie-banner-card__inner', {
          'movie-banner-card__inner--small-padding-y': isSmallPaddingY,
        })}
      >
        <div className="movie-banner-card__body">
          <TitleTag className="movie-banner-card__title h3" id={titleId}>
            {title}
          </TitleTag>
          {description && (
            <div className="movie-banner-card__description hidden-mobile">
              <p>{description}</p>
            </div>
          )}
        </div>
        <footer className="movie-banner-card__footer">
          <Button
            className="movie-banner-card__play-button"
            iconName="play"
            iconSrc={playIcon}
            label="Play Now"
            hasFillIcon
          />
          <div className="movie-banner-card__actions">
            <Button
              mode="black-06"
              iconName="plus"
              iconSrc={plusIcon}
              label="Add to playlist"
              isLabelHidden
            />
            <Button
              mode="black-06"
              iconName="like"
              iconSrc={likeIcon}
              label="Like"
              isLabelHidden
            />
            <Button
              mode="black-06"
              iconName="volume"
              iconSrc={volumeIcon}
              label="Mute"
              isLabelHidden
            />
          </div>
        </footer>
      </div>
    </div>
  )
}

export default MovieBannerCard