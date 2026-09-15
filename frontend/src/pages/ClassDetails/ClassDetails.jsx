import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { useAuth } from '../../context/AuthContext'
import './ClassDetails.scss'
import { API_URL } from '../../config/api'

const ClassDetails = () => {
  const { id } = useParams()
  const { token, isTrainer, isAuthenticated } = useAuth()

  const [classItem, setClassItem] = useState(null)
  const [tracks, setTracks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [classCompleted, setClassCompleted] = useState(false)
  const [completingClass, setCompletingClass] = useState(false)
  const [completeError, setCompleteError] = useState('')
  const [completeSuccess, setCompleteSuccess] = useState('')
  const [trackTitle, setTrackTitle] = useState('')
  const [trackOrder, setTrackOrder] = useState('')
  const [trackDuration, setTrackDuration] = useState(5)
  const [trackFocus, setTrackFocus] = useState('')
  const [trackVideoUrl, setTrackVideoUrl] = useState('')
  const [creatingTrack, setCreatingTrack] = useState(false)
  const [trackError, setTrackError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    const loadClassDetails = async () => {
      try {
        const [classResponse, tracksResponse] = await Promise.all([
          fetch(`${API_URL}/api/classes/${id}`, { signal: controller.signal }),
          fetch(`${API_URL}/api/classes/${id}/tracks`, { signal: controller.signal })
        ])

        if (!classResponse.ok || !tracksResponse.ok) {
          throw new Error('No se pudo cargar la clase seleccionada')
        }

        const classData = await classResponse.json()
        const tracksData = await tracksResponse.json()

        setClassItem(classData)
        setTracks(tracksData)
      } catch (error) {
        if (error.name !== 'AbortError') {
          setError('No se pudo cargar la clase')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadClassDetails()

    return () => controller.abort()
  }, [id])

  useEffect(() => {
    if (!isAuthenticated) {
      setClassCompleted(false)
      return
    }

    const controller = new AbortController()

    const loadCompletedState = async () => {
      try {
        const response = await fetch(`${API_URL}/api/workouts/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          signal: controller.signal
        })

        if (!response.ok) {
          throw new Error('No se pudo comprobar si la clase está completada')
        }

        const data = await response.json()
        const isCompleted = data.some((session) => {
          const completedClassId = session.class?._id || session.class
          return completedClassId === id
        })

        setClassCompleted(isCompleted)
      } catch (error) {
        if (error.name !== 'AbortError') {
          setClassCompleted(false)
        }
      }
    }

    loadCompletedState()

    return () => controller.abort()
  }, [id, isAuthenticated, token])

  const handleCompleteClass = async () => {
    setCompletingClass(true)
    setCompleteError('')
    setCompleteSuccess('')

    try {
      const response = await fetch(`${API_URL}/api/workouts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          classId: id
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'No se pudo marcar la clase como completada')
      }

      setClassCompleted(true)
      setCompleteSuccess('Clase marcada como completada')
    } catch (error) {
      setCompleteError(error.message)
    } finally {
      setCompletingClass(false)
    }
  }

  const handleCreateTrack = async (event) => {
    event.preventDefault()
    setCreatingTrack(true)
    setTrackError('')

    try {
      const response = await fetch(`${API_URL}/api/classes/${id}/tracks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: trackTitle,
          order: Number(trackOrder),
          duration: Number(trackDuration),
          focus: trackFocus,
          videoUrl: trackVideoUrl
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'No se pudo crear el track')
      }

      setTracks((prevTracks) => {
        return [...prevTracks, data].sort((a, b) => a.order - b.order)
      })

      setTrackTitle('')
      setTrackOrder('')
      setTrackDuration(5)
      setTrackFocus('')
      setTrackVideoUrl('')
    } catch (error) {
      setTrackError(error.message)
    } finally {
      setCreatingTrack(false)
    }
  }

  if (loading) {
    return (
      <main className="container class-details">
        <p>Cargando clase...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="container class-details">
        <p>{error}</p>
        <Link to="/catalog">Volver al inicio</Link>
      </main>
    )
  }

  if (!classItem) {
    return (
      <main className="container class-details">
        <h1>Clase no encontrada</h1>
        <Link to="/catalog">Volver al catálogo</Link>
      </main>
    )
  }

  return (
    <main className="container class-details">
      <Link to="/catalog">Volver al catálogo</Link>
      <p className="class-details__program">{classItem.program?.name}</p>
      <h1>{classItem.title}</h1>
      <p className="class-details__info">
        Con {classItem.trainer?.name} · {classItem.level} · {classItem.duration} min
      </p>

      {classCompleted && (
        <p className="class-details__completed">✓ Clase completada</p>
      )}

      <div className="class-details__media">
        <img
          className="class-details__image"
          src={classItem.image}
          alt={classItem.title}
        />
      </div>

      {isAuthenticated && !isTrainer && (
        <section className="class-details__complete">
          <button
            type="button"
            onClick={handleCompleteClass}
            disabled={completingClass || classCompleted}
          >
            {classCompleted ? 'Clase completada' : completingClass ? 'Guardando...' : 'Marcar clase como completada'}
          </button>

          {completeError && <p className="class-details__complete-error">{completeError}</p>}
          {completeSuccess && <p className="class-details__complete-success">{completeSuccess}</p>}
        </section>
      )}

      <section className="class-details__tracks">
        <h2>Tracks de la sesión</h2>

        {tracks.map((track) => (
          <article className="class-details__track" key={track._id}>
            <span>{track.order}</span>
            <div>
              <h3>{track.title}</h3>
              <p>{track.focus} · {track.duration} min</p>
              {track.videoUrl ? (
                <button className="class-details__track-button">
                  Ver track
                </button>
              ) : (
                <p className="class-details__track-status">Video pendiente</p>
              )}
            </div>
          </article>
        ))}
      </section>

      {isTrainer && (
        <section className="class-details__create-track">
          <h2>Añadir track</h2>

          <form className="class-details__track-form" onSubmit={handleCreateTrack}>
            <div>
              <label htmlFor="track_title">Título</label>
              <input
                id="track_title"
                type="text"
                value={trackTitle}
                onChange={(event) => setTrackTitle(event.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="track_order">Orden</label>
              <input
                id="track_order"
                type="number"
                min="1"
                value={trackOrder}
                onChange={(event) => setTrackOrder(event.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="track_duration">Duración</label>
              <input
                id="track_duration"
                type="number"
                min="1"
                value={trackDuration}
                onChange={(event) => setTrackDuration(event.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="track_focus">Foco</label>
              <input
                id="track_focus"
                type="text"
                value={trackFocus}
                onChange={(event) => setTrackFocus(event.target.value)}
                required
              />
            </div>

            <div className="class-details__track-form-full">
              <label htmlFor="track_video">URL del video</label>
              <input
                id="track_video"
                type="url"
                value={trackVideoUrl}
                onChange={(event) => setTrackVideoUrl(event.target.value)}
                placeholder="https://..."
              />
            </div>

            {trackError && (
              <p className="class-details__track-error">{trackError}</p>
            )}

            <button type="submit" disabled={creatingTrack}>
              {creatingTrack ? 'Creando...' : 'Crear track'}
            </button>
          </form>
        </section>
      )}
    </main>
  )
}

export default ClassDetails
