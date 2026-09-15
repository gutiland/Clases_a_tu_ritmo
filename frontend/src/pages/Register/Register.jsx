import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import './Register.scss'
import { API_URL } from '../../config/api'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('client')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'No se pudo crear la cuenta')
      }

      setSuccess('Cuenta creada correctamente. Ahora puedes iniciar sesión.')

      setTimeout(() => {
        navigate('/login')
      }, 900)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-form__header">
          <h1>Crear cuenta</h1>
          <p>Elige si quieres entrenar como cliente o publicar sesiones como entrenador.</p>
        </div>

        <div className="auth-form__field">
          <label htmlFor="register_name">Nombre</label>
          <input
            id="register_name"
            type="text"
            placeholder="Tu nombre"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>

        <div className="auth-form__field">
          <label htmlFor="register_email">Email</label>
          <input
            id="register_email"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="auth-form__field">
          <label htmlFor="register_password">Contraseña</label>
          <input
            id="register_password"
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        <div className="auth-form__field">
          <label htmlFor="register_role">Tipo de cuenta</label>
          <select
            id="register_role"
            value={role}
            onChange={(event) => setRole(event.target.value)}
          >
            <option value="client">Cliente</option>
            <option value="trainer">Entrenador</option>
          </select>
        </div>

        {error && <p className="auth-form__error">{error}</p>}
        {success && <p className="auth-form__success">{success}</p>}

        <button className="auth-form__button" type="submit" disabled={loading}>
          {loading ? 'Creando...' : 'Crear cuenta'}
        </button>

        <p className="auth-form__footer">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </main>
  )
}

export default Register
