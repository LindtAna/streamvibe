import './Movie.scss'
import React from 'react'
// import { Helmet } from 'react-helmet-async'
import MovieBanner from '../MovieBanner'
import MovieDetails from '../MovieDetails'

const Movie = () => {
  return (
     <>
     {/* <Helmet><title>StreamVibe | Avengers : Endgame</title></Helmet> */}
      <MovieBanner />
      <MovieDetails />
    </>
  )
}

export default Movie