import api from './axiosConfig'

export const apiService = {
  async getMovies() {
    const response = await api.get('/movies')
    return response.data
  },
  
   async getMovieById(tmdbId) {
    const response = await api.get(`/movie/${tmdbId}`)
    return response.data
  },

  async getHomeCollections(options = {}) {
    const response = await api.get('/home-collections', options)
    return response.data
  },

  async getMoviesPageCollections(options = {}) {
    const response = await api.get('/movies-page-collections', options)
    return response.data
  }
}
