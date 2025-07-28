import { NavLink } from 'react-router-dom'
import './header.scss'

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <span className="logo-icon">🎬</span>
          <span className="logo-text">Movies</span>
        </div>
        <nav className="nav">
          <ul className="nav-list">
            <li className="nav-item">
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <span className="nav-icon">🏠</span>
                <span className="nav-text">Home</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/favorites" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <span className="nav-icon">❤️</span>
                <span className="nav-text">Favorites</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header