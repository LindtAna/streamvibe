import './SliderNavigation.scss'

import classNames from 'classnames'

import Button from '../Button'

import arrowLeft from '../../../assets/icons/arrow-left.svg'
import arrowRight from '../../../assets/icons/arrow-right.svg'

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