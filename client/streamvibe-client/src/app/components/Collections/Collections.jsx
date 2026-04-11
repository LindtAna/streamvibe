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

const groupMoviesByGenre = (movies) => {
  const genreMap = {}

  movies.forEach(movie => {
    movie.genre?.forEach(g => {
      if (!genreMap[g.genre_name]) {
        genreMap[g.genre_name] = []
      }
      genreMap[g.genre_name].push(movie)
    })
  })

  return genreMap
}

const CollectionSection = ({
  title,
  titleId,
  sliderNavigationId,
  sliderParams,
  categoryItems,
  movieItems
}) => {
  // Dynamische Anpassung von Slider abhängig von der Anzahl der Elemente
  const itemCount = categoryItems?.length || movieItems?.length || 0


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
        {categoryItems
          ? categoryItems.map((item, index) => (
            <CategoryCard key={index} {...item} />
          ))
          : movieItems.map((item, index) => (
            <MovieCard
              key={index}
              // title={item.title}
              imgSrc={item.poster_path}
              href={`/movie/${item.id}`}
              // href={`/movie/${item.imdb_id}`}
              rating={{
                value: item.rating ? (item.rating / 2) : 0,
                label: item.rating ? item.rating.toFixed(1) : 'N/A'
              }}
              
             released={item.release_date || null}
             />
          ))}
      </Slider>
    </Section>
  )
}

const Collections = ({ movies = [], tmdbCollections, showRecommendations = false }) => {
  const { auth } = useAuth()
  const axiosPrivate = useAxiosPrivate()
  const [recommendedMovies, setRecommendedMovies] = useState([])
  const [loadingRecommendations, setLoadingRecommendations] = useState(false)
  const [recommendationsLoaded, setRecommendationsLoaded] = useState(false)

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


  // Filmempfehlungen für den angemeldeten Benutzer geladen
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


  const collectionGroups = useMemo(() => {
    // TMDB collections
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

    // DataBase Collections
    if (!movies.length) return []

    const genreGroups = groupMoviesByGenre(movies)
    const items = []

    // Filmempfehlungen am Anfang, falls sie geladen sind.
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

    items.push(
      {
        title: 'Alle Filme',
        movieItems: movies.slice(0, 12),
        sliderParams: categorySliderParams,
      },
      ...Object.entries(genreGroups).map(([genreName, genreMovies]) => ({
        title: genreName,
        movieItems: genreMovies.slice(0, 12),
        sliderParams: categorySliderParams,
      }))
    )

    return [{
      title: 'Filme',
      isActive: true,
      items,
    }]
  }, [movies, auth, tmdbCollections, showRecommendations, recommendedMovies, recommendationsLoaded])

  if (showRecommendations &&
    loadingRecommendations &&
    !recommendationsLoaded) {
    return (
      <div className="container">
        <h5>Filmempfehlungen werden geladen...</h5>
      </div>
    )
  }

  const tabItems = collectionGroups.map((group) => ({
    title: group.title,
    isActive: group.isActive ?? false,
    children: (
      <div className="collections__group">
        <p className="collections__title hidden-mobile">{group.title}</p>
        {group.items.map((collectionItem, index) => {
          const { title, categoryItems, movieItems, sliderParams } = collectionItem
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