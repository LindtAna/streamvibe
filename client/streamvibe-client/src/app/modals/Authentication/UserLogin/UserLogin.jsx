import './UserLogin.scss'

import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import axiosClient from '../../../../api/axiosConfig'
import useAuth from '../../../../hooks/useAuth'

import Field from '../../../components/Field'
import Checkbox from '../../../components/Checkbox'
import Button from '../../../components/Button'
import Select from '../../../components/Select'
import Tags from '../../../components/Tags'


const UserLogin = ({ onClose }) => {
  const titleId = 'user-login-title'

  const { setAuth } = useAuth()
  const [mode, setMode] = useState("login")

  const [formData, setFormData] = useState({
    user_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreement: false,
  })

  const genresOptions = [
    { value: 'Animation', isSelected: true },
    { value: 'Action' },
    { value: 'Doku' },
    { value: 'Fantasy' },
    { value: 'Komödie' },
    { value: 'Krimi' },
    { value: 'Science Fiction' },
    { value: 'Drama' },
    { value: 'Thriller' },
    { value: 'Horror' },

  ]

  const [favouriteGenres, setFavouriteGenres] = useState([])

  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || "/"

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 1500)
      return () => clearTimeout(timer)
    }
  }, [success])


  ///CHECKBOX////////////
  const handleChange = (field) => (e) => {
    const { type, checked, value } = e.target
    setFormData(prev => ({
      ...prev,
      [field]: type === 'checkbox' ? checked : value
    }))
  }

  ///GENRES////////////
  const handleGenreSelect = (genre) => {
    setFavouriteGenres(prev =>
      prev.includes(genre) ? prev : [...prev, genre]
    )
  }

  const handleRemoveGenre = (genre) => {
    setFavouriteGenres((prev) => prev.filter((g) => g !== genre))
  }


  ///CLEAR FORM////////////
  const resetForm = () => {
    setFormData({
      user_name: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreement: false,
    })
    setFavouriteGenres([])
    setError(null)
    setSuccess(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null)
    setSuccess(null)

    if (mode === 'login') {
      handleLogin();
    } else {
      handleRegister();
    }
  }

  ///LOGIN//////////// handleLogout ist in Komponente Header.jsx
  const handleLogin = async () => {

    if (!formData.email || !formData.password) {
      setError('Bitte fülle alle Pflichtfelder aus.')
      return
    }

    setLoading(true);
    try {
      const payload = {
        email: formData.email,
        password: formData.password,
      }
      const response = await axiosClient.post('/login', payload)

      if (response.data.error) {
        setError(response.data.error)
        return
      }
      setAuth(response.data)
      setSuccess('Login erfolgreich! Weiterleitung...')
      setTimeout(() => {
        resetForm()
        if (onClose) onClose()
        navigate(from, { replace: true })
      }, 1000)

    } catch (err) {
      setError('Login fehlgeschlagen. Bitte überprüfe deine Anmeldedaten.')
      console.error('Login error:', err)
    } finally {
      setLoading(false);
    }
  }


  ///REGISTRATION////////////
  const handleRegister = async () => {
    if (!formData.user_name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Bitte fülle alle Pflichtfelder aus.')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwörter stimmen nicht überein.')
      return
    }

    if (formData.password.length < 7) {
      setError('Passwort muss mindestens 7 Zeichen lang sein.')
      return;
    }

    if (!formData.agreement) {
      setError('Bitte akzeptiere die Nutzungsbedingungen.')
      return;
    }

    // if (favouriteGenres.length === 0) {
    //   setError('Bitte wähle mindestens ein Genre aus.');
    //   return;
    // }

    setLoading(true)

    try {
      // die aktuelle Liste der Genres vom Server abrufen
      let genresFormatted = [];

      try {
        const genresResponse = await axiosClient.get('/genres');
        const allGenres = genresResponse.data;

        // Abgleich der ausgewählten Genres mit den Serverdaten
        genresFormatted = favouriteGenres
          .map(genreName => allGenres.find(g => g.genre_name === genreName))
          .filter(Boolean);

        // falls es nicht möglich war, Genres vom Server abzurufen, werden temporäre IDs verwendet.
        if (genresFormatted.length === 0) {
          genresFormatted = favouriteGenres.map((genreName, index) => ({
            genre_id: index + 1,
            genre_name: genreName
          }));
        }
      } catch (genreErr) {
        // Falls es nicht möglich war, Genres vom Server abzurufen, verwenden wir temporäre IDs.
        console.warn('Could not fetch genres from server, using temporary IDs');
        genresFormatted = favouriteGenres.map((genreName, index) => ({
          genre_id: index + 1,
          genre_name: genreName
        }));
      }

      const payload = {
        user_name: formData.user_name,
        email: formData.email,
        password: formData.password,
        role: 'USER',
        favourite_genres: genresFormatted
      };

      const response = await axiosClient.post('/register', payload)

      if (response.data.error) {
        setError(response.data.error);
        return;
      }


      resetForm()
      setSuccess('Registrierung erfolgreich! Bitte melde dich jetzt an.')
      setMode('login')

    } catch (err) {
      console.error('Registration error:', err);

      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.status === 409) {
        setError('Ein Benutzer mit dieser E-Mail existiert bereits.');
      } else {
        setError('Registrierung fehlgeschlagen. Bitte versuche es erneut.');
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <form className="user-login__form" onSubmit={handleSubmit} noValidate>
      <h1 className="user-login__title h5" id={titleId}>
        {mode === "login" ? "Anmelden" : "Account erstellen"}
      </h1>
      <h2 className="user-login__description h6">
        {mode === "login" ? (
          "Bitte melde dich an"
        ) : (
          <>
            Die Registrierung ist einfach und kostenlos.<br />
            Fülle dazu das Formular aus um zu beginnen.
          </>
        )}
      </h2>

      {error && (
        <div className="user-login__message user-login__message--error">
          {error}
        </div>
      )}

      {success && (
        <div className="user-login__message user-login__message--success">
          {success}
        </div>
      )}

      {/* LOGIN FORM */}
      {mode === 'login' && (
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
              onClick={() => {
                setMode('register')
                resetForm()
              }}
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
      {mode === 'register' && (
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
              label="Lieblingsgenres"
              isLabelHidden={false}
              options={genresOptions}
              onChange={handleGenreSelect}
              forceDirection="up"
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
              onClick={() => {
                setMode('login')
                resetForm()
              }}
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
              className="user-login__form-submit-button user-login__form-submit-button--login"
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