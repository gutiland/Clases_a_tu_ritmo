import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../context/AuthContext'
import '../Register/Register.scss'

export const Login = () => {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'No se pudo iniciar sesión')
      }

      login(data.user, data.token)
      navigate('/')
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
          <h1>Login</h1>
          <p>Introduce tus credenciales</p>
        </div>

        <div className="auth-form__field">
          <label htmlFor="login_email">Email</label>
          <input
            id="login_email"
            type="email"
            placeholder="introduce tu email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="auth-form__field">
          <label htmlFor="login_password">Contraseña</label>
          <input
            id="login_password"
            type="password"
            placeholder="introduce tu contraseña"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        {error && <p className="auth-form__error">{error}</p>}

        <button className="auth-form__button" type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Login'}
        </button>

        <p className="auth-form__footer">
          No tienes cuenta? <Link to="/register">Crear cuenta</Link>
        </p>
      </form>
    </main>
  )
}
