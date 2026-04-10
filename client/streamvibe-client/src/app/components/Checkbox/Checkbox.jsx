import './Checkbox.scss'

import classNames from 'classnames'

import getIdFromTitle from '../getIdFromTitle'

const Checkbox = ({
  className,
  id,
  label,
  isRequired,
  checked,
  onChange,
  ...rest
}) => {
  const checkboxId = id ?? getIdFromTitle(label)

  return (
    <label className={classNames(className, 'checkbox')} htmlFor={checkboxId}>
      <input
        className="checkbox__input"
        id={checkboxId}
        type="checkbox"
        required={isRequired}
        checked={checked}
        onChange={onChange}
        {...rest}
      />
      <span className="checkbox__label">{label}</span>
    </label>
  )
}

export default Checkbox