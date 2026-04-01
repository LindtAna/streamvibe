import { useState, useEffect, useRef, useCallback } from 'react'
import './Header.scss'
import Logo from '../Logo'
import classNames from 'classnames'
import Button from '../../movie-page/Button'
import BurgerButton from '../BurgerButton'
import { useNavigate, Link } from 'react-router-dom'
import UserLogin from '../../auth/UserLogin/UserLogin'
import useAuth from '../../../hooks/useAuth'

import LoginIcon from '../../../assets/icons/login.svg'
import SearchIcon from '../../../assets/icons/search.svg'

const menuItems = [
  { label: 'Home', href: '/' },
  { label: 'Filme', href: '/movies' },
  { label: 'Serien', href: '/serial' },
  { label: 'Merkliste', href: '/saved' },
  { label: 'Support', href: '/support' },
]
// isOpen steuert dialog[open] und die is-active-Klasse des Burger-Menüs
// Schließen per Escape (ein einziger Handler für beide Modalfenster)
// Schließen beim Klick auf den Backdrop
// Fokus-Management beim Öffnen/Schließen
const Header = ({ url, isFixed }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isLogoutVisible, setIsLogoutVisible] = useState(false)

  const { auth, setAuth } = useAuth()
  const dialogRef = useRef(null)
  const loginDialogRef = useRef(null)
  const burgerRef = useRef(null)
  const loginButtonRef = useRef(null)
  const logoutContainerRef = useRef(null)

  const navigate = useNavigate()

  const isAnyModalOpen = isOpen || isLoginOpen

  //   // EIN useEffect für Scroll-Lock
  useEffect(() => {
    const menuDialog = dialogRef.current
    const loginDialog = loginDialogRef.current
    // Scroll wird blockiert, wenn irgendein Modal geöffnet ist
    document.documentElement.classList.toggle('is-lock', isAnyModalOpen)
    // Den open-Attributwert für jedes Dialog-Element separat setzen
    if (menuDialog) menuDialog.open = isOpen
    if (loginDialog) loginDialog.open = isLoginOpen

    return () => {
      document.documentElement.classList.remove('is-lock')
    }
  }, [isAnyModalOpen, isOpen, isLoginOpen])

  // EIN useEffect für Escape handler
  useEffect(() => {
    if (!isAnyModalOpen && !isLogoutVisible) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isLogoutVisible) {
          setIsLogoutVisible(false)
        } else if (isLoginOpen) {
          closeLogin()
        } else if (isOpen) {
          close()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isAnyModalOpen, isLoginOpen, isOpen, isLogoutVisible])


  // logout wird ausgeblendet, wenn man außerhalb des Buttons klickt
  useEffect(() => {
    if (!isLogoutVisible) return

    const handleClickOutside = (e) => {
      if (!logoutContainerRef.current) return

      if (logoutContainerRef.current.contains(e.target)) return

      setIsLogoutVisible(false)
    }

    document.addEventListener('pointerdown', handleClickOutside)
    return () => document.removeEventListener('pointerdown', handleClickOutside)
  }, [isLogoutVisible])


  const handleDialogClick = useCallback((e) => {
    if (e.target === dialogRef.current) close()
  }, [])

  const handleLoginDialogClick = useCallback((e) => {
    if (e.target === loginDialogRef.current) closeLogin()
  }, [])

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => {
    setIsOpen(false)
    setIsLogoutVisible(false)
    burgerRef.current?.focus()
  }, [])


  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const openLogin = useCallback(() => {
    setIsOpen(false)
    requestAnimationFrame(() => {
      setIsLoginOpen(true)
    })
  }, [])

  const closeLogin = useCallback(() => {
    setIsLoginOpen(false)
    loginButtonRef.current?.focus()
  }, [])


  const handleLoginButtonClick = useCallback((e) => {
    e.stopPropagation()
    if (auth) {
      setIsLogoutVisible((prev) => !prev)
    } else {
      openLogin()
    }
  }, [auth, openLogin])

  //// Logout
  const handleLogout = useCallback(() => {
    setAuth(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setIsLogoutVisible(false)
    setIsOpen(false)
    navigate('/')
  }, [setAuth, navigate])

  return (
    <header className={classNames('header', { 'is-fixed': isFixed })}>
      <div className="header__inner container">
        <Logo className="header__logo" loading="eager" />

        {/* Overlay-Menü (mobil + Desktop-actions) */}
        <dialog
          className="header__overlay-menu-dialog"
          ref={dialogRef}
          onClick={handleDialogClick}
        >
          <nav className="header__menu">
            <ul className="header__menu-list">
              {menuItems.map(({ label, href }, index) => (
                <li className="header__menu-item" key={index}>
                  <Link
                    className={classNames('header__menu-link', {
                      'is-active': href === url,
                    })}
                    to={href}
                    onClick={close} 
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Aktionsbuttons (Search + User Login) */}
          <div className="header__actions" ref={logoutContainerRef}>
            <Button
              className="header__button"
              label="Search"
              isLabelHidden
              mode="transparent"
              iconSrc={SearchIcon}
              iconName="search"
              onClick={close}
            />
            <Button
              className="header__button"
              label="User Login"
              isLabelHidden
              mode="transparent"
              iconSrc={LoginIcon}
              iconName="login"
              onClick={handleLoginButtonClick}
              extraAttrs={{ ref: loginButtonRef }}
            />

            {auth && isLogoutVisible && (
              <Button
                className="header__button button--red-06"
                label="Abmelden"
                onClick={handleLogout}
              />
            )}
          </div>
        </dialog>

        <BurgerButton
          className="header__burger-button visible-tablet"
          isActive={isOpen}
          onClick={toggle}
          ref={burgerRef}
        />
      </div>

      {/* Login-Modal */}
      <dialog
        className="header__login-dialog"
        ref={loginDialogRef}
        onClick={handleLoginDialogClick}
      >
        <div className="header__login-content">
          <UserLogin onClose={closeLogin} />
        </div>
      </dialog>
    </header>
  )
}

export default Header