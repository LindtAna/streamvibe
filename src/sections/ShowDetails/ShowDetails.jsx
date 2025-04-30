import SliderNavigation from '@/components/Slider/components/SliderNavigation'
import './ShowDetails.scss'
import Slider from '@/components/Slider'
import PersonCard from '@/components/PersonCard'
import Button from '@/components/Button'
import ReviewCard from '@/components/ReviewCard'
import Icon from '@/components/Icon'
import Tags from '@/components/Tags'
import Ratings from '@/components/Ratings'

import CalenderIcon from '@/assets/icons/calender.svg'
import TranslateIcon from '@/assets/icons/translate.svg'
import PlusIcon from '@/assets/icons/plus.svg'
import StarIcon from '@/assets/icons/star.svg'
import GenresIcon from '@/assets/icons/genres.svg'

import MatarazzoImgSrc from '@/assets/images/show-actors/matarazzo.jpg'
import BrownImgSrc from '@/assets/images/show-actors/brown.jpg'
import WolfhardImgSrc from '@/assets/images/show-actors/wolfhard.jpg'
import SchnappImgSrc from '@/assets/images/show-actors/schnapp.jpg'
import SinkImgSrc from '@/assets/images/show-actors/sink.jpg'
import McLaughlinImgSrc from '@/assets/images/show-actors/mcLaughlin.jpg'
import KeeryImgSrc from '@/assets/images/show-actors/keery.jpg'
import HarbourImgSrc from '@/assets/images/show-actors/harbour.jpg'
import DyerImgSrc from '@/assets/images/show-actors/dyer.jpg'
import RyderImgSrc from '@/assets/images/show-actors/ryder.jpg'
import HeatonImgSrc from '@/assets/images/show-actors/heaton.jpg'
import HawkeImgSrc from '@/assets/images/show-actors/hawke.jpg'

import DirectShowImgSrc from '@/assets/images/show-actors/director1.jpg'
import ComposerShowImgSrc from '@/assets/images/show-actors/music1.jpg'


const ShowDetails = (props) => {

    const{
        seasons,
    } = props

    const titleId = 'movie-details-title'
    const castSliderNavigationId = 'movie-cast-slider-navigation'
    const castItems = [
        {
            imgSrc: MatarazzoImgSrc,
            imgAlt: 'Gaten Matarazzo',
        },
        {
            imgSrc: BrownImgSrc,
            imgAlt: 'Millie Bobby Brown',
        },
        {
            imgSrc: WolfhardImgSrc,
            imgAlt: 'Finn Wolfhard',
        },
        {
            imgSrc: SchnappImgSrc,
            imgAlt: 'Noah Schnapp',
        },
        {
            imgSrc: SinkImgSrc,
            imgAlt: 'Sadie Sink',
        },
        {
            imgSrc: McLaughlinImgSrc,
            imgAlt: 'Caleb McLaughlin',
        },
        {
            imgSrc: KeeryImgSrc,
            imgAlt: 'Joe Keery',
        },
        {
            imgSrc: HarbourImgSrc,
            imgAlt: 'David Harbour',
        },
        {
            imgSrc: DyerImgSrc,
            imgAlt: 'Natalia Dyer',
        },
        {
            imgSrc: RyderImgSrc,
            imgAlt: 'Winona Ryder',
        },
        {
            imgSrc: HeatonImgSrc,
            imgAlt: 'Charlie Heaton',
        },
        {
            imgSrc: HawkeImgSrc,
            imgAlt: 'Maya Hawke',
        },
    ]

    const reviewItems = [
        {
            name: 'Rob Hutch',
            subtitle: 'From USA',
            description: "Stranger Things is absolutely as good as everyone says it is. When a show is as talked about about as much as this one has been it's hard to live up to expectations. Stranger Things has not only met those expectations but has surpassed them in every way. ",
            ratingValue: 5,
        },

        {
            name: 'Werner Gitzel',
            subtitle: 'From Germany',
            description: "Leider kann ich nur 5 Sterne geben. Wenn man 10 geben könnte würde ich 11 :) geben. Die beste Serie die ich bisher sah. Und ich habe schon viele gesehen. Ich bin eigentlich nicht so sehr für Serien, aber Stranger Tihings hat mich eines  besseren belehrt.",
            ratingValue: 5,
        },


        {
            name: 'Hacker1010',
            subtitle: 'From India',
            description: " 'Stranger Things' is a very big surprise. After all, it's a made for Netflix series, so it's going to be cheap and suck...right?! Well, no...fortunately. Despite having mostly no-name actors and a modest budget, this show turned out to be a hit and one that promises to bring us more episodes.",
            ratingValue: 5,
        },

        {
            name: 'Chira Grathod',
            subtitle: 'From UK',
            description: "Stranger Things as a whole is one of the best shows I have seen so far. First three seasons have been exciting and stunning but season 4 is extraordinary 👌🏻. The Duffer Brothers knock it out of the park for what I believe that this series is one of the best netflix series so far. ",
            ratingValue: 4.8,
        },

        {
            name: 'Chink C',
            subtitle: 'From Germany',
            description: "Leider nur 3 Sterne. Die Staffeln 1-3 sind sehr gut und spannend. Aber die 4 Staffel ist einfach langweilig und es zieht sich unnötig in die Länge. Ich habe mich so sehr auf die 4 Staffel gefreut und wurde dann wirklich enttäuscht. ",
            ratingValue: 3,
        },

        {
            name: 'Toni TheGreatest',
            subtitle: 'From Germany',
            description: "Komische Serie... also sehr spannend ist sie nicht und absolut nicht gruselig. Lächerlich das ab 16 Jahren freizugeben. Dennoch ist irgendwas dabei, was mich alle Folgen anschauen lassen hat... Ich denke, es war die gute schauspielerische Leistung von Millie Bobby Brown...",
            ratingValue: 3.5,
        },

        {
            name: 'Andrew Peter Farrer',
            subtitle: 'From USA',
            description: "Firstly, I feel I need to give you a disclaimer and tell you that I'm a big fan of most of Spielberg movies, so I could be biased. JJ Abrams' Super8 didn't blow me away and this definitely has the same DNA, and this is really good. The story, the soundtrack to the amazing child actors, all so good",
            ratingValue: 4.7,
        },

        {
            name: 'Choi Kyu-sung',
            subtitle: 'From Korea',
            description: "Season 1 was pretty good. Season 2 regular OK. But they ruined everything on 3rd season turning it into a childish sunday afternoon movie, full of cliches, sketchy BD-like villans and failed attempts to make comedy wich ended up destroying all the great misterious atmosphere of the 1st season. ",
            ratingValue: 4.1,
        },
    ]

    return (
        <section className="movie-details container"
            aria-labelledby={titleId}
        >
            <h2 className="visually-hidden"
                id={titleId}>
                Detailed movie information
            </h2>
            <div className="movie-details__main">
                {seasons && (
                    <div className="movie-details__panel movie-details__panel--order-seasons">
                        <div className="movie-details__group movie-details__group--big-gap-y">
                            <h3 className="h4">Seasons and Episodes</h3>
                            {seasons}
                        </div>
                    </div>
                ) }
                <div className="movie-details__panel movie-details__panel--description-tablet-order">
                    <div className="movie-details__group">
                        <h3 className="movie-details__title">Description</h3>
                        <div className="movie-details__description">
                            <p>In 1980s Indiana, a group of young friends witness supernatural forces and secret government exploits. As they search for answers, the children unravel a series of extraordinary mysteries.</p>
                        </div>
                    </div>
                </div>
                <div className="movie-details__panel">
                    <header className="movie-details__panel-header">
                        <h3 className="movie-details__title">Cast</h3>
                        <SliderNavigation
                            id={castSliderNavigationId}
                            hasPagination={false}
                            mode="rounded"
                            buttonMode="black-08"
                        />
                    </header>
                    <Slider
                        navigationTargetElementId={castSliderNavigationId}
                        sliderParams={{
                            slidesPerView: 'auto',
                            spaceBetween: 10,
                            breakpoints: {
                                1024: {
                                    slidesPerView: 'auto',
                                    spaceBetween: 20,
                                    allowTouchMove: false,
                                },
                            },
                        }}>
                        {castItems.map((castItem, index) => (
                            <PersonCard {...castItem} key={index} />
                        ))}
                    </Slider>
                </div>
                <div className="movie-details__panel movie-details__panel--large-gap-y">
                    <header className="movie-details__panel-header">
                        <h3 className="movie-details__title">
                            Rewiews
                        </h3>
                        <Button
                            mode="black-08"
                            iconSrc={PlusIcon}
                            iconName="plus"
                            label="Add Your Rewiew"
                            href="/"
                        />
                    </header>
                    <Slider
                        navigationMode="rounded"
                        isNavigationHiddenMobile={false}
                        sliderParams={{
                            slidesPerView: 2,
                            slidesPerGroup: 2,
                            breakpoints: {
                                0: {
                                    slidesPerView: 1,
                                    slidesPerGroup: 1,
                                    spaceBetween: 16,
                                },
                                1024: {
                                    slidesPerView: 2,
                                    slidesPerGroup: 2,
                                    allowTouchMove: false,
                                    spaceBetween: 20,
                                },
                            },
                        }}
                    >
                        {reviewItems.map((reviewItem, index) => (
                            <ReviewCard {...reviewItem} key={index} />
                        ))}
                    </Slider>
                </div>
            </div>
            <aside className="movie-details__info">
                <div className="movie-details__panel">
                    <div className="movie-details__groups">
                        <div className="movie-details__group">
                            <h3 className="movie-details__title">
                                <Icon
                                    name="calender"
                                    src={CalenderIcon}
                                />
                                <span>Released Year</span>
                            </h3>
                            <div className="movie-details__description">
                                <time className="h6" dateTime="2016">2016</time>
                            </div>
                        </div>

                        <div className="movie-details__group">
                            <h3 className="movie-details__title">
                                <Icon
                                    name="translate"
                                    src={TranslateIcon}
                                />
                                <span>Available Languages</span>
                            </h3>
                            <Tags
                                items={['English', 'German', 'Russian', 'French']}
                            />
                        </div>

                        <div className="movie-details__group">
                            <h3 className="movie-details__title">
                                <Icon
                                    name="star"
                                    src={StarIcon}
                                />
                                <span>Ratings</span>
                            </h3>
                            <Ratings
                                items={[
                                    { title: 'IMDb', ratingValue: 4.1 },
                                    { title: 'StreamVibe', ratingValue: 3.8 }
                                ]}
                            />
                        </div>


                        <div className="movie-details__group">
                            <h3 className="movie-details__title">
                                <Icon
                                    name="genres"
                                    src={GenresIcon}
                                />
                                <span>Genres</span>
                            </h3>
                            <Tags
                                items={['Horror', 'Science-Fiction']}
                            />
                        </div>

                        <div className="movie-details__group">
                            <h3 className="movie-details__title">
                              Director
                            </h3>
                            <PersonCard
                            name= "Shawn Levy"
                            subtitle= "From USA"
                            imgSrc={DirectShowImgSrc}
                             />
                        </div>

                        <div className="movie-details__group">
                            <h3 className="movie-details__title">
                              Composer
                            </h3>
                            <PersonCard
                            name= "Kyle Dixon"
                            subtitle= "From USA"
                            imgSrc={ComposerShowImgSrc}
                             />
                        </div>

                    </div>
                </div>
            </aside>


        </section>
    )
}

export default ShowDetails