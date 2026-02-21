import Saludo from './components/Saludo';
import './styles.css';

function App() {
  return (
    <main className="page">
      <header className="header">
        <h2>Semana 7 — El test inquebrantable</h2>
        <p>Vitest + React Testing Library</p>
      </header>

      <Saludo />
    </main>
  );
}

export default App;
