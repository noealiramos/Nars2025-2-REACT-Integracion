import { useState } from 'react';

export default function Saludo() {
  const [mensaje, setMensaje] = useState('Hola Mundo');

  const cambiarMensaje = () => {
    setMensaje('Adiós');
  };

  return (
    <div className="card">
      <h1>{mensaje}</h1>
      <button type="button" onClick={cambiarMensaje}>
        Cambiar saludo
      </button>
    </div>
  );
}
