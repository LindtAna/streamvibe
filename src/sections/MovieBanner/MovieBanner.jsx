import MovieBannerCard from "@/components/MovieBannerCard"
import AvenrgsImgSrc from '@/assets/images/movie-banner/avengers-battle.jpg'

const MovieBanner = () => {
    const titleId = 'movie-banner-title'

    return(
        <section className="container"
        aria-labelledby={titleId}
        >
            <MovieBannerCard
            title= "Avengers : Endgame"
            titleId={titleId}
            TitleTag = "h1"
            description = "Whatever It Takes! Part of the journey is the end."
            imgSrc = {AvenrgsImgSrc}
            isSmallPaddingY 
             />


        </section>
    )
}

export default MovieBanner