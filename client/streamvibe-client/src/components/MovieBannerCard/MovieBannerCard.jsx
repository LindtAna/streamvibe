import './MovieBannerCard.scss'
import Button from '../Button'
import playIcon from '../../assets/icons/play.svg'
import plusIcon from '../../assets/icons/plus.svg'
import likeIcon from '../../assets/icons/like.svg'
import volumeIcon from '../../assets/icons/volume.svg'
import classNames from 'classnames'

const MovieBannerCard = ({
  movie,
  titleId,
  TitleTag = 'h2',
}) => {

  if (!movie) {
    return null
  }

  const handlePlayClick = () => {
    if (movie.youtube_id) {
      window.open(`https://www.youtube.com/watch?v=${movie.youtube_id}`, '_blank')
    }
  }

  return (
    <div className="movie-banner-card container">
      {/* Blurred background poster */}
      <div
        className="movie-banner-card__background"
        style={{ backgroundImage: `url(${movie.poster_path})` }}
        aria-hidden="true"
      />

      {/* Gradient overlay */}
      <div className="movie-banner-card__overlay" aria-hidden="true" />

      {/* Content container */}
      <div className="movie-banner-card__content container">
        {/* Left side - poster */}
        <div className="movie-banner-card__left">
          <img
            className="movie-banner-card__poster"
            src={movie.poster_path}
            alt={movie.title}
            loading="eager"
          />
        </div>

        {/* Right side - Movie info */}
        <div className="movie-banner-card__right">
          <TitleTag className="movie-banner-card__title h1" id={titleId}>
            {movie.title}
          </TitleTag>


          <Button
            className="movie-banner-card__play-button"
            iconName="play"
            iconSrc={playIcon}
            label="Play Now"
            hasFillIcon
            onClick={handlePlayClick}
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
        </div>
      </div>
    </div>
  )
}

export default MovieBannerCard
