import { useState } from 'react'
import './AddReview.scss'
import Field from '../../support-page/Field'
import Button from '../Button'
import RatingView from '../RatingView'

const AddReview = () => {
  const titleId = 'add-review-title'

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
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
    <section className="add-review" aria-labelledby={titleId}>
      <form className="add-review__form" onSubmit={handleSubmit} noValidate>
        <Field
          className="add-review__form-cell"
          label="Name"
          placeholder="Erika Musterfrau"
          isRequired
          value={formData.firstName}
          onChange={handleChange('firstName')}
        />

        <Field
          className="add-review__form-cell"
          label="Land"
          placeholder="z. B. Deutschland"
          isRequired
          value={formData.lastName}
          onChange={handleChange('lastName')}
        />

        <Field
          className="add-review__form-cell add-review__form-cell--wide"
          label="Email"
          type="email"
          placeholder="example@example.com"
          isRequired
          value={formData.email}
          onChange={handleChange('email')}
        />

        <RatingView />


        <Field
          className="add-review__form-cell add-review__form-cell--wide"
          label="Nachricht"
          type="textarea"
          placeholder="Schreibe deine Meinung zum Film…"
          isRequired
          value={formData.message}
          onChange={handleChange('message')}
        />

        <div className="add-review__form-cell add-review__form-cell--wide add-review__form-cell--actions">
          <Button
            className="add-review__form-submit-button"
            label="Absenden"
            type="submit"
          />
        </div>
      </form>
    </section>
  )
}

export default AddReview