import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { useAuth } from '../../context/AuthContext'
import './ClassDetails.scss'
import { API_URL } from '../../config/api'

const ClassDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token, user, isTrainer, isAdmin, isAuthenticated } = useAuth()

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
  const [editTitle, setEditTitle] = useState('')
  const [editLevel, setEditLevel] = useState('Principiante')
  const [editDuration, setEditDuration] = useState(45)
  const [editImage, setEditImage] = useState('')
  const [editImageFile, setEditImageFile] = useState(null)
  const [updatingClass, setUpdatingClass] = useState(false)
  const [deletingClass, setDeletingClass] = useState(false)
  const [classManageError, setClassManageError] = useState('')
  const [classManageSuccess, setClassManageSuccess] = useState('')

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
        setEditTitle(classData.title || '')
        setEditLevel(classData.level || 'Principiante')
        setEditDuration(classData.duration || 45)
        setEditImage(classData.image || '')
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


  const trainerId = classItem?.trainer?._id || classItem?.trainer
  const userId = user?._id || user?.id
  const canManageClass = isAdmin || (isTrainer && trainerId === userId)

  const handleUpdateClass = async (event) => {
    event.preventDefault()
    setUpdatingClass(true)
    setClassManageError('')
    setClassManageSuccess('')

    try {
      const formData = new FormData()
      formData.append('title', editTitle)
      formData.append('level', editLevel)
      formData.append('duration', Number(editDuration))

      if (editImageFile) {
        formData.append('image', editImageFile)
      } else if (editImage) {
        formData.append('image', editImage)
      }

      const response = await fetch(`${API_URL}/api/classes/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      })

      const responseText = await response.text()
      const data = responseText ? JSON.parse(responseText) : {}

      if (!response.ok) {
        throw new Error(data.error || data.message || 'No se pudo actualizar la clase')
      }

      setClassItem(data)
      setEditImageFile(null)
      setClassManageSuccess('Clase actualizada correctamente')
    } catch (error) {
      setClassManageError(error.message)
    } finally {
      setUpdatingClass(false)
    }
  }

  const handleDeleteClass = async () => {
    setDeletingClass(true)
    setClassManageError('')
    setClassManageSuccess('')

    try {
      const response = await fetch(`${API_URL}/api/classes/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const responseText = await response.text()
      const data = responseText ? JSON.parse(responseText) : {}

      if (!response.ok) {
        throw new Error(data.error || data.message || 'No se pudo eliminar la clase')
      }

      navigate('/my-workouts')
    } catch (error) {
      setClassManageError(error.message)
      setDeletingClass(false)
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

      {canManageClass && (
        <section className="class-details__manage">
          <h2>Gestionar clase</h2>

          <form className="class-details__manage-form" onSubmit={handleUpdateClass}>
            <div>
              <label htmlFor="edit_title">Título</label>
              <input id="edit_title" type="text" value={editTitle} onChange={(event) => setEditTitle(event.target.value)} required />
            </div>

            <div>
              <label htmlFor="edit_level">Nivel</label>
              <select id="edit_level" value={editLevel} onChange={(event) => setEditLevel(event.target.value)}>
                <option value="Principiante">Principiante</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzado">Avanzado</option>
              </select>
            </div>

            <div>
              <label htmlFor="edit_duration">Duración</label>
              <input id="edit_duration" type="number" min="1" value={editDuration} onChange={(event) => setEditDuration(event.target.value)} required />
            </div>

            <div>
              <label htmlFor="edit_image_file">Nueva imagen</label>
              <input id="edit_image_file" type="file" accept="image/*" onChange={(event) => setEditImageFile(event.target.files[0])} />
            </div>

            <div className="class-details__manage-form-full">
              <label htmlFor="edit_image">URL de imagen alternativa</label>
              <input id="edit_image" type="url" value={editImage} onChange={(event) => setEditImage(event.target.value)} />
            </div>

            {classManageError && <p className="class-details__manage-error">{classManageError}</p>}
            {classManageSuccess && <p className="class-details__manage-success">{classManageSuccess}</p>}

            <button type="submit" disabled={updatingClass}>{updatingClass ? 'Guardando...' : 'Guardar cambios'}</button>
          </form>

          <button className="class-details__delete-button" type="button" onClick={handleDeleteClass} disabled={deletingClass}>
            {deletingClass ? 'Eliminando...' : 'Eliminar clase'}
          </button>
        </section>
      )}

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
