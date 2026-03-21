import './Badge.scss'
import Icon from '../Icon'

const Badge = ({
  className,
  // '' | 'red'
  mode = '',
  isBig = false,
  children,
  iconName,
  iconSrc,
  hasFillIcon,
  iconAriaLabel,
}) => {
  return (
    <div
      className={classNames(className, 'badge', {
        [`badge--${mode}`]: mode,
        'badge--big': isBig,
      })}
    >
      {iconSrc && (
        <Icon
          className="badge__icon"
          name={iconName}
          src={iconSrc}
          hasFill={hasFillIcon}
          ariaLabel={iconAriaLabel}
        />
      )}
      <span>{children}</span>
    </div>
  )
}

export default Badge