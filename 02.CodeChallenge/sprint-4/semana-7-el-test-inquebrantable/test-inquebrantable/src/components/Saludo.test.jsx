import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Saludo from './Saludo';

test('muestra el mensaje inicial', () => {
  render(<Saludo />);
  expect(screen.getByText('Hola Mundo')).toBeInTheDocument();
});

test('cambia el mensaje al hacer clic en el botón', async () => {
  render(<Saludo />);

  const user = userEvent.setup();
  const boton = screen.getByRole('button', { name: /cambiar saludo/i });

  await user.click(boton);

  expect(screen.getByText('Adiós')).toBeInTheDocument();
});

test('el botón existe en el documento', () => {
  render(<Saludo />);
  expect(screen.getByRole('button', { name: /cambiar saludo/i })).toBeInTheDocument();
});


// import { render, screen, fireEvent } from '@testing-library/react';
// ...
// fireEvent.click(boton);
