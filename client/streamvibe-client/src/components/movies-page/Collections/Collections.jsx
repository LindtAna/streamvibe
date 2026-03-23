import './Collections.scss'
import Tabs from '../Tabs'
import Section from '../Section'
import SliderNavigation from '../../movie-page/SliderNavigation'
import Slider from '../../movie-page/Slider'
import CategoryCard from '../CategoryCard'
import MovieCard from '../MovieCard'
import getIdFromTitle from '../getIdFromTitle'
import collectionGroups from '../collectionGroups'

const CollectionSection = ({ title, titleId, sliderNavigationId, sliderParams, categoryItems, movieItems }) => {
  return (
    <Section
      className="collections__section"
      title={title}
      titleId={titleId}
      actions={
        <SliderNavigation
          id={sliderNavigationId}
          mode="tile"
        />
      }
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
              <MovieCard key={index} {...item} />
            ))}
      </Slider>
    </Section>
  )
}

//Collections 

const Collections = () => {
  const tabItems = collectionGroups.map((group) => ({
    title: group.title,
    isActive: group.isActive ?? false,
    children: (
      <div className="collections__group">
        {/* Плашка с названием группы*/}
        <p className="collections__title hidden-mobile">{group.title}</p>

        {group.items.map((collectionItem, index) => {
          const { title, categoryItems, movieItems, sliderParams } = collectionItem

          // Уникальные id для aria и для Swiper navigationTargetElementId
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