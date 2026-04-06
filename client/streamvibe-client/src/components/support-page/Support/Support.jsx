import { useState } from 'react'
import './Support.scss'
import Field from '../Field'
import Checkbox from '../Checkbox'
import Button from '../../movie-page/Button'
import Select from '../Select'
import SupportBannerImgSrc from '../../../assets/support.png'
import axiosClient from '../../../api/axiosConfig'


const phonePrefixOptions = [
  { value: '+49', isSelected: true },
  { value: '+44' },
  { value: '+33' },
  { value: '+39' },
  { value: '+31' },
  { value: '+81' },
  { value: '+385' },
]

const Support = () => {
  const titleId = 'support-title'

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    agreement: false,
  })

  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const [globalError, setGlobalError] = useState(null)
  const [success, setSuccess] = useState(null)

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData((prev) => ({ ...prev, [field]: value }))
    setFieldErrors((prev) => ({ ...prev, [field]: null }))
    setGlobalError(null)
    setSuccess(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFieldErrors({})
    setGlobalError(null)
    setSuccess(null)

    const errors = {}

    if (!formData.firstName.trim()) errors.firstName = 'Bitte gib deinen Vornamen ein.'
    if (!formData.lastName.trim()) errors.lastName = 'Bitte gib deinen Nachnamen ein.'
    if (!formData.email.trim()) errors.email = 'Bitte gib deine E-Mail-Adresse ein.'

    if (!formData.message.trim()) {
      errors.message = 'Bitte schreibe eine Nachricht.'
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Mindestens 10 Zeichen lang.'
    }

    if (!formData.agreement) {
      errors.agreement = 'Bitte akzeptiere die Nutzungsbedingungen.'
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setLoading(true)

    try {
      const payload = {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim(),
      }

      const response = await axiosClient.post('/support', payload)

      if (response.status === 201) {
        setSuccess('Deine Nachricht wurde erfolgreich gesendet! Wir werden uns bald bei dir melden.')

        setFieldErrors({})

        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: '',
          agreement: false,
        })
        
        setTimeout(() => {
          setSuccess(null)
        }, 3000)

      }
    } catch (err) {
      console.error('Support request error:', err)

      if (err.response?.data?.error) {
        setGlobalError(`Fehler: ${err.response.data.error}`)
      } else {
        setGlobalError('Es gab ein Problem beim Senden deiner Nachricht. Bitte versuche es später erneut.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="support container" aria-labelledby={titleId}>
      <div className="support__body">
        <div className="support__info">
          <h1 className="support__title h3" id={titleId}>
            Willkommen auf unserer<br />Support-Seite!
          </h1>
          <div className="support__description">
            <p>Wir sind hier, um dir bei allen Problemen mit unserem Produkt zu helfen</p>
          </div>
        </div>
        <img
          className="support__image"
          src={SupportBannerImgSrc}
          alt="Support"
          loading="lazy"
        />
      </div>

      <div className="support__form-wrapper">
        {globalError && (
          <div className="support__message support__message--error">
            {globalError}
          </div>
        )}

        {success && (
          <div className="support__message support__message--success">
            {success}
          </div>
        )}

        <form className="support__form" onSubmit={handleSubmit} noValidate>
          <Field
            className="support__form-cell"
            label="Vorname"
            placeholder="Erika"
            error={fieldErrors.firstName}
            isRequired
            value={formData.firstName}
            onChange={handleChange('firstName')}
          />

          <Field
            className="support__form-cell"
            label="Nachname"
            placeholder="Musterfrau"
            error={fieldErrors.lastName}
            isRequired
            value={formData.lastName}
            onChange={handleChange('lastName')}
          />

          <Field
            className="support__form-cell"
            label="Email"
            type="email"
            placeholder="example@example.com"
            error={fieldErrors.email}
            isRequired
            value={formData.email}
            onChange={handleChange('email')}
          />

          <Field
            className="support__form-cell"
            label="Handy / Mobile"
            placeholder="(0123) 987-65-43"
            inputMode="tel"
            value={formData.phone}
            onChange={handleChange('phone')}
            renderBefore={(buttonClassName) => (
              <Select
                label="Phone number prefix"
                buttonClassName={buttonClassName}
                options={phonePrefixOptions}
              />
            )}
          />

          <Field
            className="support__form-cell support__form-cell--wide"
            label="Nachricht"
            type="textarea"
            placeholder="Hallo! Ich habe eine Frage..."
            error={fieldErrors.message}
            isRequired
            value={formData.message}
            onChange={handleChange('message')}
          />

          <div className="support__form-cell support__form-cell--wide support__form-cell--actions">
            <div className="support__form-agreement-wrapper">
              {fieldErrors.agreement && (
                <span className="support__error-text">{fieldErrors.agreement}</span>
              )}
              <Checkbox
                className="support__form-agreement"
                label="Ich stimme den Nutzungsbedingungen und der Datenschutzerklärung zu."
                isRequired
                checked={formData.agreement}
                onChange={handleChange('agreement')}
              />
            </div>
            <Button
              className="support__form-submit-button"
              label={loading ? 'Wird gesendet...' : 'Nachricht senden'}
              type="submit"
              extraAttrs={{ disabled: loading }}
            />
          </div>
        </form>
      </div>
    </section>
  )
}

export default Support