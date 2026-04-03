import { useState, useEffect } from 'react'
import './AddReview.scss'
import Field from '../../support-page/Field'
import Button from '../Button'
import RatingView from '../RatingView'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

const AddReview = () => {
  const titleId = 'add-review-title'

  const [movie, setMovie] = useState({});
  const [loading, setLoading] = useState(false);
  const { imdb_id } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate()
  const location = useLocation()

  const [formData, setFormData] = useState({
    country: '',
    rating: 5, 
    text: ''
  })
 const from = location.state?.from?.pathname || "/login"

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      try {
        const response = await axiosPrivate.get(`/movie/${imdb_id}`);
        setMovie(response.data);
      } catch (error) {
        console.error('Error fetching movie:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [imdb_id, axiosPrivate]);


  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value
    }));
  };

 
  const handleRatingChange = (newRating) => {
    setFormData((prev) => ({
      ...prev,
      rating: newRating
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axiosPrivate.patch(`/addreview/${imdb_id}`, { 
        country: formData.country,
        rating: Number(formData.rating),
        text: formData.text 
      });

      setMovie((prevMovie) => ({
        ...prevMovie,
        user_reviews: [...(prevMovie.user_reviews || []), response.data]
      }));

      setFormData({
        country: '',
        rating: 5,
        text: ''
      });

    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        console.error('Unauthorized access - redirecting to login');
        localStorage.removeItem('user');
        navigate(from, { replace: true })
      } else {
        console.error('Error updating review:', err);
      }
    } finally {
      setLoading(false);
    }
  }; 

  return (
    <section className="add-review" aria-labelledby={titleId}>
      <form className="add-review__form" onSubmit={handleSubmit} noValidate>
        <Field
          className="add-review__form-cell"
          label="Land"
          placeholder="z. B. Deutschland"
          isRequired
          value={formData.country}
          onChange={handleChange('country')}
        />

        <RatingView 
          value={formData.rating} 
          onChange={handleRatingChange} 
          isInteractive={true} 
        />

        <Field
          className="add-review__form-cell add-review__form-cell--wide"
          label="Nachricht"
          type="textarea"
          placeholder="Schreibe deine Meinung zum Film…"
          isRequired
          value={formData.text}
          onChange={handleChange('text')}
        />

        <div className="add-review__form-cell add-review__form-cell--wide add-review__form-cell--actions">
          <Button
            className="add-review__form-submit-button"
            label={loading ? "Wird gesendet..." : "Absenden"}
            type="submit"
            disabled={loading}
          />
        </div>
      </form>
    </section>
  )
}

export default AddReview