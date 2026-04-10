import './Button.scss'

import classNames from 'classnames'

import Icon from '../Icon'

const Button = ({
  className,
  type = 'button',
  href,
  target,
  // '' | 'transparent' | 'black-10' | 'black-08' | 'black-06'
  mode = '',
  label,
  isLabelHidden = false,
  iconName,
  iconSrc,
  iconPosition = 'before',
  hasFillIcon,
  extraAttrs,
  onClick,
}) => {
  const isLink = href !== undefined
  const Component = isLink ? 'a' : 'button'
  const linkProps = isLink ? { href, target } : {}
  const buttonProps = !isLink ? { type } : {}
  const title = isLabelHidden ? label : undefined

  const iconComponent = iconSrc && (
    <Icon
      className="button__icon"
      name={iconName}
      src={iconSrc}
      hasFill={hasFillIcon}
    />
  )

  return (
    <Component
      className={classNames(className, 'button', {
        [`button--${mode}`]: mode,
      })}
      title={title}
      aria-label={title}
      onClick={onClick}
      {...linkProps}
      {...buttonProps}
      {...extraAttrs}
    >
      {iconPosition === 'before' && iconComponent}
      {!isLabelHidden && <span className="button__label">{label}</span>}
      {iconPosition === 'after' && iconComponent}
    </Component>
  )
}

export default Button