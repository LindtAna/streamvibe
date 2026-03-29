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

  const [state, setState] = useState("login");

 const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    agreement: false,
  })

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
      <h1 className="user-login__title h5" id={titleId}>
        {state === "login" ? "Anmelden" : "Account erstellen"}
      </h1>
      <h2 className="user-login__description h6">
  {state === "login" ? (
    "Bitte melde dich an"
  ) : (
    <>
      Die Registrierung ist einfach und kostenlos.<br />
      Fülle dazu das Formular aus um zu beginnen.
    </>
  )}
</h2>


      {/* LOGIN FORM */}
      {state === 'login' && (
        <>
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
            label="Passwort"
            type="password"
            placeholder="********"
            isRequired
            value={formData.password}
            onChange={handleChange('password')}
          />

 
          <div className="user-login__form-switch">
            Noch kein Account?{' '}
            <span
              className="user-login__link"
              onClick={() => setState('register')}
            >
              Hier klicken
            </span>
          </div>

        <div className="user-login__form-cell user-login__form-cell--actions">
            <Button
              className="user-login__form-submit-button user-login__form-submit-button--login"
              label="Einloggen"
              type="submit"
            />
  </div>
        </>
      )}

      {/* REGISTER FORM */}
      {state === 'register' && (
        <>
          <Field
            className="user-login__form-cell"
            label="Benutzername"
            placeholder="Erika Musterfrau"
            isRequired
            value={formData.username}
            onChange={handleChange('username')}
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
            type="password"
            placeholder="********"
            isRequired
            value={formData.password}
            onChange={handleChange('password')}
          />

          <Field
            className="user-login__form-cell"
            label="Passwort bestätigen"
            type="password"
            placeholder="********"
            isRequired
             value={formData.confirmPassword}
            onChange={handleChange('confirmPassword')}
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
           
            <div className="user-login__form-switch">
            Hast Du bereits einen Account?{' '}
            <span
              className="user-login__link"
              onClick={() => setState('login')}
            >
              Hier klicken
            </span>
          </div>

          <div className="user-login__form-cell user-login__form-cell--actions">
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
             </>
        )}
        </form>
  )
}

      export default UserLogin