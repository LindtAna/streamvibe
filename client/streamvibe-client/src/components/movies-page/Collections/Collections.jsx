import { useMemo } from 'react'
import './Collections.scss'
import Tabs from '../Tabs'
import Section from '../Section'
import SliderNavigation from '../../movie-page/SliderNavigation'
import Slider from '../../movie-page/Slider'
import CategoryCard from '../CategoryCard'
import MovieCard from '../MovieCard'
import getIdFromTitle from '../getIdFromTitle'


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

const Collections = ({ movies = [] }) => {
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

  const collectionGroups = useMemo(() => {
    if (!movies.length) return []

    const genreGroups = groupMoviesByGenre(movies)
    
    return [{
      title: 'Movies',
      isActive: true,
      items: [
        {
          title: 'All Movies',
          movieItems: movies.slice(0, 12),
          sliderParams: categorySliderParams,
        },
        ...Object.entries(genreGroups).map(([genreName, genreMovies]) => ({
          title: genreName,
          movieItems: genreMovies.slice(0, 12),
          sliderParams: categorySliderParams,
        }))
      ],
    }]
  }, [movies])

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