import Slider from '@/components/Slider'
import './MoviesBanner.scss'
import MovieBannerCard from '@/components/MovieBannerCard'
import AvengrEndGameImgSrc from '@/assets/images/movie-banner/avengers-endgame.jpg'
import InterstellImgSrc from '@/assets/images/movie-banner/interstellar.jpg'
import StarWarsJediImgSrc from '@/assets/images/movie-banner/star-wars-jedi.jpg'
import WolfChildrImgSrc from '@/assets/images/movie-banner/wolf-children.jpg'


const MoviesBanner = () => {
    const titleId = 'movies-banner-title'

    const movieCards = [
        {
            title: "Avengers : Endgame",
            description: "With the help of remaining allies, the Avengers must assemble once more in order to undo Thanos's actions and undo the chaos to the universe, no matter what consequences may be in store, and no matter who they face... Avenge the fallen.",
            imgSrc: AvengrEndGameImgSrc
        },

        {
            title: "Interstellar",
            description: "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.",
            imgSrc: InterstellImgSrc
        },

        {
            title: "Star Wars : The Last Jedi",
            description: "Rey develops her abilities with the help of Luke Skywalker as the Resistance prepares for battle against the First Order.",
            imgSrc: StarWarsJediImgSrc
        },

        {
            title: "Wolf Children : Ame and Yuki",
            description: "When Hana falls in love with a young interloper she encounters in her college class, the last thing she expects to learn is that he is part wolf.",
            imgSrc: WolfChildrImgSrc
        },
    ]

    return (
        <section className="movies-banner container"
            aria-labelledby={titleId}>
            <h1 className="visually-hidden" id={titleId}>
                Movies & Shows</h1>
            <Slider
                sliderParams={{
                    slidesPerView: 1,
                    breakpoints:{
                        1024:{
                            allowTouchMove: false,
                        },
                    },
                }}
                navigationPosition= "abs-bottom"
                navigationJustifyContent="space-between"
                //to hide scrollbar on mobile --> hasScrollbarOnMobile = {false}
                >
                    {movieCards.map((movieCard, index) => (
                        <MovieBannerCard{...movieCard} key={index}/>
                    ))}
            </Slider>
        </section>
    )
}

export default MoviesBanner