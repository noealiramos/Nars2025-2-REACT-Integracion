import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

export default function UserDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const userId = Number(id) // para operar con números
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  function goPrev() {
    if (userId > 1) navigate(`/user/${userId - 1}`)
  }

  function goNext() {
    if (userId < 10) navigate(`/user/${userId + 1}`) // JSONPlaceholder tiene 10 users
  }

  useEffect(() => {
    let isCancelled = false

    async function loadUser() {
      try {
        setIsLoading(true)
        setError(null)

        const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`)

        if (!res.ok) {
          throw new Error(`Error HTTP: ${res.status}`)
        }

        const data = await res.json()

        if (!isCancelled) {
          setUser(data)
          setIsLoading(false)
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.message || 'Error desconocido')
          setIsLoading(false)
        }
      }
    }

    loadUser()

    return () => {
      isCancelled = true
    }
  }, [id])

  return (
    <div style={{ padding: 16 }}>
      <Link to="/">← Volver</Link>

      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <button onClick={goPrev} disabled={userId <= 1 || isLoading}>
          ← Anterior
        </button>

        <button onClick={goNext} disabled={userId >= 10 || isLoading}>
          Siguiente →
        </button>

        <span style={{ marginLeft: 8 }}>
          ID actual: <strong>{id}</strong>
        </span>
      </div>

      <hr style={{ margin: '12px 0' }} />

      {isLoading && <p>Cargando...</p>}

      {!isLoading && error && (
        <p style={{ color: 'crimson' }}>Ocurrió un error: {error}</p>
      )}

      {!isLoading && !error && user && (
        <div>
          <h1>{user.name}</h1>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Tel:</strong> {user.phone}</p>
          <p><strong>Empresa:</strong> {user.company?.name}</p>
        </div>
      )}
    </div>
  )
}

