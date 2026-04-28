import './AdminDashboard.scss'

import { NavLink, Outlet } from 'react-router-dom'
import { useState } from 'react'

import useAuth from '../../../../hooks/useAuth'

import Button from '../../../components/Button'

const SIDEBAR_LINKS = [
  { name: 'Film hinzufügen', path: '/admin' },
  { name: 'Support-Anfragen', path: '/admin/support-requests' },
]

const AdminDashboard = () => {
  const { auth, setAuth } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)


  const handleLogout = () => {
    setAuth(null)
    localStorage.removeItem('user')
  }

  return (
    <div className="admin-dashboard container">

      <header className="admin-dashboard__header">
        <h1 className="admin-layout__header-title h5">Administrator Dashboard</h1>

        <div className="admin-dashboard__header-actions">
          <p className="admin-dashboard__welcome h5">
            Hallo, <span className="admin-dashboard__username">{auth?.user_name || 'Boss'}</span>!
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
        {/* Sidebar */}
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
                <span className="admin-dashboard__nav-label">{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Hauptbereich, in dem die Unterrouten (AddMovie, SupportRequests) gerendert werden */}
        <main className="admin-dashboard__main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard