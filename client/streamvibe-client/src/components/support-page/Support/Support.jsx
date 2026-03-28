import { useState } from 'react'
import './Support.scss'
import Field from '../Field'
import Checkbox from '../Checkbox'
import Button from '../../movie-page/Button'
import Select from '../Select'
import SupportBannerImgSrc from '../../../assets/support.png'


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

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
  
    console.log('Form submitted:', formData)
  }

  return (
    <section className="support container" aria-labelledby={titleId}>
      <div className="support__body">
        <div className="support__info">
          <h1 className="support__title h3" id={titleId}>
            Willkommen auf unserer<br/>Support-Seite!
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

      <form className="support__form" onSubmit={handleSubmit} noValidate>
        <Field
          className="support__form-cell"
          label="Vorname"
          placeholder="Erika"
          isRequired
          value={formData.firstName}
          onChange={handleChange('firstName')}
        />

        <Field
          className="support__form-cell"
          label="Nachname"
          placeholder="Musterfrau"
          isRequired
          value={formData.lastName}
          onChange={handleChange('lastName')}
        />

        <Field
          className="support__form-cell"
          label="Email"
          type="email"
          placeholder="example@example.com"
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
          isRequired
          value={formData.message}
          onChange={handleChange('message')}
        />

        <div className="support__form-cell support__form-cell--wide support__form-cell--actions">
          <Checkbox
            className="support__form-agreement"
            label="Ich stimme den Nutzungsbedingungen und der Datenschutzerklärung zu."
            isRequired
            checked={formData.agreement}
            onChange={handleChange('agreement')}
          />
          <Button
            className="support__form-submit-button"
            label="Nachricht senden"
            type="submit"
          />
        </div>
      </form>
    </section>
  )
}

export default Support