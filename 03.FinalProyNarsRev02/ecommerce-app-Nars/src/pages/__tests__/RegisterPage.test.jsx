import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";

const { navigateMock, registerMock, persistAuthSessionMock, restoreSessionMock } = vi.hoisted(() => ({
  navigateMock: vi.fn(),
  registerMock: vi.fn(),
  persistAuthSessionMock: vi.fn(),
  restoreSessionMock: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("../../api/authApi", () => ({
  authApi: {
    register: registerMock,
  },
}));

vi.mock("../../services/authService", () => ({
  persistAuthSession: persistAuthSessionMock,
}));

vi.mock("../../contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

import { RegisterPage } from "../RegisterPage";
import { useAuth } from "../../contexts/AuthContext";

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/register"]}>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </MemoryRouter>
  );
}

async function fillForm(user) {
  await user.type(screen.getByTestId("input-name"), "Jane Doe");
  await user.type(screen.getByTestId("input-email"), "jane@mail.com");
  await user.type(screen.getByTestId("input-password"), "secret123");
}

describe("RegisterPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({
      restoreSession: restoreSessionMock,
    });
    registerMock.mockResolvedValue({
      accessToken: "access-token",
      refreshToken: "refresh-token",
      user: {
        id: "user-1",
        displayName: "Jane Doe",
        email: "jane@mail.com",
      },
    });
  });

  it("renderiza el formulario de registro con sus campos principales", () => {
    renderPage();

    expect(screen.getByRole("heading", { name: "Crear cuenta" })).toBeInTheDocument();
    expect(screen.getByTestId("input-name")).toHaveValue("");
    expect(screen.getByTestId("input-email")).toHaveValue("");
    expect(screen.getByTestId("input-password")).toHaveValue("");
    expect(screen.getByRole("link", { name: /inicia sesión aquí/i })).toHaveAttribute("href", "/login");
  });

  it("registra al usuario, persiste la sesion y redirige al inicio", async () => {
    const user = userEvent.setup();
    renderPage();

    await fillForm(user);
    await user.click(screen.getByTestId("btn-crear-cuenta"));

    expect(registerMock).toHaveBeenCalledWith({
      displayName: "Jane Doe",
      email: "jane@mail.com",
      password: "secret123",
    });

    await waitFor(() => {
      expect(persistAuthSessionMock).toHaveBeenCalledTimes(1);
      expect(restoreSessionMock).toHaveBeenCalledWith({
        id: "user-1",
        displayName: "Jane Doe",
        email: "jane@mail.com",
      });
      expect(navigateMock).toHaveBeenCalledWith("/");
    });
  });

  it("muestra el mensaje remoto de error cuando la API responde con detalle", async () => {
    const user = userEvent.setup();
    registerMock.mockRejectedValue({
      response: {
        data: {
          message: "El correo ya está registrado",
        },
      },
    });

    renderPage();
    await fillForm(user);
    await user.click(screen.getByTestId("btn-crear-cuenta"));

    expect(await screen.findByText("El correo ya está registrado")).toBeInTheDocument();
    expect(persistAuthSessionMock).not.toHaveBeenCalled();
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("usa un mensaje fallback cuando la API falla sin detalle", async () => {
    const user = userEvent.setup();
    registerMock.mockRejectedValue(new Error("network down"));

    renderPage();
    await fillForm(user);
    await user.click(screen.getByTestId("btn-crear-cuenta"));

    expect(await screen.findByText("Error al crear la cuenta. Intenta con otro correo.")).toBeInTheDocument();
  });

  it("deshabilita el boton y muestra estado de carga mientras crea la cuenta", async () => {
    const user = userEvent.setup();
    let resolveRegister;
    registerMock.mockReturnValue(
      new Promise((resolve) => {
        resolveRegister = resolve;
      })
    );

    renderPage();
    await fillForm(user);
    await user.click(screen.getByTestId("btn-crear-cuenta"));

    expect(screen.getByTestId("btn-crear-cuenta")).toBeDisabled();
    expect(screen.getByTestId("btn-crear-cuenta")).toHaveTextContent("Creando...");

    resolveRegister({
      accessToken: "access-token",
      refreshToken: "refresh-token",
      user: {
        id: "user-1",
        displayName: "Jane Doe",
      },
    });

    await waitFor(() => {
      expect(screen.getByTestId("btn-crear-cuenta")).not.toBeDisabled();
    });
    expect(screen.getByTestId("btn-crear-cuenta")).toHaveTextContent("Registrarme");
  });
});
