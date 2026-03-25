import './Icon.scss'
import classNames from 'classnames'

const Icon = ({
  className,
  name,
  src,
  hasFill = false,
  ariaLabel,
}) => {
  if (src) {
    return (
      <img
        src={src}
        className={classNames(className, 'icon')}
        alt={ariaLabel || ''}
        aria-label={ariaLabel}
        style={{
          fill: hasFill ? 'currentColor' : 'none',
          stroke: hasFill ? 'none' : 'currentColor',
        }}
      />
    )
  }

  return (
    <span className={classNames(className, 'icon')} aria-label={ariaLabel}>
      <svg
        fill={hasFill ? 'currentColor' : 'none'}
        stroke={hasFill ? 'none' : 'currentColor'}
      >
        <use href={`/assets/icons.svg#${name}`} />
      </svg>
    </span>
  )
}

export default Icon