import { useParams } from 'react-router-dom'


import SerieBannerTMDB from '../SerieBannerTMDB'
import SerieDetailsTMDB from '../SerieDetailsTMDB'


const Serie = () => {

  const { tmdbId } = useParams()
  return (
     <>
      <SerieBannerTMDB tmdbId={tmdbId} />
      <SerieDetailsTMDB tmdbId={tmdbId} />
    </>
  )
}

export default Serie