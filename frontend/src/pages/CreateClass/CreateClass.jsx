import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import { useAuth } from '../../context/AuthContext'
import '../Register/Register.scss'

const CreateClass = () => {
  const [title, setTitle] = useState('')
  const [program, setProgram] = useState('')
  const [level, setLevel] = useState('Principiante')
  const [duration, setDuration] = useState(45)
  const [image, setImage] = useState('')
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { token, isTrainer } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const controller = new AbortController()

    const loadPrograms = async () => {
      try {
        const response = await fetch('/api/programs', {
          signal: controller.signal
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'No se pudieron cargar los programas')
        }

        setPrograms(data)
        setProgram(data[0]?._id || '')
      } catch (error) {
        if (error.name !== 'AbortError') {
          setError(error.message)
        }
      }
    }

    loadPrograms()

    return () => controller.abort()
  }, [])

  if (!isTrainer) {
    return <Navigate to="/catalog" replace />
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          program,
          level,
          duration: Number(duration),
          image
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'No se pudo crear la clase')
      }

      navigate(`/classes/${data._id}`)
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
          <h1>Crear clase</h1>
          <p>Publica una sesión de 45 minutos dentro de un programa.</p>
        </div>

        <div className="auth-form__field">
          <label htmlFor="class_title">Título</label>
          <input
            id="class_title"
            type="text"
            placeholder="HIIT Extra 1"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </div>

        <div className="auth-form__field">
          <label htmlFor="class_program">Programa</label>
          <select
            id="class_program"
            value={program}
            onChange={(event) => setProgram(event.target.value)}
            required
          >
            {programs.map((programItem) => (
              <option key={programItem._id} value={programItem._id}>
                {programItem.name}
              </option>
            ))}
          </select>
        </div>

        <div className="auth-form__field">
          <label htmlFor="class_level">Nivel</label>
          <select
            id="class_level"
            value={level}
            onChange={(event) => setLevel(event.target.value)}
          >
            <option value="Principiante">Principiante</option>
            <option value="Intermedio">Intermedio</option>
            <option value="Avanzado">Avanzado</option>
          </select>
        </div>

        <div className="auth-form__field">
          <label htmlFor="class_duration">Duración</label>
          <input
            id="class_duration"
            type="number"
            min="1"
            value={duration}
            onChange={(event) => setDuration(event.target.value)}
            required
          />
        </div>

        <div className="auth-form__field">
          <label htmlFor="class_image">Imagen</label>
          <input
            id="class_image"
            type="url"
            placeholder="https://..."
            value={image}
            onChange={(event) => setImage(event.target.value)}
          />
        </div>

        {error && <p className="auth-form__error">{error}</p>}

        <button className="auth-form__button" type="submit" disabled={loading}>
          {loading ? 'Creando...' : 'Crear clase'}
        </button>

        <p className="auth-form__footer">
          <Link to="/catalog">Volver al catálogo</Link>
        </p>
      </form>
    </main>
  )
}

export default CreateClass
