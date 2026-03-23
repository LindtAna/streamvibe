import './PersonCard.scss'

const PersonCard = ({ imgSrc, imgAlt, name, subtitle }) => {
  const hasBody = Boolean(name || subtitle)

  return (
    <div className="person-card">
      <img
        className="person-card__image"
        src={imgSrc}
        alt={imgAlt || name || ''}
        title={imgAlt || name}
        loading="lazy"
      />
      {hasBody && (
        <div className="person-card__body">
          {name && <h4 className="person-card__name">{name}</h4>}
          {subtitle && <p className="person-card__subtitle">{subtitle}</p>}
        </div>
      )}
    </div>
  )
}

export default PersonCard