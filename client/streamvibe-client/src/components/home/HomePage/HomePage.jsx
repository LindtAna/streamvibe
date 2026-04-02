import Movies from '../../movies-page/Movies'
import Hero from '../Hero'

const HomePage = () => {
  return (
    <>
      <Hero />
      <Movies showRecommendations={false} />
    </>
  )
}

export default HomePage