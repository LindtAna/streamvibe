import './SearchBar.scss'

import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import Icon from '../../../components/Icon'
import SearchIcon from '../../../../assets/icons/search.svg'
import CloseIcon from '../../../../assets/icons/close.svg'
import Button from '../../../components/Button'

const SearchBar = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const searchRef = useRef(null)

  const navigate = useNavigate()
  const location = useLocation()
  const isSearchPage = location.pathname === '/search'

  // URL-Synchronisation mit dem Suchfeld, wenn sich der User auf der dedizierten Suchseite (/search) befindet.
  // Bei Schließen der Suchleiste (außerhalb der Suchseite) wird das Feld zurückgesetzt
  useEffect(() => {
    if (isSearchPage) {
      const params = new URLSearchParams(location.search)
      setQuery(params.get('q') || '')
    } else if (!isOpen) {
      setQuery('')
    }
  }, [location.search, isSearchPage, isOpen])

  // Click-outside-Logik zum Schließen
  // Schließt die Suchleiste, wenn der user außerhalb des Suchbereichs klickt
  // Klicks auf den Such-Button im Header werden ignoriert
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        const isHeaderButton = e.target.closest('.header__button')
        if (!isHeaderButton) {
          onClose()
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  // Autofokus beim Öffnen
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 100);
    }
  }, [isOpen]);

  ///// Event Handler
  //das Absenden der Suche (Enter oder Klick auf Lupen-Button)
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!query.trim()) return


    navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    if (!isSearchPage) onClose()
  };
  //Löscht den Suchbegriff und setzt das Eingabefeld zurück
  const handleClear = () => {
    setQuery('')
    inputRef.current?.focus()
    if (isSearchPage) {
      navigate('/search', { replace: true })
    }
  };

  if (!isOpen && !isSearchPage) return null

  return (
    <div className={`search-bar ${isOpen || isSearchPage ? 'is-open' : ''}`} ref={searchRef}>
      <div className="search-bar__container container">
        <form className="search-bar__form" onSubmit={handleSubmit}>
          <div className="search-bar__input-wrapper">
            <Button
              className="search-bar__search-button"
              label="Suchen"
              isLabelHidden
              mode="transparent"
              iconSrc={SearchIcon}
              iconName="search"
              onClick={handleSubmit}
            />

            <input
              ref={inputRef}
              className="search-bar__input"
              type="text"
              placeholder="Filme und Serien suchen..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
            />

            {query && (
              <Button
                className="search-bar__clear-button"
                label="Suche löschen"
                isLabelHidden
                mode="transparent"
                iconSrc={CloseIcon}
                iconName="close"
                onClick={handleClear}
              />
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default SearchBar