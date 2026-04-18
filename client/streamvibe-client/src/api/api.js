import api from './axiosConfig'

export const apiService = {
  async getMovies() {
    const response = await api.get('/movies')
    return response.data
  },

  //Movies TMDB
   async getMovieById(tmdbId) {
    const response = await api.get(`/movie/${tmdbId}`)
    return response.data
  },

   // Series TMDB
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
