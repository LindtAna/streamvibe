import './Footer.scss'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__inner container">
        <p className="footer__text footer__text--tmdb">
          This product uses the TMDB API but is not endorsed or certified by TMDB
        </p>
        <p className="footer__text footer__text--copyright">
          © LindtAnaDev, 2026
        </p>
      </div>
    </footer>
  )
}

export default Footer