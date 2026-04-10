import './PersonCardTMDB.scss'

const PersonCardTMDB = ({ imgSrc, imgAlt, name, subtitle }) => {
  const hasBody = Boolean(name || subtitle)

  // Fallback-Bild wenn kein Bild vorhanden
  const defaultImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="150" viewBox="0 0 100 150"%3E%3Crect fill="%23333" width="100" height="150"/%3E%3Ctext x="50" y="75" font-family="Arial" font-size="14" fill="%23999" text-anchor="middle"%3EKein Bild%3C/text%3E%3C/svg%3E'

  return (
    <div className="person-card" title={name || imgAlt || ''}>
      <img
        className="person-card__image"
        src={imgSrc || defaultImage}
        alt={imgAlt || name || ''}
        loading="lazy"
        onError={(e) => {
          e.target.src = defaultImage
        }}
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

export default PersonCardTMDB