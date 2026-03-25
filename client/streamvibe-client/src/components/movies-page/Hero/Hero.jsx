import './Hero.scss'
import playImgSrc from '../../../assets/play.svg'

const Hero = () => {
  const titleId = 'hero-title'

  return (
    <section className="hero" aria-labelledby={titleId}>
  <div className="hero__banner">
        <img
          className="hero__play-button-image"
          alt=""
          src={playImgSrc}
        />
      <div className="hero__description h4">
        <p>
          Entdecke Millionen von Filmen & Serien. <br/>
          Du kannst auch Deine eigenen Merklisten erstellen, <br/>um die Inhalte, die Du ansehen möchtest, leichter zu finden.
        </p>
      </div>
    </div>
</section>

  )
}

export default Hero