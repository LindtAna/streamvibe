import { Link } from 'react-router-dom'
import './Logo.scss'
import classNames from 'classnames'
import logoImgSrc from '../../../assets/logo.svg'

const Logo = ({ className, loading = 'lazy' }) => {
  const title = 'Home'

  return (
    <Link
      className={classNames(className, 'logo')}
      to="/"
      title={title}
      aria-label={title}
    >
      <img
        className="logo__image"
        src={logoImgSrc}
        alt=""
        width={199}
        height={60}
        loading={loading}
      />
    </Link>
  )
}

export default Logo