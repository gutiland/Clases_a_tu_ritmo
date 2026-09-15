import { Link } from 'react-router'
import './Footer.scss'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer__content">
        <div>
          <h2>Clases a tu ritmo.</h2>
          <p>Entrenamientos guiados para seguir al entrenador desde casa.</p>
        </div>

        <nav className="footer__nav" aria-label="Enlaces del footer">
          <Link to="/">Inicio</Link>
          <Link to="/catalog">Catálogo</Link>
          <Link to="/login">Login</Link>
        </nav>
      </div>
    </footer>
  )
}

export default Footer
