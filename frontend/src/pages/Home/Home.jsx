import { API_URL } from '../../config/api'
﻿import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import ClassCard from '../../components/ClassCard/ClassCard'
import { useAuth } from '../../context/AuthContext'
import './Home.scss'

const Home = () => {
  const { user, isAuthenticated, isTrainer, isAdmin } = useAuth()

  const [sampleClasses, setSampleClasses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    const loadSampleClasses = async () => {
      try {
        const response = await fetch(`${API_URL}/api/classes`, {
          signal: controller.signal
        })

        if (!response.ok) {
          throw new Error('No se pudieron cargar las clases destacadas')
        }

        const data = await response.json()
        setSampleClasses(data.slice(0, 3))
      } catch (error) {
        if (error.name !== 'AbortError') {
          setSampleClasses([])
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadSampleClasses()

    return () => controller.abort()
  }, [])

  const getTrainerName = (trainer) => {
    if (typeof trainer === 'string') {
      return trainer
    }

    return trainer?.name || ''
  }

  return (
    <main className="home">
      <section className="container home__hero">
        <div className="home__hero-content">
          <p className="home__eyebrow">Entrena siguiendo el ritmo</p>
          <h1>Clases guiadas para moverte como si estuvieras delante del entrenador.</h1>
          <p className="home__description">
            Elige una sesión, sigue los tracks en orden y marca tus entrenamientos completados para ver tu progreso.
          </p>

          <div className="home__actions">
            <Link className="home__button home__button--primary" to="/catalog">
              Ver catálogo
            </Link>

            {!isAuthenticated && (
              <Link className="home__button home__button--secondary" to="/login">
                Iniciar sesión
              </Link>
            )}

            {isTrainer && (
              <Link className="home__button home__button--secondary" to="/classes/create">
                Crear clase
              </Link>
            )}
          </div>
        </div>

        <aside className="home__user-card">
          {isAuthenticated ? (
            <>
              <p className="home__user-label">Sesión iniciada</p>
              <h2>Hola, {user.name}</h2>
              <Link to={isAdmin ? '/admin' : '/my-workouts'}>
                {isAdmin ? 'Ir al panel admin' : 'Ver mis entrenamientos'}
              </Link>
            </>
          ) : (
            <>
              <p className="home__user-label">Acceso personal</p>
              <h2>Guarda tu progreso</h2>
              <p>Inicia sesión para marcar clases completadas y acceder a tu historial.</p>
              <Link to="/login">Entrar ahora</Link>
            </>
          )}
        </aside>
      </section>

      <section className="container home__samples">
        <div className="home__section-header">
          <h2>Clases destacadas</h2>
          <Link to="/catalog">Ver todas</Link>
        </div>

        {loading ? (
          <p>Cargando clases destacadas...</p>
        ) : (
          <div className="classes-grid">
            {sampleClasses.map((classItem) => (
              <ClassCard
                key={classItem._id || classItem.id}
                id={classItem._id || classItem.id}
                program={classItem.program?.name || classItem.program}
                title={classItem.title}
                trainer={getTrainerName(classItem.trainer)}
                level={classItem.level}
                duration={classItem.duration}
                src={classItem.image || classItem.src}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default Home
