import './SupportResponse.scss'

import { useState, useEffect, useRef, useCallback } from 'react'

import useAxiosPrivate from '../../../hooks/useAxiosPrivate'

import Field from '../../components/Field'
import Button from '../../components/Button'

const SupportResponseModal = ({ isOpen, onClose, supportRequest, onResponseSent }) => {
  const titleId = 'support-response-title'
  const axiosPrivate = useAxiosPrivate()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const [responseText, setResponseText] = useState('')

  const dialogRef = useRef(null)


  // Steuerung des nativen Dialog-Elements und Sperrung des Hintergrund-Scrollens
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    dialog.open = isOpen
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

  // Setzt den Zustand zurück und schließt das Modal
  const closeModal = useCallback(() => {
    onClose()
    setResponseText('')
    setError(null)
    setSuccess(null)
    openButtonRef.current?.focus()
  }, [onClose])

  // Schließt das Modal bei einem Klick auf den Hintergrund (Backdrop)
  const handleDialogClick = useCallback(
    (e) => {
      if (e.target === dialogRef.current) {
        closeModal()
      }
    },
    [closeModal]
  )

  const handleChange = (e) => {
    setResponseText(e.target.value)
  }

  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
// Einfache Validierung der Eingabelänge
    if (!responseText.trim()) {
      setError('Bitte schreibe eine Antwort.')
      return
    }
    if (responseText.trim().length < 10) {
      setError('Die Antwort muss mindestens 10 Zeichen lang sein.')
      return
    }
    setLoading(true)

    try {
      await axiosPrivate.post('/admin/support-response', {
        support_request_id: supportRequest._id,
        response_text: responseText.trim(),
      })

      setSuccess('Antwort erfolgreich gesendet!')

      if (onResponseSent) {
        onResponseSent()
      }
      setTimeout(() => { closeModal()}, 1500)
    } catch (err) {
      console.error('Error sending response:', err)

      if (err.response?.status === 401) {
        setError('Sitzung abgelaufen. Bitte melde dich erneut an.')
      } else {
        setError(
          err.response?.data?.error ||
            'Fehler beim Senden der Antwort. Bitte versuche es erneut.'
        )
      }
    } finally {
      setLoading(false)
    }
  }

  if (!supportRequest) return null

  return (
    <dialog
      className="support-response-modal__dialog"
      ref={dialogRef}
      onClick={handleDialogClick}
    >
      <div className="support-response-modal__content">
        <form
          className="support-response-modal__form"
          onSubmit={handleSubmit}
          noValidate
        >
          <h2 className="support-response-modal__title h5" id={titleId}>
            Antwort senden
          </h2>

          {error && (
            <div className="support-response-modal__message support-response-modal__message--error">
              {error}
            </div>
          )}

          {success && (
            <div className="support-response-modal__message support-response-modal__message--success">
              {success}
            </div>
          )}

          <div className="support-response-modal__request-info">
            <div className="support-response-modal__info-row">
              <span className="support-response-modal__label">Benutzer:</span>
              <span className="support-response-modal__value">
                {supportRequest.first_name} {supportRequest.last_name}
              </span>
            </div>

            <div className="support-response-modal__info-row">
              <span className="support-response-modal__label">Email:</span>
              <span className="support-response-modal__value">
                {supportRequest.email}
              </span>
            </div>

            <div className="support-response-modal__message-box">
              <span className="support-response-modal__label">
                Nachricht des Benutzers:
              </span>
              <p className="support-response-modal__user-message">
                {supportRequest.message}
              </p>
            </div>
          </div>

          <Field
            className="support-response-modal__form-cell"
            label="Ihre Antwort"
            type="textarea"
            placeholder="Schreibe deine Antwort..."
            isRequired
            value={responseText}
            onChange={handleChange}
          />

          <div className="support-response-modal__form-actions">
            <Button
              className="support-response-modal__cancel-button button--black-08"
              mode="transparent"
              label="Abbrechen"
              type="button"
              onClick={closeModal}
            />
            <Button
              className="support-response-modal__submit-button button--black-08"
              label={loading ? 'Wird gesendet...' : 'Abschicken'}
              type="submit"
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </dialog>
  )
}

export default SupportResponseModal