import { useState, useEffect, useRef, useCallback } from 'react'
import './Header.scss'
import Logo from '../Logo'
import classNames from 'classnames'
import Button from '../../movie-page/Button'
import BurgerButton from '../BurgerButton'

import LoginIcon from '../../../assets/icons/login.svg'
import SearchIcon from '../../../assets/icons/search.svg'

const menuItems = [
  { label: 'Home',href: '/' },
  { label: 'Filme', href: '/movies' },
  { label: 'Serien', href: '/serial' },
  { label: 'Merkliste', href: '/saved' },
  { label: 'Support',href: '/support' },
]

// Header
//isOpen steuert dialog[open] und die is-active-Klasse des Burgermenüs
//Scrollsperre über die is-lock-Klasse von <html>
//Schließt sich mit Escape
//Schließt sich beim Klick auf den Hintergrund (Klicken auf das Dialogfeld außerhalb des Menüs)
//Fokusfalle: Beim Öffnen wird der Fokus auf das Dialogfeld gesetzt
//Beim Schließen kehrt der Fokus zum Burgermenü zurück

const Header = ({ url, isFixed }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dialogRef = useRef(null)
  const burgerRef = useRef(null)


  useEffect(() => {
    document.documentElement.classList.toggle('is-lock', isOpen)

    return () => {
      document.documentElement.classList.remove('is-lock')
    }
  }, [isOpen])


  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    dialog.open = isOpen
  }, [isOpen])


  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') close()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const handleDialogClick = useCallback((e) => {
    if (e.target === dialogRef.current) close()
  }, [])

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => {
    setIsOpen(false)
   
    burgerRef.current?.focus()
  }, [])

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  return (
    <header
      className={classNames('header', { 'is-fixed': isFixed })}
    >
      <div className="header__inner container">
        <Logo className="header__logo" loading="eager" />

        <dialog
          className="header__overlay-menu-dialog"
          ref={dialogRef}
          onClick={handleDialogClick}
        >
          <nav className="header__menu">
            <ul className="header__menu-list">
              {menuItems.map(({ label, href }, index) => (
                <li className="header__menu-item" key={index}>
                  <a
                    className={classNames('header__menu-link', {
                      'is-active': href === url,
                    })}
                    href={href}
                    onClick={isOpen ? close : undefined}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="header__actions">
            <Button
              className="header__button"
              label="Search"
              isLabelHidden
              mode="transparent"
              iconSrc={SearchIcon}
              iconName="search"
              onClick={isOpen ? close : undefined}
            />
            <Button
              className="header__button"
              label="User Login"
              isLabelHidden
              mode="transparent"
              iconSrc={LoginIcon}
              iconName="login"
              onClick={isOpen ? close : undefined}
            />
          </div>
        </dialog>

        <BurgerButton
          className="header__burger-button visible-tablet"
          isActive={isOpen}
          onClick={toggle}
          ref={burgerRef}
        />
      </div>
    </header>
  )
}

export default Header