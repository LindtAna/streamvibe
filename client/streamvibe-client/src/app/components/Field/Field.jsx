import './Field.scss'

import classNames from 'classnames'

import getIdFromTitle from '../getIdFromTitle'

const Field = ({
  className,
  id,
  label,
  // undefined (default) | 'email' | 'textarea'
  type,
  placeholder,
  isRequired,
  inputMode,
  // renderBefore — Slot für Select (Ländercode vor dem Eingabefeld)
  renderBefore,
  error,
  // Die restlichen Eigenschaften werden an das Eingabefeld/Textfeld übergeben.
  ...rest
}) => {
  const fieldId = id ?? getIdFromTitle(label ?? 'field')
  const Component = type === 'textarea' ? 'textarea' : 'input'
  const hasError = error !== undefined ? Boolean(error) : false

  return (
    <div className={classNames(className, 'field')}>
      <label className="field__label" htmlFor={fieldId}>
        {label}{' '}
        {isRequired && (
          <span className="field__required-star" aria-hidden={true}>
            *
          </span>
        )}
      </label>
      <div className="field__body">
        {renderBefore?.('field__control')}
        <Component
          className={classNames('field__control', {
            'field__control--error': hasError,
          })}
          id={fieldId}
          {...(Component === 'input' ? { type } : {})}
          placeholder={placeholder}
          required={error === undefined ? isRequired : false}
          inputMode={inputMode}
          {...rest}
        />
      </div>
      {hasError && (
  <div className="field__error">
    {error}
  </div>
)}
    </div>
  )
}

export default Field