import Movies from '../../movies-page/Movies'
import Hero from '../Hero'

const HomePage = () => {
  return (
    <>
      <Hero>
  <p>
    Entdecke Millionen von Filmen & Serien. <br />
    Du kannst auch Deine eigenen Merklisten erstellen, <br />
    um die Inhalte, die Du ansehen möchtest, leichter zu finden.
  </p>
</Hero>
      <Movies showRecommendations={false} />
    </>
  )
}

export default HomePage