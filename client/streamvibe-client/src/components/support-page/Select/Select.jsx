import { useState, useEffect, useRef, useCallback, useId } from 'react'
import classNames from 'classnames'
import './Select.scss'
import getIdFromTitle from '../../movies-page/getIdFromTitle'


//Benutzerdefiniertes Dropdown-Menü mit Tastaturnavigation (Pfeile, Leertaste, Eingabetaste, Escape)
//Synchronisierung mit dem nativen <select>-Element (für mobile Barrierefreiheit)
//Automatische Positionierung des Dropdown-Menüs
//Natives <select>-Element auf Mobilgeräten, benutzerdefiniert auf Desktop-Computern

const Select = ({
  id: idProp,
  label,
  isLabelHidden = true,
  // Array<{ value: string, isSelected?: boolean }>
  options = [],
  buttonClassName,
  onChange,
  // 'auto' | 'up' | 'down' -- Öffnungsrichtung
  forceDirection = 'auto',
}) => {
  const reactId = useId()
  const baseId = idProp ?? (label ? getIdFromTitle(label) : reactId)

  const ids = {
    originalControl: baseId,
    label: `${baseId}-label`,
    dropdown: `${baseId}-dropdown`,
  }

  const defaultSelected = options.find((o) => o.isSelected) ?? options[0]
  const [selectedValue, setSelectedValue] = useState(
    defaultSelected?.value ?? ''
  )
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(
    options.findIndex((o) => o.value === (defaultSelected?.value ?? ''))
  )
  const [dropdownSide, setDropdownSide] = useState('left') // 'left' | 'right'
  const [dropdownVertical, setDropdownVertical] = useState(
  forceDirection === 'up' ? 'top' : 'bottom') // 'top' | 'bottom'

  const rootRef = useRef(null)
  const buttonRef = useRef(null)
  const dropdownRef = useRef(null)

  // dropdown positioning
  const fixDropdownPosition = useCallback(() => {
    const btn = buttonRef.current
    if (!btn) return

    const viewportWidth = document.documentElement.clientWidth
    const viewportHeight = document.documentElement.clientHeight

    const rect = btn.getBoundingClientRect()

    // LEFT / RIGHT 
    const btnCenterX = rect.x + rect.width / 2
    setDropdownSide(btnCenterX < viewportWidth / 2 ? 'left' : 'right')

    // TOP / BOTTOM 
    if (forceDirection === 'up') {
      setDropdownVertical('top')
    } else if (forceDirection === 'down') {
      setDropdownVertical('bottom')
    } else {
      // AUTO: определяем автоматически
      const spaceBelow = viewportHeight - rect.bottom
      const spaceAbove = rect.top

      if (spaceBelow < 200 && spaceAbove > spaceBelow) {
        setDropdownVertical('top')
      } else {
        setDropdownVertical('bottom')
      }
    }
  }, [forceDirection])

  useEffect(() => {
    const timer = setTimeout(fixDropdownPosition, 500)
    return () => clearTimeout(timer)
  }, [fixDropdownPosition])

  //Schließen beim Klick außerhalb der Komponente
  useEffect(() => {
    if (!isExpanded) return
    const handleOutsideClick = (e) => {
      if (!dropdownRef.current?.contains(e.target) && e.target !== buttonRef.current) {
        setIsExpanded(false)
      }
    }
    document.addEventListener('click', handleOutsideClick)
    return () => document.removeEventListener('click', handleOutsideClick)
  }, [isExpanded])

  //Option auswählen
  const selectOption = useCallback(
    (index) => {
      const value = options[index]?.value
      if (value === undefined) return
      setSelectedValue(value)
      setCurrentIndex(index)
      onChange?.(value)
    },
    [options, onChange]
  )

  // Tastaturnavigation
  const handleKeyDown = useCallback(
    (e) => {
      const isButtonFocused = document.activeElement === buttonRef.current
      const needToExpand = !isExpanded && isButtonFocused

      const actions = {
        ArrowUp: () => {
          if (needToExpand) { setIsExpanded(true); return }
          setCurrentIndex((i) => Math.max(i - 1, 0))
        },
        ArrowDown: () => {
          if (needToExpand) { setIsExpanded(true); return }
          setCurrentIndex((i) => Math.min(i + 1, options.length - 1))
        },
        Space: () => {
          if (needToExpand) { setIsExpanded(true); return }
          selectOption(currentIndex)
          setIsExpanded(false)
        },
        Enter: () => {
          if (needToExpand) { setIsExpanded(true); return }
          selectOption(currentIndex)
          setIsExpanded(false)
        },
        Escape: () => setIsExpanded(false),
      }

      if (actions[e.code]) {
        e.preventDefault()
        actions[e.code]()
      }
    },
    [isExpanded, currentIndex, options.length, selectOption]
  )


  const handleNativeChange = (e) => {
    const index = options.findIndex((o) => o.value === e.target.value)
    if (index >= 0) selectOption(index)
  }

  return (
    <div className="select" ref={rootRef} onKeyDown={handleKeyDown}>
   
      <label
        className={classNames('select__label', {
          'visually-hidden': isLabelHidden,
        })}
        id={ids.label}
        htmlFor={ids.originalControl}
      >
        {label}
      </label>

      {/* Native Select - nur auf Mobilgeräten sichtbar (CSS: visible-mobile) */}
      <select
        className={classNames('select__original-control', buttonClassName)}
        id={ids.originalControl}
        tabIndex={-1}
        value={selectedValue}
        onChange={handleNativeChange}
        aria-labelledby={ids.label}
      >
        {options.map(({ value }, index) => (
          <option key={index} value={value}>
            {value}
          </option>
        ))}
      </select>

      {/* Custom Select– nur auf dem Desktop sichtbar*/}
      <div className="select__body">
        <div
          className={classNames('select__button', buttonClassName, {
            'is-expanded': isExpanded,
          })}
          role="combobox"
          aria-expanded={isExpanded}
          aria-haspopup="listbox"
          aria-controls={ids.dropdown}
          aria-labelledby={ids.label}
          aria-activedescendant={`${baseId}-option-${currentIndex}`}
          tabIndex={0}
          ref={buttonRef}
          onClick={() => setIsExpanded((v) => !v)}
        >
          {selectedValue}
        </div>

        <div
          className={classNames('select__dropdown', {
            'is-expanded': isExpanded,
            'is-on-the-left-side': dropdownSide === 'left',
            'is-on-the-right-side': dropdownSide === 'right',
            'is-on-top': dropdownVertical === 'top',
            'is-on-bottom': dropdownVertical === 'bottom',
          })}
          id={ids.dropdown}
          role="listbox"
          aria-labelledby={ids.label}
          ref={dropdownRef}
        >
          {options.map(({ value }, index) => {
            const isSelected = value === selectedValue
            const isCurrent = index === currentIndex

            return (
              <div
                key={index}
                id={`${baseId}-option-${index}`}
                className={classNames('select__option', {
                  'is-selected': isSelected,
                  'is-current': isCurrent,
                })}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  selectOption(index)
                  setIsExpanded(false)
                }}
              >
                {value}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Select