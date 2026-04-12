import './CollectionsSeries.scss'

import { useMemo, useState, useEffect } from 'react'

import useAuth from '../../../hooks/useAuth'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'

import getIdFromTitle from '../getIdFromTitle'

import SliderNavigation from '../SliderNavigation'
import Slider from '../Slider'
import Tabs from '../Tabs'
import CategoryCard from '../CategoryCard'
import SerieCard from '../SerieCard'

import Section from '../../layouts/Section'

const groupSeriesByGenre = (series) => {
  const genreMap = {}

  series.forEach(serie => {
    serie.genre?.forEach(g => {
      if (!genreMap[g.genre_name]) {
        genreMap[g.genre_name] = []
      }
      genreMap[g.genre_name].push(serie)
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
  serieItems
}) => {
  // Dynamische Anpassung von Slider abhängig von der Anzahl der Elemente
  const itemCount = categoryItems?.length || serieItems?.length || 0


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
          : serieItems.map((item, index) => (
            <SerieCard
              key={index}
              // title={item.title} //optional
              imgSrc={item.poster_path}
              href={`/serie/${item.id}`}
              rating={{
                value: item.rating ? (item.rating / 2) : 0,
                label: item.rating ? item.rating.toFixed(1) : 'N/A'
              }}

              released={item.first_air_date || null}
            />
          ))}
      </Slider>
    </Section>
  )
}

const CollectionsSeries = ({
  series = [],
  tmdbCollections,
  genreCollections,
  showRecommendations = false
}) => {
  const { auth } = useAuth()
  const axiosPrivate = useAxiosPrivate()
  const [recommendedSeries, setRecommendedSeries] = useState([])
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


  // Serieempfehlungen für den angemeldeten Benutzer geladen
useEffect(() => {
    if (auth && showRecommendations) {
      const fetchRecommendations = async () => {
        setLoadingRecommendations(true)
        try {
          const response = await axiosPrivate.get('/recommendedseries')
          setRecommendedSeries(response.data || [])
        } catch (error) {
          console.error('Fehler beim Laden der Empfehlungen:', error)
          if (error.response?.status === 500) {
            setRecommendedSeries([])
          }
        } finally {
          setLoadingRecommendations(false)
          setRecommendationsLoaded(true)
        }
      }
      fetchRecommendations()
    } else {
      setRecommendedSeries([])
      setRecommendationsLoaded(false)
    }
  }, [auth, showRecommendations])


  const collectionGroups = useMemo(() => {
   // Beliebt, Bestbewertet Serie Collections für Home-Page
    if (tmdbCollections) {
      const items = [
        {
          title: 'Beliebt',
          serieItems: tmdbCollections.trending || [],
          sliderParams: categorySliderParams,
        },
        {
          title: 'Bestbewertet',
          serieItems: tmdbCollections.top_rated || [],
          sliderParams: categorySliderParams,
        }
      ]

      return [{
        title: 'Serien',
        isActive: true,
        items,
      }]
    }

    //Genres-Collection TMDB für Serie-Page
    if (genreCollections) {
      const items = genreCollections.map(genreCollection => ({
        title: genreCollection.genre_name,
        serieItems: genreCollection.series,
        sliderParams: categorySliderParams,
      }))

      if (auth && showRecommendations && recommendationsLoaded && recommendedSeries.length > 0) {
        items.unshift({
          title: 'Serieempfehlungen',
          serieItems: recommendedSeries,
          sliderParams: categorySliderParams,
        })
      }

      return [{
        title: 'Serien',
        isActive: true,
        items,
      }]
    }

    // DataBase Collections
    if (!series.length) return []

    const genreGroups = groupSeriesByGenre(series)
    const items = []

    // Seriempfehlungen am Anfang, falls sie geladen sind
    if (auth && showRecommendations && recommendationsLoaded && recommendedSeries.length > 0) {
      items.push({
        title: 'Serieempfehlungen',
        serieItems: recommendedSeries,
        sliderParams: categorySliderParams,
      })
    }

    items.push(
      {
        title: 'Admins Choice',
        serieItems: series.slice(0, 12),
        sliderParams: categorySliderParams,
      },
      ...Object.entries(genreGroups).map(([genreName, genreSeries]) => ({
        title: genreName,
        serieItems: genreSeries.slice(0, 12),
        sliderParams: categorySliderParams,
      }))
    )

    return [{
      title: 'Serien',
      isActive: true,
      items,
    }]

  }, [series, auth, 
    tmdbCollections,
    genreCollections, 
    showRecommendations,
    recommendedSeries, recommendationsLoaded])


  if (showRecommendations && loadingRecommendations && !recommendationsLoaded) {
    return (
      <div className="container">
        <h5>Serieempfehlungen werden geladen...</h5>
      </div>
    )
  }

  if (collectionGroups.length === 0) return null

  const tabItems = collectionGroups.map((group) => ({
    title: group.title,
    isActive: group.isActive ?? false,
    children: (
      <div className="collections__group">
        <p className="collections__title hidden-mobile">{group.title}</p>
        {group.items.map((collectionItem, index) => {
          const { title, categoryItems, serieItems, sliderParams } = collectionItem
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
              serieItems={serieItems}
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

export default CollectionsSeries