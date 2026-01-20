import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div style={{ padding: 16 }}>
      <h1>Navegador de usuarios</h1>

      <p>Selecciona un usuario:</p>

      <ul>
        <li><Link to="/user/1">Usuario 1</Link></li>
        <li><Link to="/user/2">Usuario 2</Link></li>
        <li><Link to="/user/3">Usuario 3</Link></li>
      </ul>
    </div>
  )
}
