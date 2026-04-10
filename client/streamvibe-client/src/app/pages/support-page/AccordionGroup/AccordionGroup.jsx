import './AccordionGroup.scss'

import classNames from 'classnames'

const AccordionGroup = ({
  className,
  // '' (default) | 'episodes'
  mode = '',
  columns = 1,
  children,
  isOrderedList = true,
}) => {
  const childrenArray = Array.isArray(children) ? children : [children]
  const itemsPerColumn = Math.ceil(childrenArray.length / columns)
  const ListTag = isOrderedList ? 'ol' : 'ul'

  return (
    <ListTag
      className={classNames(className, 'accordion-group', {
        [`accordion-group--${columns}-columns`]: columns > 1,
        'accordion-group--has-counter': isOrderedList,
        [`accordion-group--${mode}`]: mode,
      })}
    >
      {childrenArray.map((child, index) => (
        <li
          key={index}
          className={classNames('accordion-group__item', {
            'accordion-group__item--last-column-item':
              columns > 1 && (index + 1) % itemsPerColumn === 0,
          })}
        >
          {child}
        </li>
      ))}
    </ListTag>
  )
}

export default AccordionGroup