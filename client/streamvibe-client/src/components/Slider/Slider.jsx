import { useEffect, useId, useRef } from 'react'
import 'swiper/css'
import './Slider.scss'
import SliderNavigation from '../SliderNavigation'
import Swiper from 'swiper'
import { Navigation, Pagination, Scrollbar } from 'swiper/modules'
import classNames from 'classnames'

const defaultSliderParams = {
  slidesPerView: 5,
  slidesPerGroup: 5,
  spaceBetween: 30,
  loop: true,
  breakpoints: {
    0: { slidesPerView: 2, slidesPerGroup: 1, spaceBetween: 20 },
    481: { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 20 },
    768: { slidesPerView: 4, slidesPerGroup: 4, spaceBetween: 20 },
    1024: { spaceBetween: 20 },
    1441: { spaceBetween: 30 },
  },
}

const Slider = ({
  children,
  navigationTargetElementId = null,
  sliderParams = defaultSliderParams,
  isBeyondTheViewPortOnMobileS,
  hasScrollbar = true,
  // '' | 'abs-bottom'
  navigationPosition = '',
  navigationMode,
  isNavigationHiddenMobile = true,
  navigationJustifyContent,
}) => {
  const swiperRef = useRef(null)
  const prevBtnRef = useRef(null)
  const nextBtnRef = useRef(null)
  const paginationRef = useRef(null)
  const scrollbarRef = useRef(null)
  const swiperInstanceRef = useRef(null)

  // Генерируем уникальный id для внутренней навигации
  // (когда navigationTargetElementId не передан)
  const internalNavId = useId()

  const childrenArray = Array.isArray(children) ? children : [children]

  useEffect(() => {
    if (!swiperRef.current) return

    // Если навигация внешняя — ищем элементы по id
    let prevEl = prevBtnRef.current
    let nextEl = nextBtnRef.current
    let paginationEl = paginationRef.current
    let scrollbarEl = scrollbarRef.current

    if (navigationTargetElementId) {
      const navRoot = document.getElementById(navigationTargetElementId)
      if (navRoot) {
        prevEl = navRoot.querySelector('[data-js-slider-previous-button]')
        nextEl = navRoot.querySelector('[data-js-slider-next-button]')
        paginationEl = navRoot.querySelector('[data-js-slider-pagination]')
      }
    }

    swiperInstanceRef.current = new Swiper(swiperRef.current, {
      ...sliderParams,
      modules: [Navigation, Pagination, Scrollbar],
      navigation: { prevEl, nextEl },
      pagination: {
        el: paginationEl,
        bulletClass: 'slider-navigation__pagination-bullet',
        bulletActiveClass: 'is-active',
      },
      scrollbar: {
        el: scrollbarEl,
        dragClass: 'slider__scrollbar-drag',
      },
    })

    return () => {
      swiperInstanceRef.current?.destroy(true, true)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  // Намеренно пустые deps — Swiper инициализируется один раз после mount.
  // Если нужна реинициализация при смене sliderParams — добавьте их в deps
  // и вызывайте destroy + reinit.

  return (
    <div
      className={classNames('slider', {
        'slider--beyond-the-viewport-on-mobile-s': isBeyondTheViewPortOnMobileS,
      })}
    >
      {/* Swiper container */}
      <div className="slider__swiper swiper" ref={swiperRef}>
        <ul className="slider__list swiper-wrapper">
          {childrenArray.map((slide, index) => (
            <li className="slider__item swiper-slide" key={index}>
              {slide}
            </li>
          ))}
        </ul>
      </div>

      {/* Внутренняя навигация (когда нет внешней) */}
      {!navigationTargetElementId && (
        <SliderNavigation
          className="slider__navigation"
          mode={navigationMode}
          position={navigationPosition}
          isHiddenMobile={isNavigationHiddenMobile}
          justifyContent={navigationJustifyContent}
          prevBtnRef={prevBtnRef}
          nextBtnRef={nextBtnRef}
          paginationRef={paginationRef}
        />
      )}

      {hasScrollbar && (
        <div
          className="slider__scrollbar visible-mobile"
          ref={scrollbarRef}
        />
      )}
    </div>
  )
}

export default Slider