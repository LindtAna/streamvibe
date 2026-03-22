const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export const api = {

  async getMovies() {
    const response = await fetch(`${API_BASE_URL}/movies`)
    if (!response.ok) {
      throw new Error('Failed to fetch movies')
    }
    return response.json()
  },


  async getMovie(imdbId) {
    const response = await fetch(`${API_BASE_URL}/movie/${imdbId}`, {
    //   headers: {
    //     'Authorization': `Bearer ${token}`
    //   }
    })
    if (!response.ok) {
      throw new Error('Failed to fetch movie')
    }
    return response.json()
  },


  async getGenres() {
    const response = await fetch(`${API_BASE_URL}/genres`)
    if (!response.ok) {
      throw new Error('Failed to fetch genres')
    }
    return response.json()
  }
}