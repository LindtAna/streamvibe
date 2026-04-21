import './Collections.scss'

import { useMemo, useState, useEffect } from 'react'

import useAuth from '../../../hooks/useAuth'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'

import getIdFromTitle from '../getIdFromTitle'

import SliderNavigation from '../SliderNavigation'
import Slider from '../Slider'
import Tabs from '../Tabs'
import CategoryCard from '../CategoryCard'
import MovieCard from '../MovieCard'

import Section from '../../layouts/Section'


//Rendert eine einzelne Sektion innerhalb einer Kollektion,
//bestehend aus einem Titel, einer Navigation und einem Slider für MovieCards
const CollectionSection = ({
  title,
  titleId,
  sliderNavigationId,
  sliderParams,
  categoryItems,
  movieItems
}) => {
  // Dynamische Anpassung von Slider abhängig von der Anzahl der Elemente
  const itemCount = movieItems?.length || 0

//Berechnet die Slider-Konfiguration dynamisch
    //Verhindert den Loop-Modus, wenn weniger Elemente vorhanden sind
    // als gleichzeitig im Viewport angezeigt werden (basierend auf Breakpoints)
  const adjustedSliderParams = useMemo(() => {
    const params = { ...sliderParams }

    const maxSlidesPerView = Math.max(
      params.slidesPerView || 0,
      ...(Object.values(params.breakpoints || {})
        .map(breakpoint => breakpoint.slidesPerView || 0))
    )

    // Bei wenigen Elementen loop deaktivieren
    if (itemCount <= maxSlidesPerView) {
      params.loop = false
    }

    return params
  }, [sliderParams, itemCount])


  return (
    <Section
      className="collections__section"
      title={title}
      titleId={titleId}
      actions={<SliderNavigation id={sliderNavigationId} mode="tile" />}
      isActionsHiddenOnMobile
    >
      <Slider
        sliderParams={adjustedSliderParams}
        navigationTargetElementId={sliderNavigationId}
        isBeyondTheViewPortOnMobileS
      >
           {movieItems.map((item, index) => (
          <MovieCard
            key={index}
            imgSrc={item.poster_path}
            href={item.db_id ? `/db-movie/${item.db_id}` : `/movie/${item.id}`}
            rating={
              item.rating 
                ? { value: item.rating / 2, label: item.rating.toFixed(1) }
                : null
            }
            released={item.release_date || null}
          />
        ))}
      </Slider>
    </Section>
  )
}

//Hauptkomponente zur Darstellung verschiedener Film-Kollektionen
//Verwaltet das Laden von Empfehlungen und die Gruppierung von Daten aus verschiedenen Quellen
const Collections = ({
   dbMovies = [],
  tmdbCollections,
  genreCollections,
  showRecommendations = false
}) => {
  const { auth } = useAuth()
  const axiosPrivate = useAxiosPrivate()

  const [recommendedMovies, setRecommendedMovies] = useState([])
  const [loadingRecommendations, setLoadingRecommendations] = useState(false)
  const [recommendationsLoaded, setRecommendationsLoaded] = useState(false)

  // Standard-Konfiguration für den Slider (Responsives Design)
  const categorySliderParams = {
    slidesPerView: 4,
    slidesPerGroup: 4,
    spaceBetween: 30,
    loop: true, // aktiviert, wird aber dynamisch deaktiviert
    breakpoints: {
      0: { slidesPerView: 1.6, slidesPerGroup: 1, spaceBetween: 20 },
      481: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 20 },
      768: { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 20 },
      1024: { slidesPerView: 4, slidesPerGroup: 4, spaceBetween: 20 },
      1441: { slidesPerView: 4, slidesPerGroup: 4, spaceBetween: 30 },
    }
  }

////FILME-PAGE////
//Lädt personalisierte Filmempfehlungen über die private API-Instanz,
//sofern der Benutzer authentifiziert ist
  useEffect(() => {
    if (auth && showRecommendations) {
      const fetchRecommendations = async () => {
        setLoadingRecommendations(true)
        try {
          const response = await axiosPrivate.get('/recommendedmovies')
          setRecommendedMovies(response.data || [])
        } catch (error) {
          console.error('Fehler beim Laden der Empfehlungen:', error)
          if (error.response?.status === 500) {
            setRecommendedMovies([])
          }
        } finally {
          setLoadingRecommendations(false)
          setRecommendationsLoaded(true)
        }
      }
      fetchRecommendations()
    } else {
      setRecommendedMovies([])
      setRecommendationsLoaded(false)
    }
  }, [auth, showRecommendations])


//transformiert die Rohdaten in eine strukturierte Array-Form.
//Priorisiert "Redaktions-Tipps" und personalisierte Empfehlungen vor den Genre-Listen
  const collectionGroups = useMemo(() => {
 
     if (genreCollections) {
      const items = []
 
      if (dbMovies && dbMovies.length > 0) {
        items.push({
          title: 'Redaktions-Tipps',
          movieItems: dbMovies,
          sliderParams: categorySliderParams,
        })
      }

 // Einmischen der personalisierten Empfehlungen
      if (auth &&
        showRecommendations &&
        recommendationsLoaded &&
        recommendedMovies.length > 0
      ) {
        items.push({
          title: 'Filmempfehlungen',
          movieItems: recommendedMovies,
          sliderParams: categorySliderParams,
        })
      }
 
      // Mapping der TMDB Genre-Kollektionen
      items.push(
        ...genreCollections.map(genreCollection => ({
          title: genreCollection.genre_name,
          movieItems: genreCollection.movies,
          sliderParams: categorySliderParams,
        }))
      )
 
      return [{
        title: 'Filme',
        isActive: true,
        items,
      }]
    }


//HOME PAGE////
    // Trends usw Collections für Home-Page
    if (tmdbCollections) {
      const items = [
        {
          title: 'Trends: Diese Woche',
          movieItems: tmdbCollections.trending,
          sliderParams: categorySliderParams,
        },
        {
          title: 'Beliebt',
          movieItems: tmdbCollections.top_rated,
          sliderParams: categorySliderParams,
        },
        {
          title: 'Im Kino',
          movieItems: tmdbCollections.now_playing,
          sliderParams: categorySliderParams,
        }
      ]

      return [{
        title: 'Filme',
        isActive: true,
        items,
      }]
    }
return []
  }, [genreCollections, tmdbCollections, dbMovies, auth, 
      showRecommendations, recommendedMovies, recommendationsLoaded])

  if (showRecommendations &&
    loadingRecommendations &&
    !recommendationsLoaded) {
    return (
      <div className="container">
        <h5>Filmempfehlungen werden geladen...</h5>
      </div>
    )
  }


//erstellt das Datenmodell für die Tabs-Komponente
//Jedes Tab enthält eine Gruppe von CollectionSections
  const tabItems = collectionGroups.map((group) => ({
    title: group.title,
    isActive: group.isActive ?? false,
    children: (
      <div className="collections__group">
        <p className="collections__title hidden-mobile">{group.title}</p>
        {group.items.map((collectionItem, index) => {
          const { title, categoryItems, movieItems, sliderParams } = collectionItem
          // Erzeugung eindeutiger IDs für Accessibility und Slider-Navigation
          const titleFormatted = `${getIdFromTitle(group.title)}-${getIdFromTitle(title)}`
          const titleId = `${titleFormatted}-title`
          const sliderNavigationId = `${titleFormatted}-slider-navigation`

          return (
            <CollectionSection
              key={index}
              title={title}
              titleId={titleId}
              sliderNavigationId={sliderNavigationId}
              sliderParams={sliderParams}
              categoryItems={categoryItems}
              movieItems={movieItems}
            />
          )
        })}
      </div>
    ),
  }))

  return (
    <Tabs
      className="collections container"
      title="collections"
      inEnableOnlyOnMobile
      items={tabItems}
    />
  )
}

export default Collections