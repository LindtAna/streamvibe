import api from './axiosConfig'

export const apiService = {
  async getMovies() {
    const response = await api.get('/movies')
    return response.data
  },

  async getMovieById(imdbId) {
    const response = await api.get(`/movies/${imdbId}`)
    return response.data
  }
}
