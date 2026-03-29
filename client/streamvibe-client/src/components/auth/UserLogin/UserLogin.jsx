import { useState } from 'react'
import './UserLogin.scss'
import Field from '../../support-page/Field'
import Checkbox from '../../support-page/Checkbox'
import Button from '../../movie-page/Button'
import Select from '../../support-page/Select'
import axiosClient from '../../../api/axiosConfig';
import { useNavigate, Link } from 'react-router-dom';
import Tags from '../../movie-page/Tags'

const prefixOptions = [
  { value: 'Comedy', isSelected: true },
  { value: 'Drama' },
  { value: 'Action' },
  { value: 'Horror' },
  { value: 'Romantik' },
  { value: 'Sci-Fi' },
  { value: 'Fantasy' },
]

const UserLogin = ({ onClose }) => {
  const titleId = 'user-login-title'

  const [state, setState] = useState("login");

  const [formData, setFormData] = useState({
    user_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreement: false,
  })

  const [favouriteGenres, setFavouriteGenres] = useState([])

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleGenreSelect = (genre) => {
    setFavouriteGenres((prev) => {
      if (prev.includes(genre)) return prev // не дублируем
      return [...prev, genre]
    })
  }

  const handleRemoveGenre = (genre) => {
    setFavouriteGenres((prev) => prev.filter((g) => g !== genre))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        user_name: formData.user_name,
        email: formData.email,
        password: formData.password,
        role: defaultRole,
        favourite_genres: favouriteGenres
      };
      const response = await axiosClient.post('/register', payload);
      if (response.data.error) {
        setError(response.data.error);
        return;
      }
      // Registration successful, redirect to login
      navigate('/login', { replace: true });
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
            value={formData.user_name}
            onChange={handleChange('user_name')}
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


          <div className="user-login__form-cell">
            <Select
              label="Favourite Genres"
              isLabelHidden={false}
              options={prefixOptions}
              onChange={handleGenreSelect}
            />

            <div
              className="user-login__tags"
              onClick={(e) => {
                const tagEl = e.target.closest('[data-tag]')
                if (!tagEl) return

                const tag = tagEl.dataset.tag
                handleRemoveGenre(tag)
              }}
            >
              <Tags items={favouriteGenres} />
            </div>
          </div>

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