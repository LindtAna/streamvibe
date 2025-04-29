import categoryItems from "@/sections/Categories/categoryItems"

import MarvelPosterImgSrc from '@/assets/images/categories/action/marvel.jpg'
import FreedomPosterImgSrc from '@/assets/images/categories/action/freedom.jpg'
import BBPosterImgSrc from '@/assets/images/categories/action/badboys.jpg'
import InceptionPosterImgSrc from '@/assets/images/categories/action/inception.jpg'
 
import LOTRPosterImgSrc from '@/assets/images/categories/adventure/lotr.jpg'
import StarWarsPosterImgSrc from '@/assets/images/categories/adventure/starwars.jpg'
import MarsianerPosterImgSrc from '@/assets/images/categories/adventure/marsianer.jpg'
import ThorPosterImgSrc from '@/assets/images/categories/adventure/thor.jpg'

import EurotripPosterImgSrc from '@/assets/images/categories/comedy/eurotrip.jpg'
import DictatorPosterImgSrc from '@/assets/images/categories/comedy/dictator.jpg'
import DeadpoolPosterImgSrc from '@/assets/images/categories/comedy/deadpool.jpg'
import DogmaPosterImgSrc from '@/assets/images/categories/comedy/dogma.jpg'

import ChallengPosterImgSrc from '@/assets/images/categories/drama/challengers.jpg'
import WillHuntPosterImgSrc from '@/assets/images/categories/drama/willhunting.jpg'
import HerzoginPosterImgSrc from '@/assets/images/categories/drama/herzogin.jpg'
import DianeArbPosterImgSrc from '@/assets/images/categories/drama/dianearbus.jpg'

import MorbiusPosterImgSrc from '@/assets/images/movies/morbius.jpg'
import AntManPosterImgSrc from '@/assets/images/movies/ant-man.jpg'
import SearchingPosterImgSrc from '@/assets/images/movies/searching.jpg'
import DunePosterImgSrc from '@/assets/images/movies/dune.jpg'
import HungGamesPosterImgSrc from '@/assets/images/movies/hunger-games.jpg'

import CaptAmerPosterImgSrc from '@/assets/images/movies/releases/captain-america.jpg'
import MinecrPosterImgSrc from '@/assets/images/movies/releases/minecraft.jpg'
import DropPosterImgSrc from '@/assets/images/movies/releases/drop.jpg'
import FFPosterImgSrc from '@/assets/images/movies/releases/fantasic-four.jpg'
import G20PosterImgSrc from '@/assets/images/movies/releases/g20.jpg'
import AmateurPosterImgSrc from '@/assets/images/movies/releases/amateur.jpg'
import ThunderbPosterImgSrc from '@/assets/images/movies/releases/thunderbolts.jpg'

import InterstellarSPosterImgSrc from '@/assets/images/movies/must-watch/interstellar-s.jpg'
import BladeRunPosterImgSrc from '@/assets/images/movies/must-watch/blade-runner.jpg'
import DontLookPosterImgSrc from '@/assets/images/movies/must-watch/dont-look-up.jpg'
import HeplPosterImgSrc from '@/assets/images/movies/must-watch/help.jpg'
import KillBillPosterImgSrc from '@/assets/images/movies/must-watch/kill-bill.jpg'
import RoyalTannenPosterImgSrc from '@/assets/images/movies/must-watch/royal-tannnbaum.jpg'
import ScottPiligrPosterImgSrc from '@/assets/images/movies/must-watch/scott-pilgrim.jpg'

import StrThingsPosterImgSrc from '@/assets/images/shows/stranger-things.jpg'
import BigBangThPosterImgSrc from '@/assets/images/shows/big-bang.jpg'
import CrownPosterImgSrc from '@/assets/images/shows/crown.jpg'
import FriendsPosterImgSrc from '@/assets/images/shows/friends.jpg'
import MaidPosterImgSrc from '@/assets/images/shows/maid.jpg'
import ResidencePosterImgSrc from '@/assets/images/shows/residence.jpg'
import TravellersPosterImgSrc from '@/assets/images/shows/travell.jpg'
import ThreeBodyPosterImgSrc from '@/assets/images/shows/three-body.jpg'
import TravelPosterImgSrc from '@/assets/images/shows/travellers.jpg'
import YoungSheldPosterImgSrc from '@/assets/images/shows/young-sheld.jpg'
import BlackMirrPosterImgSrc from '@/assets/images/shows/black-mirror.jpg'







const collectionGroups = [
  { isActive: true,
    title: 'Movies',
    items: [
      {title: 'Our Genres',
        categoryItems,
      },

      { title: 'Popular Top 10 In Genres',
        categoryItems: [
          {
            title: 'Action',
            badge: 'Top 10 In',
            images: [
              MarvelPosterImgSrc,
              FreedomPosterImgSrc,
              BBPosterImgSrc,
              InceptionPosterImgSrc
            ],
          },

          {
            title: 'Adventure',
            badge: 'Top 10 In',
            images: [
              LOTRPosterImgSrc,
              StarWarsPosterImgSrc,
              MarsianerPosterImgSrc,
              ThorPosterImgSrc,
            ],
          },

          {
            title: 'Comedy',
            badge: 'Top 10 In',
            images: [
              EurotripPosterImgSrc,
              DictatorPosterImgSrc,
              DeadpoolPosterImgSrc,
              DogmaPosterImgSrc,
            ],
          },

          {
            title: 'Drama',
            badge: 'Top 10 In',
            images: [
              ChallengPosterImgSrc,
              WillHuntPosterImgSrc,
              HerzoginPosterImgSrc,
              DianeArbPosterImgSrc,
            ],
          },

          {
            title: 'Marvel',
            badge: 'Top 10 In',
            images: [
              MarvelPosterImgSrc,
              FreedomPosterImgSrc,
              BBPosterImgSrc,
              InceptionPosterImgSrc,
            ],
          },

          {
            title: 'Sci-Fi',
            badge: 'Top 10 In',
            images: [
              LOTRPosterImgSrc,
              StarWarsPosterImgSrc,
              MarsianerPosterImgSrc,
              ThorPosterImgSrc,
            ],
          },

          {
            title: 'Family',
            badge: 'Top 10 In',
            images: [
              EurotripPosterImgSrc,
              DictatorPosterImgSrc,
              DeadpoolPosterImgSrc,
              DogmaPosterImgSrc,
            ],
          },

          {
            title: 'Horror',
            badge: 'Top 10 In',
            images: [
              ChallengPosterImgSrc,
              WillHuntPosterImgSrc,
              HerzoginPosterImgSrc,
              DianeArbPosterImgSrc,
            ],
          },

          {
            title: 'Star Wars',
            badge: 'Top 10 In',
            images: [
              MarvelPosterImgSrc,
              FreedomPosterImgSrc,
              BBPosterImgSrc,
              InceptionPosterImgSrc,
            ],
          },

          {
            title: 'Documentary',
            badge: 'Top 10 In',
            images: [
              LOTRPosterImgSrc,
              StarWarsPosterImgSrc,
              MarsianerPosterImgSrc,
              ThorPosterImgSrc,
            ],
          },

          {
            title: 'Kids',
            badge: 'Top 10 In',
            images: [
              EurotripPosterImgSrc,
              DictatorPosterImgSrc,
              DeadpoolPosterImgSrc,
              DogmaPosterImgSrc,
            ],
          },

          {
            title: 'Romantic',
            badge: 'Top 10 In',
            images: [
              ChallengPosterImgSrc,
              WillHuntPosterImgSrc,
              HerzoginPosterImgSrc,
              DianeArbPosterImgSrc,
            ],
          },

          {
            title: 'More Action',
            badge: 'Top 10 In',
            images: [
              MarvelPosterImgSrc,
              FreedomPosterImgSrc,
              BBPosterImgSrc,
              InceptionPosterImgSrc,
            ],
          },

          {
            title: 'More Energy',
            badge: 'Top 10 In',
            images: [
              LOTRPosterImgSrc,
              StarWarsPosterImgSrc,
              MarsianerPosterImgSrc,
              ThorPosterImgSrc,
            ],
          },

          {
            title: 'More Comedy',
            badge: 'Top 10 In',
            images: [
              EurotripPosterImgSrc,
              DictatorPosterImgSrc,
              DeadpoolPosterImgSrc,
              DogmaPosterImgSrc,
            ],
          },

          {
            title: 'More Drama',
            badge: 'Top 10 In',
            images: [
              ChallengPosterImgSrc,
              WillHuntPosterImgSrc,
              HerzoginPosterImgSrc,
              DianeArbPosterImgSrc,
            ],
          },
        ],
        sliderParams: {
          slidesPerView: 4,
          slidesPerGroup: 4,
          spaceBetween: 30,
          breakpoints: {
            0: {
              slidesPerView: 1.6,
              slidesPerGroup: 1,
              spaceBetween: 20,
            },
            481: {
              slidesPerView: 2,
              slidesPerGroup: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              slidesPerGroup: 3,
              spaceBetween: 20,
            },
            1024: {
              spaceBetween: 20,
            },
            1441: {
              spaceBetween: 30,
            },
          }
        },
      },

      { title: 'Trending Now',
        movieItems: [
          {
            title: 'Morbius',
            imgSrc: MorbiusPosterImgSrc,
            duration: '1h 30min',
            views: '2K',
          },

          {
            title: 'Ant-Man',
            imgSrc: AntManPosterImgSrc,
            duration: '1h 45min',
            views: '10K',
          },

          {
            title: 'Searching',
            imgSrc: SearchingPosterImgSrc,
            duration: '1h 38min',
            views: '4K',
          },

          {
            title: 'Dune',
            imgSrc: DunePosterImgSrc,
            duration: '2h 30min',
            views: '8K',
          },

          {
            title: 'Hunger Games',
            imgSrc: HungGamesPosterImgSrc,
            duration: '2h 15min',
            views: '9K',
          },

          {
            title: 'Morbius',
            imgSrc: MorbiusPosterImgSrc,
            duration: '1h 30min',
            views: '2K',
          },

          {
            title: 'Ant-Man',
            imgSrc: AntManPosterImgSrc,
            duration: '1h 45min',
            views: '10K',
          },

          {
            title: 'Searching',
            imgSrc: SearchingPosterImgSrc,
            duration: '1h 38min',
            views: '4K',
          },

          {
            title: 'Dune',
            imgSrc: DunePosterImgSrc,
            duration: '2h 30min',
            views: '8K',
          },

          {
            title: 'Hunger Games',
            imgSrc: HungGamesPosterImgSrc,
            duration: '2h 15min',
            views: '9K',
          },

          {
            title: 'Morbius',
            imgSrc: MorbiusPosterImgSrc,
            duration: '1h 30min',
            views: '2K',
          },

          {
            title: 'Ant-Man',
            imgSrc: AntManPosterImgSrc,
            duration: '1h 45min',
            views: '10K',
          },

          {
            title: 'Searching',
            imgSrc: SearchingPosterImgSrc,
            duration: '1h 38min',
            views: '4K',
          },

          {
            title: 'Dune',
            imgSrc: DunePosterImgSrc,
            duration: '2h 30min',
            views: '8K',
          },

          {
            title: 'Hunger Games',
            imgSrc: HungGamesPosterImgSrc,
            duration: '2h 15min',
            views: '9K',
          },

          {
            title: 'Morbius',
            imgSrc: MorbiusPosterImgSrc,
            duration: '1h 30min',
            views: '2K',
          },

          {
            title: 'Ant-Man',
            imgSrc: AntManPosterImgSrc,
            duration: '1h 45min',
            views: '10K',
          },

          {
            title: 'Searching',
            imgSrc: SearchingPosterImgSrc,
            duration: '1h 38min',
            views: '4K',
          },

          {
            title: 'Dune',
            imgSrc: DunePosterImgSrc,
            duration: '2h 30min',
            views: '8K',
          },

          {
            title: 'Hunger Games',
            imgSrc: HungGamesPosterImgSrc,
            duration: '2h 15min',
            views: '9K',
          },
        ],
      },

      { title: 'New Releases',
        movieItems: [
          {
            title: 'Captain America: Brave New World',
            imgSrc: CaptAmerPosterImgSrc,
            released: {
              label: '20 April 2025',
              dateTime: '2025-04-20'
            }
          },

          {
            title: 'A Minecraft Movie 2. A Minecraft Movie',
            imgSrc: MinecrPosterImgSrc,
            released: {
              label: '2 April 2025',
              dateTime: '2025-04-02'
            }
          },

          {
            title: 'Drop',
            imgSrc: DropPosterImgSrc,
            released: {
              label: '9 March 2025',
              dateTime: '2025-03-09'
            }
          },

          {
            title: 'G20',
            imgSrc: '/src/assets/images/movies/releases/g20.jpg',
            released: {
              label: '10 April 2025',
              dateTime: '2025-04-10'
            }
          },

          {
            title: 'The Fantastic Four: First Steps',
            imgSrc: FFPosterImgSrc,
            released: {
              label: '23 July 2025',
              dateTime: '2025-07-23'
            }
          },

          {
            title: 'Thunderbolts*',
            imgSrc: ThunderbPosterImgSrc,
            released: {
              label: '23 April 2025',
              dateTime: '2025-04-23'
            }
          },

          {
            title: 'The Amateur',
            imgSrc: AmateurPosterImgSrc,
            released: {
              label: '9 April 2025',
              dateTime: '2025-04-09'
            }
          },

          {
            title: 'Captain America: Brave New World',
            imgSrc: CaptAmerPosterImgSrc,
            released: {
              label: '20 April 2025',
              dateTime: '2025-04-20'
            }
          },

          {
            title: 'A Minecraft Movie 2. A Minecraft Movie',
            imgSrc: MinecrPosterImgSrc,
            released: {
              label: '2 April 2025',
              dateTime: '2025-04-02'
            }
          },

          {
            title: 'Drop',
            imgSrc: DropPosterImgSrc,
            released: {
              label: '9 March 2025',
              dateTime: '2025-03-09'
            }
          },

          {
            title: 'G20',
            imgSrc: G20PosterImgSrc,
            released: {
              label: '10 April 2025',
              dateTime: '2025-04-10'
            }
          },

          {
            title: 'The Fantastic Four: First Steps',
            imgSrc: '/src/assets/images/movies/releases/fantasic-four.jpg',
            released: {
              label: '23 July 2025',
              dateTime: '2025-07-23'
            }
          },

          {
            title: 'Thunderbolts*',
            imgSrc: ThunderbPosterImgSrc,
            released: {
              label: '23 April 2025',
              dateTime: '2025-04-23'
            }
          },

          {
            title: 'The Amateur',
            imgSrc: AmateurPosterImgSrc,
            released: {
              label: '9 April 2025',
              dateTime: '2025-04-09'
            }
          },

          {
            title: 'Captain America: Brave New World',
            imgSrc: CaptAmerPosterImgSrc,
            released: {
              label: '20 April 2025',
              dateTime: '2025-04-20'
            }
          },

          {
            title: 'A Minecraft Movie 2. A Minecraft Movie',
            imgSrc: MinecrPosterImgSrc,
            released: {
              label: '2 April 2025',
              dateTime: '2025-04-02'
            }
          },

          {
            title: 'Drop',
            imgSrc: DropPosterImgSrc,
            released: {
              label: '9 March 2025',
              dateTime: '2025-03-09'
            }
          },

          {
            title: 'G20',
            imgSrc: G20PosterImgSrc,
            released: {
              label: '10 April 2025',
              dateTime: '2025-04-10'
            }
          },

          {
            title: 'The Fantastic Four: First Steps',
            imgSrc: FFPosterImgSrc,
            released: {
              label: '23 July 2025',
              dateTime: '2025-07-23'
            }
          },

          {
            title: 'Thunderbolts*',
            imgSrc: ThunderbPosterImgSrc,
            released: {
              label: '23 April 2025',
              dateTime: '2025-04-23'
            }
          },
        ],
      },

      {title: 'Must - Watch Movies',
        movieItems: [
          {
            title: 'Interstellar',
            imgSrc: InterstellarSPosterImgSrc,
            duration: '2h 30min',
            rating: {
              value: 4.5,
              label: '20K',
            }
          },

          {
            title: 'Help',
            imgSrc: HeplPosterImgSrc,
            duration: '1h 57min',
            rating: {
              value: 4.8,
              label: '10K',
            }
          },

          {
            title: 'Dont Look Up',
            imgSrc: DontLookPosterImgSrc,
            duration: '1h 37min',
            rating: {
              value: 4.6,
              label: '80K',
            }
          },

          {
            title: 'The Royal Tannenbaum',
            imgSrc: RoyalTannenPosterImgSrc,
            duration: '1h 57min',
            rating: {
              value: 4.5,
              label: '7K',
            }
          },

          {
            title: 'Kill Bill',
            imgSrc: KillBillPosterImgSrc,
            duration: '1h 47min',
            rating: {
              value: 4.5,
              label: '13K',
            }
          },

          {
            title: 'Scott Piligrim',
            imgSrc: ScottPiligrPosterImgSrc,
            duration: '1h 37min',
            rating: {
              value: 4.8,
              label: '11K',
            }
          },

          {
            title: 'The Blade Runner',
            imgSrc: BladeRunPosterImgSrc,
            duration: '1h 57min',
            rating: {
              value: 4.2,
              label: '17K',
            }
          },

          {
            title: 'Interstellar',
            imgSrc: InterstellarSPosterImgSrc,
            duration: '2h 30min',
            rating: {
              value: 4.5,
              label: '20K',
            }
          },

          {
            title: 'Help',
            imgSrc: HeplPosterImgSrc,
            duration: '1h 57min',
            rating: {
              value: 4.8,
              label: '10K',
            }
          },

          {
            title: 'Dont Look Up',
            imgSrc: DontLookPosterImgSrc,
            duration: '1h 37min',
            rating: {
              value: 4.6,
              label: '80K',
            }
          },

          {
            title: 'The Royal Tannenbaum',
            imgSrc: RoyalTannenPosterImgSrc,
            duration: '1h 57min',
            rating: {
              value: 4.5,
              label: '7K',
            }
          },

          {
            title: 'Kill Bill',
            imgSrc: KillBillPosterImgSrc,
            duration: '1h 47min',
            rating: {
              value: 4.5,
              label: '13K',
            }
          },

          {
            title: 'Scott Piligrim',
            imgSrc: ScottPiligrPosterImgSrc,
            duration: '1h 37min',
            rating: {
              value: 4.8,
              label: '11K',
            }
          },

          {
            title: 'The Blade Runner',
            imgSrc: BladeRunPosterImgSrc,
            duration: '1h 57min',
            rating: {
              value: 4.2,
              label: '17K',
            }
          },

          {
            title: 'Interstellar',
            imgSrc: InterstellarSPosterImgSrc,
            duration: '2h 30min',
            rating: {
              value: 4.5,
              label: '20K',
            }
          },

          {
            title: 'Help',
            imgSrc: HeplPosterImgSrc,
            duration: '1h 57min',
            rating: {
              value: 4.8,
              label: '10K',
            }
          },

        ],
        sliderParams: {
          slidesPerView: 4,
          slidesPerGroup: 4,
          spaceBetween: 30,
          breakpoints: {
            0: {
              slidesPerView: 1.6,
              slidesPerGroup: 1,
              spaceBetween: 20,
            },
            481: {
              slidesPerView: 2,
              slidesPerGroup: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              slidesPerGroup: 3,
              spaceBetween: 20,
            },
            1024: {
              spaceBetween: 20,
            },
            1441: {
              spaceBetween: 30,
            },
          }
        },
      },
    ],
  },

  {

    title: 'Shows',
    items: [
      {
        title: 'Our Shows Genres',
        categoryItems,
      },

      {
        title: 'Popular Top 10 In Genres',
        categoryItems: [
          {
            title: 'Action',
            badge: 'Top 10 In',
            images: [
              MarvelPosterImgSrc,
              FreedomPosterImgSrc,
              BBPosterImgSrc,
              InceptionPosterImgSrc,
            ],
          },

          {
            title: 'Adventure',
            badge: 'Top 10 In',
            images: [
              LOTRPosterImgSrc,
              StarWarsPosterImgSrc,
              MarsianerPosterImgSrc,
              ThorPosterImgSrc,
            ],
          },

          {
            title: 'Comedy',
            badge: 'Top 10 In',
            images: [
              EurotripPosterImgSrc,
              DictatorPosterImgSrc,
              DeadpoolPosterImgSrc,
              DogmaPosterImgSrc,
            ],
          },

          {
            title: 'Drama',
            badge: 'Top 10 In',
            images: [
              ChallengPosterImgSrc,
              WillHuntPosterImgSrc,
              HerzoginPosterImgSrc,
              DianeArbPosterImgSrc,
            ],
          },

          {
            title: 'Marvel',
            badge: 'Top 10 In',
            images: [
              MarvelPosterImgSrc,
              FreedomPosterImgSrc,
              BBPosterImgSrc,
              InceptionPosterImgSrc
            ],
          },

          {
            title: 'Sci-Fi',
            badge: 'Top 10 In',
            images: [
              LOTRPosterImgSrc,
              StarWarsPosterImgSrc,
              MarsianerPosterImgSrc,
              ThorPosterImgSrc,
            ],
          },

          {
            title: 'Family',
            badge: 'Top 10 In',
            images: [
              EurotripPosterImgSrc,
              DictatorPosterImgSrc,
              DeadpoolPosterImgSrc,
              DogmaPosterImgSrc,
            ],
          },

          {
            title: 'Horror',
            badge: 'Top 10 In',
            images: [
              ChallengPosterImgSrc,
              WillHuntPosterImgSrc,
              HerzoginPosterImgSrc,
              DianeArbPosterImgSrc,
            ],
          },

          {
            title: 'Star Wars',
            badge: 'Top 10 In',
            images: [
              MarvelPosterImgSrc,
              FreedomPosterImgSrc,
              BBPosterImgSrc,
              InceptionPosterImgSrc,
            ],
          },

          {
            title: 'Documentary',
            badge: 'Top 10 In',
            images: [
              LOTRPosterImgSrc,
              StarWarsPosterImgSrc,
              MarsianerPosterImgSrc,
              ThorPosterImgSrc,
            ],
          },

          {
            title: 'Kids',
            badge: 'Top 10 In',
            images: [
              EurotripPosterImgSrc,
              DictatorPosterImgSrc,
              DeadpoolPosterImgSrc,
              DogmaPosterImgSrc,
            ],
          },

          {
            title: 'Romantic',
            badge: 'Top 10 In',
            images: [
              ChallengPosterImgSrc,
              WillHuntPosterImgSrc,
              HerzoginPosterImgSrc,
              DianeArbPosterImgSrc,
            ],
          },

          {
            title: 'More Action',
            badge: 'Top 10 In',
            images: [
              MarvelPosterImgSrc,
              FreedomPosterImgSrc,
              BBPosterImgSrc,
              InceptionPosterImgSrc,
            ],
          },

          {
            title: 'More Energy',
            badge: 'Top 10 In',
            images: [
              LOTRPosterImgSrc,
              StarWarsPosterImgSrc,
              MarsianerPosterImgSrc,
              ThorPosterImgSrc,
            ],
          },

          {
            title: 'More Comedy',
            badge: 'Top 10 In',
            images: [
              EurotripPosterImgSrc,
              DictatorPosterImgSrc,
              DeadpoolPosterImgSrc,
              DogmaPosterImgSrc,
            ],
          },

          {
            title: 'More Drama',
            badge: 'Top 10 In',
            images: [
              ChallengPosterImgSrc,
              WillHuntPosterImgSrc,
              HerzoginPosterImgSrc,
              DianeArbPosterImgSrc,
            ],
          },
        ],
        sliderParams: {
          slidesPerView: 4,
          slidesPerGroup: 4,
          spaceBetween: 30,
          breakpoints: {
            0: {
              slidesPerView: 1.6,
              slidesPerGroup: 1,
              spaceBetween: 20,
            },
            481: {
              slidesPerView: 2,
              slidesPerGroup: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              slidesPerGroup: 3,
              spaceBetween: 20,
            },
            1024: {
              spaceBetween: 20,
            },
            1441: {
              spaceBetween: 30,
            },
          }
        },
      },

      {title: 'Trending Shows Now',
        movieItems: [
          {
            title: 'Stranger Things',
            imgSrc: StrThingsPosterImgSrc,
            duration: '8h 20min',
            season: '4 Season',
            href: '/show',
          },
          {
            title: 'Travellers',
            imgSrc: TravelPosterImgSrc,
            duration: '32h 23min',
            season: '3 Season',
            href: '/show',
          },
          {
            title: 'Black Mirror',
            imgSrc: BlackMirrPosterImgSrc,
            duration: '5h 20min',
            season: '7 Season',
            href: '/show',
          },
          {
            title: 'Three Body Problem',
            imgSrc: ThreeBodyPosterImgSrc,
            duration: '14h 30min',
            season: '3 Season',
            href: '/show',
          },
          {
            title: 'Maid',
            imgSrc: MaidPosterImgSrc,
            duration: '7h 40min',
            season: '2 Season',
            href: '/show',
          },

          {
            title: 'Stranger Things',
            imgSrc: StrThingsPosterImgSrc,
            duration: '8h 20min',
            season: '4 Season',
            href: '/show',
          },
          {
            title: 'Travellers',
            imgSrc: TravelPosterImgSrc,
            duration: '12h 23min',
            season: '5 Season',
            href: '/show',
          },
          {
            title: 'Black Mirror',
            imgSrc: BlackMirrPosterImgSrc,
            duration: '5h 20min',
            season: '7 Season',
            href: '/show',
          },
          {
            title: 'Three Body Problem',
            imgSrc: ThreeBodyPosterImgSrc,
            duration: '14h 30min',
            season: '3 Season',
            href: '/show',
          },
          {
            title: 'Young Sheldon',
            imgSrc: YoungSheldPosterImgSrc,
            duration: '43h 40min',
            season: '7 Season',
            href: '/show',
          },

          {
            title: 'Stranger Things',
            imgSrc: StrThingsPosterImgSrc,
            duration: '8h 20min',
            season: '4 Season',
            href: '/show',
          },
          {
            title: 'Maid',
            imgSrc: MaidPosterImgSrc,
            duration: '12h 23min',
            season: '5 Season',
            href: '/show',
          },
          {
            title: 'Black Mirror',
            imgSrc: BlackMirrPosterImgSrc,
            duration: '5h 20min',
            season: '7 Season',
            href: '/show',
          },
          {
            title: 'Travellers',
            imgSrc: TravelPosterImgSrc,
            duration: '14h 30min',
            season: '3 Season',
            href: '/show',
          },
          {
            title: 'Stranger Things',
            imgSrc: StrThingsPosterImgSrc,
            duration: '7h 40min',
            season: '2 Season',
            href: '/show',
          },

          {
            title: 'The Crown',
            imgSrc: CrownPosterImgSrc,
            duration: '15h 20min',
            season: '6 Season',
            href: '/show',
          },
        ],
        sliderParams: {
          slidesPerView: 4,
          slidesPerGroup: 4,
          spaceBetween: 30,
          breakpoints: {
            0: {
              slidesPerView: 1.6,
              slidesPerGroup: 1,
              spaceBetween: 20,
            },
            481: {
              slidesPerView: 2,
              slidesPerGroup: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              slidesPerGroup: 3,
              spaceBetween: 20,
            },
            1024: {
              spaceBetween: 20,
            },
            1441: {
              spaceBetween: 30,
            },
          }
        },
      },

      {title: 'New Released Shows',
        movieItems: [
          {
            title: 'Black Mirror',
            imgSrc: BlackMirrPosterImgSrc,
            duration: '5h 20min',
            season: '4 Season',
            href: '/show',
          },
          {
            title: 'The Residence',
            imgSrc: ResidencePosterImgSrc,
            duration: '10h 30min',
            season: '1 Season',
            href: '/show',
          },
          {
            title: 'Three Body Problem',
            imgSrc: ThreeBodyPosterImgSrc,
            duration: '4h 20min',
            season: '2 Season',
            href: '/show',
          },
          {
            title: 'The Crown',
            imgSrc: CrownPosterImgSrc,
            duration: '15h 24min',
            season: '6 Season',
            href: '/show',
          },
          {
            title: 'Young Sheldon',
            imgSrc: YoungSheldPosterImgSrc,
            duration: '7h 40min',
            season: '2 Season',
            href: '/show',
          },

          {
            title: 'Black Mirror',
            imgSrc: BlackMirrPosterImgSrc,
            duration: '5h 20min',
            season: '7 Season',
            href: '/show',
          },
          {
            title: 'The Residence',
            imgSrc: ResidencePosterImgSrc,
            duration: '10h 30min',
            season: '1 Season',
            href: '/show',
          },
          {
            title: 'Three Body Problem',
            imgSrc: ThreeBodyPosterImgSrc,
            duration: '4h 20min',
            season: '2 Season',
            href: '/show',
          },
          {
            title: 'The Crown',
            imgSrc: CrownPosterImgSrc,
            duration: '15h 24min',
            season: '6 Season',
            href: '/show',
          },
          {
            title: 'Young Sheldon',
            imgSrc: YoungSheldPosterImgSrc,
            duration: '12h 40min',
            season: '7 Season',
            href: '/show',
          },

          {
            title: 'Black Mirror',
            imgSrc: BlackMirrPosterImgSrc,
            duration: '5h 20min',
            season: '7 Season',
            href: '/show',
          },
          {
            title: 'Travellers',
            imgSrc: TravellersPosterImgSrc,
            duration: '10h 30min',
            season: '3 Season',
            href: '/show',
          },
          {
            title: 'Three Body Problem',
            imgSrc: ThreeBodyPosterImgSrc,
            duration: '4h 20min',
            season: '2 Season',
            href: '/show',
          },
          {
            title: 'The Crown',
            imgSrc: CrownPosterImgSrc,
            duration: '15h 24min',
            season: '6 Season',
            href: '/show',
          },
          {
            title: 'Young Sheldon',
            imgSrc: YoungSheldPosterImgSrc,
            duration: '7h 40min',
            season: '7 Season',
            href: '/show',
          },

          {
            title: 'The Residence',
            imgSrc: ResidencePosterImgSrc,
            duration: '10h 20min',
            season: '1 Season',
            href: '/show',
          },
        ],
        sliderParams: {
          slidesPerView: 4,
          slidesPerGroup: 4,
          spaceBetween: 30,
          breakpoints: {
            0: {
              slidesPerView: 1.6,
              slidesPerGroup: 1,
              spaceBetween: 20,
            },
            481: {
              slidesPerView: 2,
              slidesPerGroup: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              slidesPerGroup: 3,
              spaceBetween: 20,
            },
            1024: {
              spaceBetween: 20,
            },
            1441: {
              spaceBetween: 30,
            },
          }
        },
      },

      { title: 'Must - Watch Shows',
        movieItems: [
          {
            title: 'Young Sheldon',
            imgSrc: YoungSheldPosterImgSrc,
            duration: '7h 40min',
            rating: {
              value: 4.5,
              label: '20K',
            }
          },

          {
            title: 'Black Mirror',
            imgSrc: BlackMirrPosterImgSrc,
            duration: '5h 20min',
            rating: {
              value: 4.8,
              label: '10K',
            }
          },

          {
            title: 'Maid',
            imgSrc: MaidPosterImgSrc,
            duration: '12h 45min',
            rating: {
              value: 4.6,
              label: '80K',
            }
          },

          {
            title: 'The Big Bang Theory',
            imgSrc: BigBangThPosterImgSrc,
            duration: '20h 34min',
            rating: {
              value: 4.5,
              label: '7K',
            }
          },

          {
            title: 'Friends',
            imgSrc: FriendsPosterImgSrc,
            duration: '45h 32min',
            rating: {
              value: 4.5,
              label: '13K',
            }
          },

          {
            title: 'Travellers',
            imgSrc: TravellersPosterImgSrc,
            duration: '7h 40min',
            rating: {
              value: 4.5,
              label: '20K',
            }
          },

          {
            title: 'Black Mirror',
            imgSrc: BlackMirrPosterImgSrc,
            duration: '5h 20min',
            rating: {
              value: 4.8,
              label: '10K',
            }
          },

          {
            title: 'Maid',
            imgSrc: MaidPosterImgSrc,
            duration: '12h 20min',
            rating: {
              value: 4.6,
              label: '80K',
            }
          },

          {
            title: 'The Big Bang Theory',
            imgSrc: BigBangThPosterImgSrc,
            duration: '20h 34min',
            rating: {
              value: 4.5,
              label: '7K',
            }
          },

          {
            title: 'Friends',
            imgSrc: FriendsPosterImgSrc,
            duration: '45h 32min',
            rating: {
              value: 4.5,
              label: '13K',
            }
          },

          {
            title: 'Young Sheldon',
            imgSrc: YoungSheldPosterImgSrc,
            duration: '7h 40min',
            rating: {
              value: 4.5,
              label: '20K',
            }
          },

          {
            title: 'Black Mirror',
            imgSrc: BlackMirrPosterImgSrc,
            duration: '5h 20min',
            rating: {
              value: 4.8,
              label: '10K',
            }
          },

          {
            title: 'Maid',
            imgSrc: MaidPosterImgSrc,
            duration: '5h 20min',
            rating: {
              value: 4.6,
              label: '80K',
            }
          },

          {
            title: 'Travellers',
            imgSrc: TravelPosterImgSrc,
            duration: '40h 34min',
            rating: {
              value: 4.5,
              label: '7K',
            }
          },

          {
            title: 'Friends',
            imgSrc: FriendsPosterImgSrc,
            duration: '45h 32min',
            rating: {
              value: 4.5,
              label: '13K',
            }
          },

          {
            title: 'Black Mirror',
            imgSrc: BlackMirrPosterImgSrc,
            duration: '5h 20min',
            rating: {
              value: 4.8,
              label: '10K',
            }
          },

        ],
        sliderParams: {
          slidesPerView: 4,
          slidesPerGroup: 4,
          spaceBetween: 30,
          breakpoints: {
            0: {
              slidesPerView: 1.6,
              slidesPerGroup: 1,
              spaceBetween: 20,
            },
            481: {
              slidesPerView: 2,
              slidesPerGroup: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              slidesPerGroup: 3,
              spaceBetween: 20,
            },
            1024: {
              spaceBetween: 20,
            },
            1441: {
              spaceBetween: 30,
            },
          }
        },
      },
    ],
  }
]


export default collectionGroups
