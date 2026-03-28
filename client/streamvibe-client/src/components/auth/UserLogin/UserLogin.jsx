import { useState } from 'react'
import './UserLogin.scss'
import Field from '../../support-page/Field'
import Checkbox from '../../support-page/Checkbox'
import Button from '../../movie-page/Button'
import Select from '../../support-page/Select'


const phonePrefixOptions = [
  { value: '+49', isSelected: true },
  { value: '+44' },
  { value: '+33' },
  { value: '+39' },
  { value: '+31' },
  { value: '+81' },
  { value: '+385' },
]

const UserLogin = ({ onClose }) => {
  const titleId = 'user-login-title'

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    agreement: false,
  })

  const [state, setState] = useState("login");

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
  
    console.log('Form submitted:', formData)

     if (onClose) {
      onClose()
    }
  }

  return (

      <form className="user-login__form" onSubmit={handleSubmit} noValidate>
    <h1 className="user-login__title h3" id={titleId}>
            {state === "login" ? "Anmelden" : "Account erstellen"}
          </h1>
            <p>
              {state === "login" ? "Bitte melde dich an" : "Die Registrierung ist einfach und kostenlos. Fülle dazu das Formular aus um zu beginnen."}</p>
        <Field
          className="user-login__form-cell"
          label="Benutzername"
          placeholder="Erika Musterfrau"
          isRequired
          value={formData.firstName}
          onChange={handleChange('firstName')}
        />

         <Field
          className="user-login__form-cell"
          label="Email"
          type="email"
          placeholder="example@example.com"
          isRequired
          value={formData.email}
          onChange={handleChange('email')}
        />

        <Field
          className="user-login__form-cell"
          label="Passwort (7 characters minimum)"
          placeholder="********"
          isRequired
          value={formData.lastName}
          onChange={handleChange('lastName')}
        />

        <Field
          className="user-login__form-cell"
          label="Passwort bestätigen"
          placeholder="********"
          isRequired
          value={formData.lastName}
          onChange={handleChange('lastName')}
        />


        <Field
          className="user-login__form-cell"
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


        <div className="user-login__form-cell user-login__form-cell--wide user-login__form-cell--actions">
          <Checkbox
            className="user-login__form-agreement"
            label="Ich stimme den Nutzungsbedingungen und der Datenschutzerklärung zu."
            isRequired
            checked={formData.agreement}
            onChange={handleChange('agreement')}
          />
          <Button
            className="user-login__form-submit-button"
            label="Registrieren"
            type="submit"
          />
        </div>
      </form>

  )
}

export default UserLogin