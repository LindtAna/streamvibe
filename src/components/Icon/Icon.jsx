import './Icon.scss'
import classNames from 'classnames'
import { Icon as MinistaIcon } from 'minista'

const Icon = (props) => {
    const {
      className,
      name,
      src,
      hasFill = false,
      ariaLabel,
    } = props

    if (src) {
      return (
        <img
          src={src}
          className={classNames(className, 'icon')}
          alt=""
          style={{  
            fill: hasFill ? 'currentColor' : 'none',
            stroke: hasFill ? 'none' : 'currentColor'
          }}
        />
      )
    }
  
    return (
      <span
        className={classNames(className, 'icon')}
        aria-label={ariaLabel}
      >
        <MinistaIcon
          iconId={name}
          fill={hasFill ? 'currentColor' : 'none'}
          stroke={hasFill ? 'none' : 'currentColor'}
        />
      </span>
    )
  }
  
  export default Icon
  