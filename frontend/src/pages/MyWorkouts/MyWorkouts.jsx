import { API_URL } from '../../config/api'
﻿import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router'
import { useAuth } from '../../context/AuthContext'
import './MyWorkouts.scss'

const MyWorkouts = () => {
  const { token, user, isAuthenticated, isTrainer } = useAuth()
  const userId = user?._id || user?.id

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }

    const controller = new AbortController()

    const loadData = async () => {
      try {
        const response = await fetch(isTrainer ? `${API_URL}/api/classes` : `${API_URL}/api/workouts/me`, {
          headers: isTrainer
            ? {}
            : {
                Authorization: `Bearer ${token}`
              },
          signal: controller.signal
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(
            data.message ||
              (isTrainer
                ? 'No se pudieron cargar tus clases'
                : 'No se pudieron cargar tus entrenamientos')
          )
        }

        if (isTrainer) {
          const trainerClasses = data.filter((classItem) => {
            const trainerId = classItem.trainer?._id || classItem.trainer
            return trainerId === userId
          })

          setItems(trainerClasses)
        } else {
          setItems(data)
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          setError(error.message)
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadData()

    return () => controller.abort()
  }, [isAuthenticated, isTrainer, token, userId])

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const pageTitle = isTrainer ? 'Mis clases' : 'Mis entrenamientos'
  const pageDescription = isTrainer
    ? 'Gestiona las clases que has publicado como entrenador.'
    : 'Consulta las sesiones que ya has marcado como completadas.'

  if (loading) {
    return (
      <main className="container my-workouts">
        <p>{isTrainer ? 'Cargando tus clases...' : 'Cargando entrenamientos...'}</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="container my-workouts">
        <h1>{pageTitle}</h1>
        <p className="my-workouts__error">{error}</p>
      </main>
    )
  }

  return (
    <main className="container my-workouts">
      <div className="my-workouts__header">
        <h1>{pageTitle}</h1>
        <p>{pageDescription}</p>
      </div>

      {items.length === 0 ? (
        <section className="my-workouts__empty">
          {isTrainer ? (
            <>
              <h2>Todavía no has publicado clases</h2>
              <p>Crea tu primera sesión para que los clientes puedan entrenar siguiendo tus tracks.</p>
              <Link to="/classes/create">Crear clase</Link>
            </>
          ) : (
            <>
              <h2>Todavía no has completado clases</h2>
              <p>Explora el catálogo y marca tu primera sesión completada.</p>
              <Link to="/catalog">Ver clases</Link>
            </>
          )}
        </section>
      ) : (
        <section className="my-workouts__list">
          {isTrainer
            ? items.map((classItem) => (
                <article className="my-workouts__card" key={classItem._id}>
                  <div>
                    <p className="my-workouts__program">{classItem.program?.name}</p>
                    <h2>{classItem.title}</h2>
                    <p>{classItem.level} · {classItem.duration} min</p>
                  </div>

                  <Link to={`/classes/${classItem._id}`}>Gestionar clase</Link>
                </article>
              ))
            : items.map((session) => {
                const classItem = session.class
                const completedDate = session.completedAt
                  ? new Date(session.completedAt).toLocaleDateString('es-ES')
                  : 'Sin fecha'

                return (
                  <article className="my-workouts__card" key={session._id}>
                    <div>
                      <p className="my-workouts__program">{classItem?.program?.name}</p>
                      <h2>{classItem?.title}</h2>
                      <p>
                        {classItem?.trainer?.name} · {classItem?.level} · {classItem?.duration} min
                      </p>
                      <p>Completada el {completedDate}</p>
                    </div>

                    {classItem?._id && (
                      <Link to={`/classes/${classItem._id}`}>Ver clase</Link>
                    )}
                  </article>
                )
              })}
        </section>
      )}
    </main>
  )
}

export default MyWorkouts
