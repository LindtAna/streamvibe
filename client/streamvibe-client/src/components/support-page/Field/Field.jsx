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
  // renderBefore — слот для Select (код страны перед полем ввода)
  renderBefore,
  // Остальные props пробрасываются в input/textarea
  ...rest
}) => {
  const fieldId = id ?? getIdFromTitle(label)
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
          type={type}
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