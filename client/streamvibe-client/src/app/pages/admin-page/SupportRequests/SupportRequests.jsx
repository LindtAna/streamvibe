import './SupportRequests.scss'

import { useState, useEffect } from 'react'

import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'

import Button from '../../../components/Button'
import SupportResponse from '../../../modals/SupportResponse'

const SupportRequests = () => {
  const axiosPrivate = useAxiosPrivate()
  const [supportRequests, setSupportRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  // Initialer Datenabruf beim Laden der Komponente
  useEffect(() => {
    fetchSupportRequests()
  }, [])

  // Funktion zum Abrufen der Support-Anfragen von der API
  const fetchSupportRequests = async () => {
    try {
      const response = await axiosPrivate.get('/admin/support-requests')
      // Prüfung, ob die Datenstruktur dem erwarteten Format entspricht
      if (response.data && Array.isArray(response.data.data)) {
        setSupportRequests(response.data.data)
        } else {
        setSupportRequests([])
      }
    } catch (err) {
      console.error('Error fetching support requests:', err)
      setError('Fehler beim Laden der Support-Anfragen.')
    } finally {
      setLoading(false)
    }
  }

  // Öffnet das Antwort-Modal(/modals/SupportResponse)
  const handleOpenModal = (request) => {
    setSelectedRequest(request)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedRequest(null)
  }

  // Callback-Funktion für erfolgreich gesendete Antwort
  const handleResponseSent = () => {
   setSuccess('Antwort erfolgreich gesendet!')
    fetchSupportRequests()
  }

   // Löschen einer Support-Anfrage
const handleDeleteRequest = async (requestId) => {
    // Блокируем удаление для демо-админа
    if (isDemoMode) {
      setError('Demo-Modus: Löschen von Support-Anfragen ist nicht erlaubt.')
      setTimeout(() => setError(null), 3000)
      return
    }

    // Bestätigung vor dem Löschen
    if (!window.confirm('Möchten Sie diese Support-Anfrage wirklich löschen?')) {
      return
    }

    try {
      await axiosPrivate.delete(`/admin/support-request/${requestId}`)
      setSuccess('Support-Anfrage erfolgreich gelöscht!')
      // Aktualisiere die Liste nach erfolgreichem Löschen
      fetchSupportRequests()
    } catch (err) {
      console.error('Error deleting support request:', err)
      setError('Fehler beim Löschen der Support-Anfrage.')
    }
  }


  //Formatierung von Zeitstempeln in lokales Format
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="support-requests">
        <div className="support-requests__loading">
          <div className="support-requests__spinner" />
          <p>Lade Support-Anfragen...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="support-requests">
      <h1 className="support-requests__title h4">Support-Anfragen</h1>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}


      {supportRequests.length === 0 ? (
        <div className="support-requests__empty">
          <p>Keine Support-Anfragen vorhanden.</p>
        </div>
      ) : (
        <div className="support-requests__list">
          {supportRequests.map((request) => (
            <div key={request._id} className="support-request-card">
              <div className="support-request-card__header">
                <div className="support-request-card__user-info">
                  <h3 className="support-request-card__name h6">
                    {request.first_name} {request.last_name}
                  </h3>
                  <p className="support-request-card__date">
                    {formatDate(request.created_at)}
                  </p>
                </div>
                <Button
                  className="support-request-card__reply-button"
                  mode="black-08"
                  label="Antworten"
                  onClick={() => handleOpenModal(request)}
                />

                <Button
                  className="support-request-card__reply-button"
                  mode="black-08"
                  label="Löschen"
                  onClick={() => handleDeleteRequest(request._id)}
                />
              </div>

              <div className="support-request-card__body">
                <div className="support-request-card__contact">
                  <div className="support-request-card__contact-item">
                    <span className="support-request-card__label">Email:</span>
                    <a
                      href={`mailto:${request.email}`}
                      className="support-request-card__link"
                    >
                      {request.email}
                    </a>
                  </div>
                  {request.phone && (
                    <div className="support-request-card__contact-item">
                      <span className="support-request-card__label">
                        Telefon:
                      </span>
                      <a
                        href={`tel:${request.phone}`}
                        className="support-request-card__link"
                      >
                        {request.phone}
                      </a>
                    </div>
                  )}
                </div>

                <div className="support-request-card__message">
                  <span className="support-request-card__label">
                    Nachricht:
                  </span>
                  <p className="support-request-card__text">{request.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedRequest && (
        <SupportResponse
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          supportRequest={selectedRequest}
          onResponseSent={handleResponseSent}
        />
      )}
    </div>
  )
}

export default SupportRequests