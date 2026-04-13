import './SerieBannerCardTMDB.scss'

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

const SerieBannerCardTMDB = ({ serie, titleId, TitleTag = 'h2' }) => {
  const { auth, setAuth } = useAuth()
  const axiosPrivate = useAxiosPrivate()
  const [isSaved, setIsSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    if (auth && auth.watchlist && serie) {
      // TMDB ID 
      const serieIdStr = String(serie.id)
      setIsSaved(auth.watchlist.includes(serieIdStr))
    }
  }, [auth, serie])

  if (!serie) {
    return null
  }

  const handlePlayClick = () => {
    if (serie.trailer_key) {
      navigate(`/stream/${serie.trailer_key}`, { state: { isMuted } })
    }
  }

  const handleMuteToggle = () => {
    setIsMuted(prevState => !prevState)
  }

  const handleWatchlistClick = async () => {
    if (!auth) {
      return
    }
    setIsLoading(true)
    try {
      const serieIdStr = String(serie.id)
      
      if (isSaved) {
        await axiosPrivate.delete(`/watchlist/${serieIdStr}`)
        setIsSaved(false)
        
        const updatedWatchlist = auth.watchlist.filter(id => id !== serieIdStr)
        setAuth({ ...auth, watchlist: updatedWatchlist })
      } else {
        await axiosPrivate.post(`/watchlist/${serieIdStr}`)
        setIsSaved(true)
        
        const updatedWatchlist = [...(auth.watchlist || []), serieIdStr]
        setAuth({ ...auth, watchlist: updatedWatchlist })
      }
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Merkliste:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Backdrop oder Poster als Hintergrund
  const backgroundImage = serie.backdrop_path || serie.poster_path

  return (
    <div className="serie-banner-card container">
      {/* Blurred background poster */}
      <div
        className="serie-banner-card__background"
        style={{ backgroundImage: `url(${backgroundImage})` }}
        aria-hidden="true"
      />

      {/* Gradient overlay */}
      <div className="serie-banner-card__overlay" aria-hidden="true" />

      {/* Content container */}
      <div className="serie-banner-card__content container">
        {/* Left side - poster */}
        <div className="serie-banner-card__left">
          <img
            className="serie-banner-card__poster"
            src={serie.poster_path}
            alt={serie.title}
            loading="eager"
          />
        </div>

        {/* Right side - Serie info */}
        <div className="serie-banner-card__right">
          <TitleTag className="serie-banner-card__title h1" id={titleId}>
            {serie.title}
          </TitleTag>

          {serie.trailer_key && (
            <Button
              className="serie-banner-card__play-button"
              iconName="play"
              iconSrc={playIcon}
              label="Trailer abspielen"
              hasFillIcon
              onClick={handlePlayClick}
            />
          )}

          <div className="serie-banner-card__actions">
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
              iconName={isMuted ? 'mute' : 'volume'}
              iconSrc={isMuted ? muteIcon : volumeIcon}
              label={isMuted ? 'Audio anschalten' : 'Audio auschalten'}
              isLabelHidden
              onClick={handleMuteToggle}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SerieBannerCardTMDB