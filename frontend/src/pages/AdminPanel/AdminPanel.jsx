import { useEffect, useState } from 'react'
import { Navigate } from 'react-router'
import { useAuth } from '../../context/AuthContext'
import './AdminPanel.scss'

const AdminPanel = () => {
  const { token, user, isAdmin } = useAuth()
  const userId = user?._id || user?.id

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false)
      return
    }

    const controller = new AbortController()

    const loadUsers = async () => {
      try {
        const response = await fetch('/api/users', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          signal: controller.signal
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'No se pudieron cargar los usuarios')
        }

        setUsers(data)
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

    loadUsers()

    return () => controller.abort()
  }, [token, isAdmin])

  const handleRoleChange = async (userId, newRole) => {
    setError('')

    try {
      const response = await fetch(`/api/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          role: newRole
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'No se pudo actualizar el rol')
      }

      setUsers((prevUsers) =>
        prevUsers.map((userItem) =>
          userItem._id === userId ? data : userItem
        )
      )
    } catch (error) {
      setError(error.message)
    }
  }


  const handleDeleteUser = async (selectedUserId) => {
    setError('')

    try {
      const response = await fetch(`/api/users/${selectedUserId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'No se pudo eliminar el usuario')
      }

      setUsers((prevUsers) =>
        prevUsers.filter((userItem) => userItem._id !== selectedUserId)
      )
    } catch (error) {
      setError(error.message)
    }
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return (
    <main className="container admin-panel">
      <h1>Panel de admin</h1>
      <p>Gestiona los roles de los usuarios registrados.</p>

      {loading && <p className="admin-panel__status">Cargando usuarios...</p>}
      {error && <p className="admin-panel__error">{error}</p>}

      {!loading && !error && (
        <section className="admin-panel__users">
          {users.map((userItem) => (
            <article className="admin-panel__user" key={userItem._id}>
              <div>
                <h2>{userItem.name}</h2>
                <p>{userItem.email}</p>
              </div>

              <div className="admin-panel__actions">
                <select
                  value={userItem.role}
                  onChange={(event) => {
                    handleRoleChange(userItem._id, event.target.value)
                  }}
                >
                  <option value="client">Cliente</option>
                  <option value="trainer">Entrenador</option>
                  <option value="admin">Admin</option>
                </select>

                <button
                  type="button"
                  onClick={() => handleDeleteUser(userItem._id)}
                  disabled={userItem._id === userId}
                >
                  Eliminar
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  )
}

export default AdminPanel
