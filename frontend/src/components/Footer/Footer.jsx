import './Footer.scss'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer__content">
        <div className="footer__brand">
          <h2>Clases a tu ritmo.</h2>
          <p>Entrenamientos guiados para seguir al entrenador desde casa.</p>
        </div>

        <div className="footer__info">
          <div>
            <h3>Contacto</h3>
            <p>hola@clasesaturitmo.com</p>
            <p>+34 600 123 456</p>
          </div>

          <div>
            <h3>Horario</h3>
            <p>Lunes a viernes</p>
            <p>9:00 - 18:00</p>
          </div>

          <div>
            <h3>Ubicación</h3>
            <p>Madrid, España</p>
            <p>Servicio online</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
