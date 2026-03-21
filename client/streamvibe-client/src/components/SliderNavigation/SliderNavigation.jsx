import './SliderNavigation.scss'
import Button from '../Button'
import arrowLeft from '../../assets/icons/arrow-left.svg'
import arrowRight from '../../assets/icons/arrow-right.svg'
import classNames from 'classnames'

// prevBtnRef, nextBtnRef, paginationRef передаются из Slider
// чтобы Swiper мог найти DOM-элементы навигации.
// Для внешней навигации (navigationTargetElementId) рефы не нужны —
// Swiper сам ищет элементы по data-js-* атрибутам в DOM.

const SliderNavigation = ({
  className,
  id,
  hasPagination = true,
  // '' | 'tile' | 'rounded'
  mode = '',
  // '' | 'abs-bottom'
  position = '',
  isHiddenMobile,
  buttonMode = 'black-10',
  justifyContent,
  // Рефы для Swiper (передаются из <Slider>)
  prevBtnRef,
  nextBtnRef,
  paginationRef,
}) => {
  return (
    <div
      className={classNames(className, 'slider-navigation', {
        [`slider-navigation--${mode}`]: mode,
        [`slider-navigation--${position}`]: position,
        [`slider-navigation--${justifyContent}`]: justifyContent,
        'hidden-mobile': isHiddenMobile,
      })}
      id={id}
      // data-атрибут нужен если используется внешняя навигация через JS-модуль
      // (например на страницах без React). В React-Slider он не нужен, но
      // оставляем для совместимости с navigationTargetElementId.
      data-js-slider-navigation=""
    >
      <Button
        className="slider-navigation__arrow-button slider-navigation__arrow-button--previous"
        mode={buttonMode}
        iconSrc={arrowLeft}
        label="Previous slide"
        isLabelHidden
        extraAttrs={{
          'data-js-slider-previous-button': '',
          ref: prevBtnRef,
        }}
      />

      {hasPagination && (
        <div
          className="slider-navigation__pagination"
          data-js-slider-pagination=""
          ref={paginationRef}
        />
      )}

      <Button
        className="slider-navigation__arrow-button slider-navigation__arrow-button--next"
        mode={buttonMode}
        iconSrc={arrowRight}
        label="Next slide"
        isLabelHidden
        extraAttrs={{
          'data-js-slider-next-button': '',
          ref: nextBtnRef,
        }}
      />
    </div>
  )
}

export default SliderNavigation