import './AddMovie.scss'

import { useState } from 'react'

import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
import useAuth from '../../../../hooks/useAuth'

import Field from '../../../components/Field'
import Button from '../../../components/Button'

const INITIAL_FORM_DATA = {
    db_id: '',
    title: '',
    poster_path: '',
    youtube_id: '',
    release_date: '',
    original_language: '',
    director_name: '',
    director_profile_path: '',
    screenwriter_name: '',
    screenwriter_profile_path: '',
    genre_id: '',
    genre_name: '',
    overview: '',
    admin_review: '',
}

const AddMovie = () => {
    const { auth } = useAuth()
    const axiosPrivate = useAxiosPrivate()

    const isDemoAdmin = auth?.email === 'admin-demo@streamvibe.app'

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    const [formData, setFormData] = useState(INITIAL_FORM_DATA)
    const resetForm = () => setFormData(INITIAL_FORM_DATA)


    const handleChange = (field) => (e) => {
        setFormData((prev) => ({
            ...prev,
            [field]: e.target.value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (isDemoAdmin) return
        setLoading(true)

        try {
            //Genre-Eingabe in das vom Backend erwartete Format
            const genresArray = formData.genre_name.trim()
                ? [{
                    genre_id: parseInt(formData.genre_id) || 0,
                    genre_name: formData.genre_name.trim(),
                }]
                : [];
            // Aufbereitung der Daten für die API-Anfrage
            const movieData = {
                db_id: formData.db_id.trim(),
                title: formData.title.trim(),
                poster_path: formData.poster_path.trim(),
                youtube_id: formData.youtube_id.trim(),
                release_date: formData.release_date.trim(),
                original_language: formData.original_language.trim(),
                director: formData.director_name.trim()
                    ? {
                        name: formData.director_name.trim(),
                        profile_path: formData.director_profile_path.trim() || null,
                    }
                    : null,
                screenwriter: formData.screenwriter_name.trim()
                    ? {
                        name: formData.screenwriter_name.trim(),
                        profile_path: formData.screenwriter_profile_path.trim() || null,
                    }
                    : null,
                genre: genresArray,
                overview: formData.overview.trim(),
                admin_review: formData.admin_review.trim(),
            }

            // Senden der Daten an den geschützten Admin-Endpunkt
            const response = await axiosPrivate.post('/admin/addmovie', movieData)

            if (response.data) {
                setSuccess('Film erfolgreich hinzugefügt!')
                setError(null)
                resetForm()
            }
        } catch (err) {
            console.error('Error adding movie:', err)
            setSuccess(null)
            if (err.response?.status === 401) {
                setError('Sitzung abgelaufen. Bitte melde dich erneut an.')
            } else {
                setError(
                    err.response?.data?.error || 'Fehler beim Hinzufügen des Films.'
                )
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="add-movie">
            <h1 className="add-movie__title h4">Gib die Daten zum Film ein</h1>

            {success && <div className="success-message">{success}</div>}
            {error && <div className="error-message">{error}</div>}

            <form className="add-movie__form" onSubmit={handleSubmit} noValidate>
                <div className="add-movie__form-grid">
                    <Field
                        className="add-movie__form-cell"
                        label="Film-ID (db_id)"
                        placeholder="db_movie_1, db_movie_2,.. "
                        isRequired
                        value={formData.db_id}
                        onChange={handleChange('db_id')}
                    />

                    <Field
                        className="add-movie__form-cell"
                        label="Titel"
                        placeholder="z.B. Interstellar"
                        isRequired
                        value={formData.title}
                        onChange={handleChange('title')}
                    />

                    <Field
                        className="add-movie__form-cell"
                        label="Poster URL"
                        placeholder="https://..."
                        isRequired
                        value={formData.poster_path}
                        onChange={handleChange('poster_path')}
                    />

                    <Field
                        className="add-movie__form-cell"
                        label="YouTube ID"
                        placeholder="Video-ID in dem YouTube-Link ist nach  '/watch?v=' "
                        isRequired
                        value={formData.youtube_id}
                        onChange={handleChange('youtube_id')}
                    />

                    <Field
                        className="add-movie__form-cell"
                        label="Erscheinungsdatum"
                        placeholder="z.B. 2005"
                        value={formData.release_date}
                        onChange={handleChange('release_date')}
                    />

                    <Field
                        className="add-movie__form-cell"
                        label="Originalsprache"
                        placeholder="z.B. Deutsch"
                        value={formData.original_language}
                        onChange={handleChange('original_language')}
                    />

                    <Field
                        className="add-movie__form-cell"
                        label="Regisseur Name"
                        placeholder="z.B. Wes Anderson"
                        value={formData.director_name}
                        onChange={handleChange('director_name')}
                    />

                    <Field
                        className="add-movie__form-cell"
                        label="Regisseur Bild URL"
                        placeholder="https://..."
                        value={formData.director_profile_path}
                        onChange={handleChange('director_profile_path')}
                    />

                    <Field
                        className="add-movie__form-cell"
                        label="Drehbuchautor Name"
                        placeholder="z.B. Allison Schroeder"
                        value={formData.screenwriter_name}
                        onChange={handleChange('screenwriter_name')}
                    />

                    <Field
                        className="add-movie__form-cell"
                        label="Drehbuchautor Bild URL"
                        placeholder="https://..."
                        value={formData.screenwriter_profile_path}
                        onChange={handleChange('screenwriter_profile_path')}
                    />

                    <Field
                        className="add-movie__form-cell"
                        label="Genres (durch Komma getrennt)"
                        placeholder="z.B. Drama, Crime, Thriller"
                        isRequired
                        value={formData.genre_name}
                        onChange={handleChange('genre_name')}
                    />

                    <Field
                        className="add-movie__form-cell"
                        label="Genre ID"
                        placeholder="1, 2 ,3"
                        isRequired
                        value={formData.genre_id}
                        onChange={handleChange('genre_id')}
                    />




                    <Field
                        className="add-movie__form-cell add-movie__form-cell--wide"
                        label="Handlung"
                        type="textarea"
                        placeholder="Der Film erzählt die Geschichte..."
                        value={formData.overview}
                        onChange={handleChange('overview')}
                    />

                    <Field
                        className="add-movie__form-cell add-movie__form-cell--wide"
                        label="Redaktions-Review"
                        type="textarea"
                        placeholder="Dieser Film ist eine wirklich schöne kleine Reise in..."
                        value={formData.admin_review}
                        onChange={handleChange('admin_review')}
                    />
                </div>

                <div className="add-movie__form-actions">
                    <Button
                        className="add-movie-submit-button"
                        type="submit"
                        label={loading ? 'Wird hochgeladen...' : 'Hochladen'}
                        disabled={loading}
                    />
                </div>
            </form>
        </div>
    )
}

export default AddMovie