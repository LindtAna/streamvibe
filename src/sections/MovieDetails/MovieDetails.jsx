import SliderNavigation from '@/components/Slider/components/SliderNavigation'
import './MovieDetails.scss'
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



import EvansImgSrc from '@/assets/images/actors/evans.jpg'
import JohansonImgSrc from '@/assets/images/actors/johanson.jpg'
import HemsworthImgSrc from '@/assets/images/actors/hemsworth.jpg'
import RuffaloImgSrc from '@/assets/images/actors/ruffalo.jpg'
import RennerImgSrc from '@/assets/images/actors/renner.jpg'
import RuddImgSrc from '@/assets/images/actors/rudd.jpg'
import CheadleImgSrc from '@/assets/images/actors/cheadle.jpg'
import HollandImgSrc from '@/assets/images/actors/holland.jpg'
import OlsenImgSrc from '@/assets/images/actors/olsen.jpg'
import BosemanImgSrc from '@/assets/images/actors/boseman.jpg'
import PrattImgSrc from '@/assets/images/actors/pratt.jpg'
import WongImgSrc from '@/assets/images/actors/wong.jpg'
import HiddlestonImgSrc from '@/assets/images/actors/hiddleston.jpg'
import CumberbatchImgSrc from '@/assets/images/actors/cumberbatch.jpg'
import DirectAvengImgSrc from '@/assets/images/actors/director.jpg'
import ComposerAvengImgSrc from '@/assets/images/actors/music.jpg'






const MovieDetails = (props) => {

    const{
        seasons,
    } = props

    const titleId = 'movie-details-title'
    const castSliderNavigationId = 'movie-cast-slider-navigation'
    const castItems = [
        {imgSrc: EvansImgSrc, imgAlt: 'Chis Evans'},
        {imgSrc: JohansonImgSrc, imgAlt: 'Scarlett Johansson'},
        {imgSrc: HemsworthImgSrc, imgAlt: 'Chris Hemsworth'},
        {imgSrc: RuffaloImgSrc, imgAlt: 'Mark Ruffalo'},
        {imgSrc: RennerImgSrc, imgAlt: 'Jeremy Renner'},
        {imgSrc: RuddImgSrc, imgAlt: 'Paul Rudd'},
        {imgSrc: CheadleImgSrc, imgAlt: 'Don Cheadle'},
        {imgSrc: HollandImgSrc, imgAlt: 'Tom Holland'},
        {imgSrc: OlsenImgSrc, imgAlt: 'Elizabeth Olsen'},
        {imgSrc: BosemanImgSrc, imgAlt: 'Chadwick Boseman'},
        { imgSrc: PrattImgSrc, imgAlt: 'Chris Pratt'},
        {imgSrc: WongImgSrc, imgAlt: 'Benedict Wong'},
        {imgSrc: HiddlestonImgSrc, imgAlt: 'Tom Hiddleston'},
        {imgSrc: CumberbatchImgSrc, imgAlt: 'Benedict Cumberbatch'},
    ]

    const reviewItems = [
        {
            name: 'Dennis Donohue',
            subtitle: 'From USA',
            description: "Whereas Infinity War was a pulsating caffiene rush from beginning to end that could leave one shaking from the adrenaline dump, Endgame was an emotional walk home after a long night out.The character endings were so well done and the arcs so well-defined (Natasha, Rogers, Stark) that they all felt realistic and drew heavy emotional turmoil from me.The Marvel whimsy was on full display with Thor's character, and he really did steal every scene he was in...",
            ratingValue: 5,
        },

        {
            name: 'Klaus Martin',
            subtitle: 'From Germany',
            description: "Nicht mehr die Avengers aus den Hit- und Marvel Comics, aus The Avengers. Mit Emotiönchen versehen, weil mifühlen so gut zum Zeitgeist passt. Spiderman verkommt zu einen Spiderboy. An Peter Parker störten mich schon im Comic die ewigen Selbstzweifel, aber das ist historisch okay. Aber Spiderbub' ist zuviel.",
             ratingValue: 3,
        },


        {
            name: 'KAMIL HASHMI',
            subtitle: 'From India',
            description: "I loved the movie a lot. As I am great fan of marvel Avengers: Endgame', which marks the end of the Infinity Saga, is spellbounding and surely an enthralling experience. The last film of the 'Avengers' franchise is remarkable and doesn't disappoint. Watching all our favourite superheroes in one film is just surpassing. Marvel has been working on this grand culmination ever since they released 'Iron Man'. I'm damn sure that all of their hard work and ambition has paid off.",
            ratingValue: 5,
        },

        {
            name: 'Kevin King',
            subtitle: 'From UK',
            description: "When a 3-hour-long film doesn't SEEM like it lasts for 3 hours, that is an achievement in and of itself.  Few movies this lengthy are this entertaining.  The Godfather is one classic example.  (Actually that film is slightly less than 3 hours but still.) I can watch such a film over and over again and not get tired of it.  Or I can watch PARTS and never tire of THEM.  There are so many things to LIKE about THIS  film that the few criticisms I have are forgiveable. ",
            ratingValue: 4.8,
        },

        {
            name: 'Flo Kay',
            subtitle: 'From Germany',
            description: "Das war ein grandioses Finale! ''Endgame'' war episch, visuell atemberaubend und hoch emotional, mit diesem Film ist die ''Infinity-Saga'' des MCU zu einem perfekten Abschluss gekommen, in dem jede der Figuren auch ein passendes Ende bekommen hat. Es gibt einfach nichts was ich auszusetzen hätte, trotz 3 Stunden Laufzeit schaut sich dieser Film recht kurzweilig und hier wurde die Action und einprägende Momente richtig gut in Szene gesetzt",
            ratingValue: 5,
        },

        {
            name: 'E.Bach',
            subtitle: 'From Germany',
            description: "Ein durchaus unterhaltsamer Film, wie ein Action Film ohne Tiefgang in der Regel ist. Das müsste freilich nicht so sein, deshalb nur 3 Sterne. Es geht aber auch schlechter, wie z.B. der letzte Spiderman. Daher immerhin 3 Sterne. Ausserdem glaube ich, daß alle die versuchen das ganze tiefgründig zu analysieren das ganze viel zu ernst nehmen. Auf diesem Niveau ist analysieren erbärmlich.",
            ratingValue: 3.5,
        },

        {
            name: 'Tanushree Dutta',
            subtitle: 'From USA',
            description: "A surprising psych accurate delivery of a post war environment with deeply humane feelings of - Loss, PTS, behavioral sins & Sacrifice, with a hearty serving of comedic relief on memorable characters albeit with some overdone and quite disorienting with our loved heros ; this in the opening theme dosed with realism was promising..",
            ratingValue: 4.7,
        },

        {
            name: 'Chong Pak',
            subtitle: 'From Korea',
            description: "I just watched Avengers: Endgame .In the beginning of this movie ,Hawkeye was with his family ,later ,avengers were thinking about how to bring back the vanished people ,but the hope soon died .This movie intends to give the audiences an impression that avengers can't find any way at first.This is the twenty-second movie of Marvel ,and Marvel truly created a cinematic universe ,this movie titled 'Endgame' because it really reviews the most important events and characters in the past 11 years.",
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
                            <p>The surviving members of the Avengers and their allies attempt to reverse Thanos's actions in Infinity War which erased half of all life in the universe.</p>
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
                                   iconName="calender"
                                    src={CalenderIcon}
                                />
                                <span>Released Year</span>
                            </h3>
                            <div className="movie-details__description">
                                <time className="h6" dateTime="2019">2019</time>
                            </div>
                        </div>

                        <div className="movie-details__group">
                            <h3 className="movie-details__title">
                                <Icon
                                    iconName="translate"
                                    src={TranslateIcon}

                                />
                                <span>Available Languages</span>
                            </h3>
                            <Tags
                                items={['English', 'German', 'Japanese', 'Russian', 'French']}
                            />
                        </div>

                        <div className="movie-details__group">
                            <h3 className="movie-details__title">
                                <Icon
                                iconName="star"
                                src={StarIcon}
                                />
                                <span>Ratings</span>
                            </h3>
                            <Ratings
                                items={[
                                    { title: 'IMDb', ratingValue: 4.5 },
                                    { title: 'StreamVibe', ratingValue: 4 }
                                ]}
                            />
                        </div>


                        <div className="movie-details__group">
                            <h3 className="movie-details__title">
                                <Icon
                                 iconName="genres"
                                 src={GenresIcon}
                            
                                />
                                <span>Genres</span>
                            </h3>
                            <Tags
                                items={['Action', 'Superhero Movie']}
                            />
                        </div>

                        <div className="movie-details__group">
                            <h3 className="movie-details__title">
                              Director
                            </h3>
                            <PersonCard
                            name= "Anthony Russo"
                            subtitle= "From USA"
                            imgSrc={DirectAvengImgSrc}
                             />
                        </div>

                        <div className="movie-details__group">
                            <h3 className="movie-details__title">
                              Composer
                            </h3>
                            <PersonCard
                            name= "Alan Silvestri"
                            subtitle= "From USA"
                            imgSrc={ComposerAvengImgSrc}
                             />
                        </div>

                    </div>
                </div>
            </aside>


        </section>
    )
}

export default MovieDetails