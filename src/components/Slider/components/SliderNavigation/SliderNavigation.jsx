import classNames from 'classnames'
import './SliderNavigation.scss'
import Button from '@/components/Button'
import arrowLeft from '@/assets/icons/arrow-left.svg'
import arrowRight from '@/assets/icons/arrow-right.svg'

const SliderNavigation = (props) => {
    const {
        className,
        id,
        hasPagination = true,
        // '' (default) | 'tile' | 'rounded'
        mode = "",
        //  '' (default) | 'abs-bottom'
        position = '',
        isHiddenMobile,
        buttonMode = 'black-10',
        justifyContent
    } = props

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
                extraAttrs={{ 'data-js-slider-previous-button': '', }}
            />
            {hasPagination && (
                <div className="slider-navigation__pagination"
                    data-js-slider-pagination=""
                />

            )}

            <Button
                className="slider-navigation__arrow-button slider-navigation__arrow-button--next"
                mode="black-10"
                iconSrc={arrowRight}
                label="Next slide"
                isLabelHidden
                extraAttrs={{ 'data-js-slider-next-button': '', }}
            />

        </div>
    )
}

export default SliderNavigation
