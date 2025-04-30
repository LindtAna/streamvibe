import classNames from 'classnames'
import './Badge.scss'
import Icon from '@/components/Icon'

const Badge = (props) => {
    const {
        className,
        // '' (default) | 'red'
        mode = '',
        isBig = false,
        children,
        iconName,
        iconSrc,
        hasFillIcon,
        iconAriaLabel,
    } = props
 return(
    <div className={classNames(className,'badge', {
        [`badge--${mode}`]:mode,
        'bagde--big': isBig,
    })}>
        {iconSrc && <Icon
        className = "badge__icon"
        name={iconName}
        src={iconSrc}
        hasFill = {hasFillIcon}
        ariaLabel ={iconAriaLabel}
         />
        
        }
        <span>{children}</span>
    </div>
 )

}

export default Badge