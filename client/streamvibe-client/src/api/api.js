import api from './axiosConfig'

export const apiService = {

   // Database Movies
  async getDBMovies() {
    const response = await api.get('/db-movies')
    return response.data
  },
 
  async getDBMovieById(dbId) {
    const response = await api.get(`/db-movie/${dbId}`)
    return response.data
  },


  // TMDB Movies & Series
   async getMovieById(tmdbId) {
    const response = await api.get(`/movie/${tmdbId}`)
    return response.data
  },

  async getSerieById(tmdbId) {
    const response = await api.get(`/serie/${tmdbId}`)
    return response.data
  },
 
  async getHomeCollections(options = {}) {
    const response = await api.get('/home-collections', options)
    return response.data
  },

   async getHomeCollectionsSeries(options = {}) {
    const response = await api.get('/home-collections-series', options)
    return response.data
  },


  async getMoviesPageCollections(options = {}) {
    const response = await api.get('/movies-page-collections', options)
    return response.data
  },

  async getSeriesPageCollections(options = {}) {
    const response = await api.get('/series-page-collections', options)
    return response.data
  },

   async searchTMDB(query, page = 1) {
    const response = await api.get('/search', {
      params: { q: query, page }
    })
    return response.data
  }
}
