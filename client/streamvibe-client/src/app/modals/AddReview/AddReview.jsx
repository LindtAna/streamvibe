import './AddReview.scss'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate} from 'react-router-dom'

import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import useAuth from '../../../hooks/useAuth'

import Field from '../../components/Field'
import Button from '../../components/Button'
import RatingView from '../../components/RatingView'


// const AddReview = ({imdbId, onReviewAdded, isOpen, onClose}) => { //DB
  const AddReview = ({tmdbId, onReviewAdded, isOpen, onClose}) => {

  const titleId = 'add-review-title'
  const axiosPrivate = useAxiosPrivate()
  const { auth } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
 
  const dialogRef = useRef(null)
  const openButtonRef = useRef(null)

  const [formData, setFormData] = useState({
    country: '',
    rating: 0, 
    text: ''
  })

  // Steuerung des nativen <dialog> Elements und Body-Scroll-Lock
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
 
    dialog.open = isOpen
    // Verhindert das Scrollen des Hintergrunds, wenn das Modal offen ist
    document.documentElement.classList.toggle('is-lock', isOpen)
 
    return () => {
      document.documentElement.classList.remove('is-lock')
    }
  }, [isOpen])

  // Barrierefreiheit: Schließen des Modals bei Druck auf die Escape-Taste
  useEffect(() => {
    if (!isOpen) return
 
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeModal()
      }
    }
 
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  //Erfolgsmeldung automatisch ausblenden
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 2000)
      return () => clearTimeout(timer)
    }
  }, [success])

//Schließen und Zurücksetzen des Formulars
  const closeModal = useCallback(() => {
    onClose()
    setFormData({
      country: '',
      rating: 0,
      text: ''
    })
    setError(null)
    setSuccess(null)
    openButtonRef.current?.focus()
  }, [])

  // Schließen des Modals bei Klick auf das Backdrop (außerhalb des Inhalts)
   const handleDialogClick = useCallback((e) => {
    if (e.target === dialogRef.current) {
      closeModal()
    }
  }, [closeModal])
 

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value
    }))
  }
 
  const handleRatingChange = (newRating) => {
    setFormData((prev) => ({
      ...prev,
      rating: newRating
    }))
  }
 
  // Client-seitige Validierung der Pflichtfelder
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
 
    if (!formData.country.trim()) {
      setError('Bitte gib dein Land an.')
      return
    }
 
    if (formData.rating === 0) {
      setError('Bitte wähle eine Bewertung aus.')
      return
    }
 
    if (!formData.text.trim()) {
      setError('Bitte schreibe einen Kommentar.')
      return
    }
 
    setLoading(true)
 
    try { // POST-Request an den Endpunkt für Filmbewertungen
        const response = await axiosPrivate.post(`/addreview/${tmdbId}`, {
        country: formData.country.trim(),
        rating: Number(formData.rating),
        text: formData.text.trim()
      })
 
      setSuccess('Bewertung erfolgreich hinzugefügt!')
      
      // Callback zum Aktualisieren der Liste der Bewertungen auf der Filmseite
      if (onReviewAdded) {
        onReviewAdded(response.data)
      }
 
      setTimeout(() => {
        closeModal()
      }, 1500)
 
    } catch (err) {
      console.error('Error adding review:', err)
      
      if (err.response?.status === 401) {
        setError('Sitzung abgelaufen. Bitte melde dich erneut an.')
        setTimeout(() => {
          navigate('/login', { state: { from: { pathname: `/movie/${tmdbId}` } } })
        }, 2000)
      } else {
        setError('Fehler beim Hinzufügen der Bewertung. Bitte versuche es erneut.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
    
      <dialog
        className="add-review__dialog"
        ref={dialogRef}
        onClick={handleDialogClick}
      >
        <div className="add-review__content">
          <form className="add-review__form" onSubmit={handleSubmit} noValidate>
            <h2 className="add-review__title h5" id={titleId}>
              Bewertung hinzufügen
            </h2>
 
            {error && (
              <div className="add-review__message add-review__message--error">
                {error}
              </div>
            )}
 
            {success && (
              <div className="add-review__message add-review__message--success">
                {success}
              </div>
            )}
 
            <Field
              className="add-review__form-cell"
              label="Land"
              placeholder="z. B. Deutschland"
              isRequired
              value={formData.country}
              onChange={handleChange('country')}
            />
 
            <div className="add-review__form-cell">
              <label className="add-review__rating-label">
                Bewertung <span className="add-review__required-star">*</span>
              </label>
              <RatingView
                value={formData.rating}
                onChange={handleRatingChange}
                isInteractive={true}
              />
            </div>
 
            <Field
              className="add-review__form-cell add-review__form-cell--wide"
              label="Kommentar"
              type="textarea"
              placeholder="Schreibe deine Meinung zum Film…"
              isRequired
              value={formData.text}
              onChange={handleChange('text')}
            />
 
            <div className="add-review__form-cell add-review__form-cell--wide add-review__form-cell--actions">
              <Button
                className="add-review__form-cancel-button button--black-08"
                mode="transparent"
                label="Abbrechen"
                type="button"
                onClick={closeModal}
              />
              <Button
                className="add-review__form-submit-button  button--black-08"
                label={loading ? 'Wird gesendet...' : 'Absenden'}
                type="submit"
                disabled={loading}
              />
            </div>
          </form>
        </div>
      </dialog>
    </>
  )
}

export default AddReview