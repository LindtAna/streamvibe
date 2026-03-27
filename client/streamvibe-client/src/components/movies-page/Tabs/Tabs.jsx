import { useState, useEffect, useRef, useCallback } from 'react'
import classNames from 'classnames'
import './Tabs.scss'
import getIdFromTitle from '../getIdFromTitle'

const getTabIds = (title) => {
  const formatted = getIdFromTitle(title)
  return {
    buttonId: `${formatted}-tab`,
    contentId: `${formatted}-tabpanel`,
  }
}

const Tabs = ({
  className,
  title,
  items = [],
  navigationTargetElementId = null,
  inEnableOnlyOnMobile = false,
}) => {
  if (!items.length) return null

  const initialIndex = items.findIndex((item) => item.isActive)
  const [activeIndex, setActiveIndex] = useState(
    initialIndex >= 0 ? initialIndex : 0
  )

  const navRef = useRef(null)
  const buttonRefs = useRef([])

  const updateIndicator = useCallback((index) => {
    const nav = navRef.current
    const btn = buttonRefs.current[index]
    if (!nav || !btn) return

    const { width, left } = btn.getBoundingClientRect()
    const navLeft = nav.getBoundingClientRect().left
    const offsetLeft = left - navLeft

    nav.style.setProperty('--tabsNavigationActiveButtonWidth', `${width}px`)
    nav.style.setProperty(
      '--tabsNavigationActiveButtonOffsetLeft',
      `${offsetLeft}px`
    )
  }, [])

  useEffect(() => {
    updateIndicator(activeIndex)
  }, [activeIndex, updateIndicator])

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return
    const observer = new ResizeObserver(() => updateIndicator(activeIndex))
    observer.observe(nav)
    return () => observer.disconnect()
  }, [activeIndex, updateIndicator])

  const handleKeyDown = useCallback(
    (e) => {
      const limit = items.length - 1
      const actions = {
        ArrowLeft: () => setActiveIndex((i) => (i === 0 ? limit : i - 1)),
        ArrowRight: () => setActiveIndex((i) => (i === limit ? 0 : i + 1)),
        Home: () => setActiveIndex(0),
        End: () => setActiveIndex(limit),
      }

      if (e.metaKey && e.code === 'ArrowLeft') {
        e.preventDefault()
        setActiveIndex(0)
        return
      }
      if (e.metaKey && e.code === 'ArrowRight') {
        e.preventDefault()
        setActiveIndex(limit)
        return
      }

      if (actions[e.code]) {
        e.preventDefault()
        actions[e.code]()
      }
    },
    [items.length]
  )

  useEffect(() => {
    buttonRefs.current[activeIndex]?.focus()
  }, [activeIndex])

  const baseId = getIdFromTitle(title || 'tabs')
  const navId = navigationTargetElementId || `${baseId}-navigation`
  const titleId = `${baseId}-title`

  return (
    <div
      className={classNames(className, 'tabs', {
        'tabs--enable-only-on-mobile': inEnableOnlyOnMobile,
      })}
    >
      {/* Navigation */}
      <div
        className="tabs-navigation"
        id={navId}
        role="tablist"
        aria-labelledby={titleId}
        ref={navRef}
        onKeyDown={handleKeyDown}
      >
        <h3 className="visually-hidden" id={titleId}>
          {title}
        </h3>

        {items.map((item, index) => {
          const { buttonId, contentId } = getTabIds(item.title)
          const isActive = index === activeIndex

          return (
            <button
              key={buttonId}
              type="button"
              id={buttonId}
              role="tab"
              aria-selected={isActive}
              aria-controls={contentId}
              tabIndex={isActive ? 0 : -1}
              className={classNames('tabs-navigation__button visually-hidden', {
                'is-active': isActive,
              })}
              ref={(el) => {
                buttonRefs.current[index] = el
              }}
              onClick={() => setActiveIndex(index)}
            >
              {item.title}
            </button>
          )
        })}
      </div>

      {/* Content panels */}
      <div className="tabs__body">
        {items.map((item, index) => {
          const { buttonId, contentId } = getTabIds(item.title)
          const isActive = index === activeIndex

          return (
            <div
              key={contentId}
              className={classNames('tabs__content', { 'is-active': isActive })}
              id={contentId}
              role="tabpanel"
              aria-labelledby={buttonId}
              tabIndex={0}
            >
              {item.children}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Tabs
