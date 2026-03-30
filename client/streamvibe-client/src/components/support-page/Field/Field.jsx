import './Field.scss'
import classNames from 'classnames'
import getIdFromTitle from '../../movies-page/getIdFromTitle'

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
  // Die restlichen Eigenschaften werden an das Eingabefeld/Textfeld übergeben.
  ...rest
}) => {
  const fieldId = id ?? getIdFromTitle(label ?? 'field')
  const Component = type === 'textarea' ? 'textarea' : 'input'

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
          className="field__control"
          id={fieldId}
          {...(Component === 'input' ? { type } : {})}
          placeholder={placeholder}
          required={isRequired}
          inputMode={inputMode}
          {...rest}
        />
      </div>
    </div>
  )
}

export default Field