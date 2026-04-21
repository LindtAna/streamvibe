import './MovieBannerCard.scss'

import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

import useAuth from '../../../../hooks/useAuth'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'

import Button from '../../../components/Button'

import playIcon from '../../../../assets/icons/play.svg'
import plusIcon from '../../../../assets/icons/plus.svg'
import deleteIcon from '../../../../assets/icons/delete.svg'
import likeIcon from '../../../../assets/icons/like.svg'
import volumeIcon from '../../../../assets/icons/volume.svg'
import muteIcon from '../../../../assets/icons/mute.svg'


const MovieBannerCard = ({
  movie,
  titleId,
  TitleTag = 'h2',
}) => {

  const { auth, setAuth } = useAuth()
  const axiosPrivate = useAxiosPrivate()
  const [isSaved, setIsSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    if (auth && auth.watchlist && movie) {
      // Для фильмов из БД используем db_id
      const movieIdStr = String(movie.db_id || movie.id)
      setIsSaved(auth.watchlist.includes(movieIdStr))
    }
  }, [auth, movie])
 
  if (!movie) {
    return null
  }

  const handlePlayClick = () => {
    const videoId = movie.youtube_id || movie.trailer_key
    if (videoId) {
      navigate(`/stream/${videoId}`, { state: { isMuted } })
    }
  }

  const handleMuteToggle = () => {
    setIsMuted(prevState => !prevState)
  }

  const handleWatchlistClick = async () => {
    if (!auth) {
      // Button ist nur für eingeloggte Benutzer sichtbar
      return
    }
    setIsLoading(true)
     try {
      // Используем db_id для фильмов из БД, id для TMDB
      const movieIdStr = String(movie.db_id || movie.id)
      
      if (isSaved) {
        await axiosPrivate.delete(`/watchlist/${movieIdStr}`)
        setIsSaved(false)
        
        const updatedWatchlist = auth.watchlist.filter(id => id !== movieIdStr)
        setAuth({ ...auth, watchlist: updatedWatchlist })
      } else {
        await axiosPrivate.post(`/watchlist/${movieIdStr}`)
        setIsSaved(true)
        
        const updatedWatchlist = [...(auth.watchlist || []), movieIdStr]
        setAuth({ ...auth, watchlist: updatedWatchlist })
      }
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Merkliste:', error)
    } finally {
      setIsLoading(false)
    }
  }
 
  // Используем poster_path как для БД, так и для TMDB
  const backgroundImage = movie.backdrop_path || movie.poster_path

  return (
    <div className="movie-banner-card container">
      {/* Blurred background poster */}
      <div
        className="movie-banner-card__background"
        // style={{ backgroundImage: `url(${movie.poster_path})` }}
         style={{ backgroundImage: `url(${backgroundImage})` }}
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

           {(movie.youtube_id || movie.trailer_key) && (
            <Button
              className="movie-banner-card__play-button"
              iconName="play"
              iconSrc={playIcon}
              label="Trailer abspielen"
              hasFillIcon
              onClick={handlePlayClick}
            />
          )}
          
          <div className="movie-banner-card__actions">
              {auth && (
              <Button
                mode="black-06"
                iconName={isSaved ? 'delete' : 'plus'}
                iconSrc={isSaved ? deleteIcon : plusIcon}
                label={
                  isSaved
                    ? 'Aus Merkliste entfernen'
                    : 'Zur Merkliste hinzufügen'
                }
                isLabelHidden
                onClick={handleWatchlistClick}
                extraAttrs={{ disabled: isLoading }}
              />
            )}
            <Button
              mode="black-06"
              iconName="like"
              iconSrc={likeIcon}
              label="Like"
              isLabelHidden
            />
            <Button
              mode="black-06"
              iconName={isMuted ? "mute" : "volume"}
              iconSrc={isMuted ? muteIcon : volumeIcon}
              label={isMuted ? "Audio anschalten" : "Audio auschalten"}
              isLabelHidden
              onClick={handleMuteToggle}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieBannerCard
