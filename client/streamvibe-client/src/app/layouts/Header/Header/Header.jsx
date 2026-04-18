import './Header.scss'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import classNames from 'classnames'

import useAuth from '../../../../hooks/useAuth'
import axiosClient from '../../../../api/axiosConfig'

import Button from '../../../components/Button'
import UserLogin from '../../../modals/Authentication/UserLogin'

import BurgerButton from '../BurgerButton'
import Logo from '../Logo'
import SearchBar from '../SearchBar'

import LoginIcon from '../../../../assets/icons/login.svg'
import LogoutIcon from '../../../../assets/icons/logout.svg'
import SearchIcon from '../../../../assets/icons/search.svg'

const menuItems = [
  { label: 'Home', href: '/' },
  { label: 'Filme', href: '/movies' },
  { label: 'Serien', href: '/series' },
  { label: 'Merkliste', href: '/saved' },
  { label: 'Support', href: '/support' },
]

const Header = ({ url, isFixed }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const { auth, setAuth } = useAuth()
  
  const dialogRef = useRef(null)
  const loginDialogRef = useRef(null)
  const burgerRef = useRef(null)
  const loginButtonRef = useRef(null)
  const searchButtonRef = useRef(null)

  const location = useLocation()
  const navigate = useNavigate()

  const isAnyModalOpen = isOpen || isLoginOpen || isSearchOpen

  useEffect(() => {
    document.documentElement.classList.toggle('is-lock', isAnyModalOpen)
    return () => {
      document.documentElement.classList.remove('is-lock')
    }
  }, [isAnyModalOpen])

 
  useEffect(() => {
    const menuDialog = dialogRef.current
    if (!menuDialog) return

    if (isOpen && !menuDialog.open) {
      menuDialog.showModal()
    } else if (!isOpen && menuDialog.open) {
      menuDialog.close()
    }
  }, [isOpen])

  useEffect(() => {
    const loginDialog = loginDialogRef.current
    if (!loginDialog) return

    if (isLoginOpen && !loginDialog.open) {
      loginDialog.showModal()
    } else if (!isLoginOpen && loginDialog.open) {
      loginDialog.close()
    }
  }, [isLoginOpen])

  useEffect(() => {
    if (location.pathname !== '/search') {
      setIsSearchOpen(false);
    }
  }, [location.pathname]);


  // HANDLERS
  const closeMenu = useCallback(() => {
    setIsOpen(false)
    burgerRef.current?.focus()
  }, [])

  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const openLogin = useCallback(() => {
    setIsOpen(false)
    setIsLoginOpen(true)
  }, [])

  const closeLogin = useCallback(() => {
    setIsLoginOpen(false)
    loginButtonRef.current?.focus()
  }, [])

  const openSearch = useCallback(() => {
    setIsOpen(false)
    setIsSearchOpen(true)
  }, [])

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false)
    searchButtonRef.current?.focus()
  }, [])

  const handleLogout = useCallback(async () => {
    try {
      await axiosClient.post('/logout', { user_id: auth.user_id })
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      setAuth(null)
      setIsOpen(false)
      navigate('/')
    }
  }, [auth, setAuth, navigate])

  const handleDialogBackdropClick = useCallback((e, closeFunc) => {
    if (e.target === e.currentTarget) {
      closeFunc()
    }
  }, [])

  
 return (
    <header className={classNames('header', { 'is-fixed': isFixed })}>
      <div className="header__inner container">
        <Logo className="header__logo" loading="eager" />

        <dialog
          className="header__overlay-menu-dialog"
          ref={dialogRef}
          onClick={(e) => handleDialogBackdropClick(e, closeMenu)}
          onClose={closeMenu}
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
                    onClick={closeMenu}
                  >
                    {label}
                  </Link>
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
              onClick={openSearch}
              extraAttrs={{ ref: searchButtonRef }}
            />

            <Button
              className="header__button"
              label={auth ? "Abmelden" : "Anmelden"}
              isLabelHidden
              mode="transparent"
              iconSrc={auth ? LogoutIcon : LoginIcon}
              iconName={auth ? "logout" : "login"}
              onClick={auth ? handleLogout : openLogin}
              extraAttrs={!auth ? { ref: loginButtonRef } : {}}
            />
          </div>
        </dialog>

        <BurgerButton
          className="header__burger-button visible-tablet"
          isActive={isOpen}
          onClick={toggleMenu}
          ref={burgerRef}
        />
      </div>

      {/* SearchBar теперь только для ввода и редиректа */}
      <SearchBar isOpen={isSearchOpen} onClose={closeSearch} />

      <dialog
        className="header__login-dialog"
        ref={loginDialogRef}
        onClick={(e) => handleDialogBackdropClick(e, closeLogin)}
        onClose={closeLogin}
      >
        <div className="header__login-content">
          <UserLogin onClose={closeLogin} />
        </div>
      </dialog>
    </header>
  )
}

export default Header