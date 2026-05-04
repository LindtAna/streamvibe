import './AdminDashboard.scss'

import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useState } from 'react'

import useAuth from '../../../../hooks/useAuth'
import Button from '../../../components/Button'

import movieIcon from '../../../../assets/icons/no-poster-reel.svg'
import supportIcon from '../../../../assets/icons/support_icon.svg'

const SIDEBAR_LINKS = [
  { name: 'Film hinzufügen', path: '/admin', icon: movieIcon },
  { name: 'Support-Anfragen', path: '/admin/support-requests', icon: supportIcon },
]

const AdminDashboard = () => {
  const { auth, setAuth } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const isDemoAdmin = auth?.email === 'admin-demo@streamvibe.app';

  const handleLogout = () => {
    setAuth(null)
    localStorage.removeItem('user')
  }

  return (
    <div className="admin-dashboard container">

      <header className="admin-dashboard__header">

        <h1 className="admin-dashboard__header-title h5">Administrator Dashboard</h1>

        {isDemoAdmin && (
            <div className="admin-dashboard__demo-warning">
              {location.pathname === '/admin/support-requests' 
                ? '⚠︎ Demo-Modus: Sie sehen nur die Test-Support-Anfragen und können nicht darauf antworten oder sie löschen.'
                : '⚠︎ Demo-Modus: das Eingeben einer Beschreibung ist möglich, jedoch können keine Filme hinzugefügt werden.'}
            </div>
        )}

        <div className="admin-dashboard__header-actions">
          <p className="admin-dashboard__welcome h5">
            Hallo, <span className="admin-dashboard__username">
              {isDemoAdmin ? 'Demo-Admin' : (auth?.user_name || 'Boss')} 
            </span>!
          </p>
          <Button
            className="admin-dashboard__logout-button"
            mode="black-08"
            label="Logout"
            onClick={handleLogout}
          />
        </div>
      </header>

      <div className="admin-dashboard__content">
        <aside className="admin-dashboard__sidebar">
          <nav className="admin-dashboard__nav">
            {SIDEBAR_LINKS.map((item) => (
              <NavLink
                to={item.path}
                key={item.name}
                end={item.path === '/admin'}
                className={({ isActive }) =>
                  `admin-dashboard__nav-link ${isActive ? 'admin-dashboard__nav-link--active' : ''}`
                }
              >
                <img 
                  src={item.icon} 
                  alt="" 
                  className="admin-dashboard__nav-icon" 
                  aria-hidden="true" 
                />
                <span className="admin-dashboard__nav-label">{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="admin-dashboard__main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard