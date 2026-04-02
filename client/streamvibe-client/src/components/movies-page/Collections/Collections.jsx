import { useMemo, useState, useEffect } from 'react'
import './Collections.scss'
import Tabs from '../Tabs'
import Section from '../Section'
import SliderNavigation from '../../movie-page/SliderNavigation'
import Slider from '../../movie-page/Slider'
import CategoryCard from '../CategoryCard'
import MovieCard from '../MovieCard'
import getIdFromTitle from '../getIdFromTitle'
import useAuth from '../../../hooks/useAuth'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'

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
  return (
    <Section
      className="collections__section"
      title={title}
      titleId={titleId}
      actions={<SliderNavigation id={sliderNavigationId} mode="tile" />}
      isActionsHiddenOnMobile
    >
      <Slider
        sliderParams={sliderParams}
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
                title={item.title}
                imgSrc={item.poster_path}
                rating={{ 
                  value: item.ranking?.ranking_value || 0, 
                  label: item.ranking?.ranking_name || 'N/A' 
                }}
                href={`/movie/${item.imdb_id}`}
              />
            ))}
      </Slider>
    </Section>
  )
}

const Collections = ({ movies = [], showRecommendations = false }) => {
  const { auth } = useAuth()
  const axiosPrivate = useAxiosPrivate()
  const [recommendedMovies, setRecommendedMovies] = useState([])
  const [loadingRecommendations, setLoadingRecommendations] = useState(false)

  const categorySliderParams = {
    slidesPerView: 4,
    slidesPerGroup: 10,
    spaceBetween: 30,
    breakpoints: {
      0: { slidesPerView: 1.6, slidesPerGroup: 1, spaceBetween: 20 },
      481: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 20 },
      768: { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 20 },
      1024: { spaceBetween: 20 },
      1441: { spaceBetween: 30 },
    },
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
          setRecommendedMovies([])
        } finally {
          setLoadingRecommendations(false)
        }
      }
      fetchRecommendations()
    }
  }, [auth, showRecommendations, axiosPrivate])

  const collectionGroups = useMemo(() => {
    if (!movies.length) return []

    const genreGroups = groupMoviesByGenre(movies)
    
    const items = [
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
    ]

    // Filmempfehlungen für angemeldete Benutzer auf der /movies oben in der Liste
    if (auth && showRecommendations && recommendedMovies.length > 0) {
      items.unshift({
        title: 'Filmempfehlungen',
        movieItems: recommendedMovies,
        sliderParams: categorySliderParams,
      })
    }

    return [{
      title: 'Movies',
      isActive: true,
      items,
    }]
  }, [movies, auth, showRecommendations, recommendedMovies])

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