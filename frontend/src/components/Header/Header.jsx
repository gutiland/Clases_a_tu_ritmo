import { useState } from 'react'
import './Header.scss'
import { Link, useLocation, useNavigate } from 'react-router'
import { useAuth } from '../../context/AuthContext'

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout, isTrainer, isAdmin } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const isLoginPage = location.pathname === '/login'

  const closeMenu = () => {
    setMenuOpen(false)
  }

  const handleLogOut = () => {
    logout()
    closeMenu()
    navigate('/')
  }

  return (
    <header className="header">
      <div className="container header__content">
        <Link className="header__brand" to="/" onClick={closeMenu}>Clases a tu ritmo.</Link>

        <div className="header__actions">
          {user && <span className="header__user">Hola, {user.name}</span>}

          <button
            className="header__menu-button"
            type="button"
            onClick={() => setMenuOpen((prevValue) => !prevValue)}
            aria-expanded={menuOpen}
            aria-controls="main-menu"
          >
            Menú
          </button>
        </div>

        <nav
          id="main-menu"
          className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`}
        >
          {!isLoginPage && (
            <Link className="header__link" to="/catalog" onClick={closeMenu}>Catálogo</Link>
          )}

          {isTrainer && (
            <Link className="header__link" to="/classes/create" onClick={closeMenu}>Crear clase</Link>
          )}

          {isAdmin && (
            <Link className="header__link" to="/admin" onClick={closeMenu}>Admin</Link>
          )}

          {user ? (
            <>
              <Link className="header__link" to="/my-workouts" onClick={closeMenu}>
                {isTrainer ? 'Mis clases' : 'Mis entrenamientos'}
              </Link>
              <button className="header__button" type="button" onClick={handleLogOut}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="header__link" to="/register" onClick={closeMenu}>Registro</Link>
              <Link className="header__button" to="/login" onClick={closeMenu}>Login</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
