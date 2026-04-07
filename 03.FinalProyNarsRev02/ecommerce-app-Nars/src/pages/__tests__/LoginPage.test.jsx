import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";

const { navigateMock, loginMock } = vi.hoisted(() => ({
  navigateMock: vi.fn(),
  loginMock: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("../../contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

import { LoginPage } from "../LoginPage";
import { useAuth } from "../../contexts/AuthContext";

function renderPage(initialEntries = ["/login"]) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({
      login: loginMock,
      error: null,
    });
    loginMock.mockResolvedValue(true);
  });

  it("renderiza el formulario con credenciales de prueba precargadas", () => {
    renderPage();

    expect(screen.getByRole("heading", { name: "Iniciar sesión" })).toBeInTheDocument();
    expect(screen.getByTestId("input-email")).toHaveValue("ali.ramos@mail.com");
    expect(screen.getByTestId("input-password")).toHaveValue("123456");
    expect(screen.getByTestId("btn-entrar")).toHaveTextContent("Entrar");
  });

  it("envia email y password al autenticarse correctamente", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.clear(screen.getByTestId("input-email"));
    await user.type(screen.getByTestId("input-email"), "cliente@mail.com");
    await user.clear(screen.getByTestId("input-password"));
    await user.type(screen.getByTestId("input-password"), "secret123");
    await user.click(screen.getByTestId("btn-entrar"));

    expect(loginMock).toHaveBeenCalledWith("cliente@mail.com", "secret123");
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/", { replace: true });
    });
  });

  it("redirige a la ruta original cuando viene desde una pagina protegida", async () => {
    const user = userEvent.setup();
    renderPage([{ pathname: "/login", state: { from: { pathname: "/orders" } } }]);

    await user.click(screen.getByTestId("btn-entrar"));

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/orders", { replace: true });
    });
  });

  it("no navega cuando login devuelve false y muestra error del contexto", async () => {
    const user = userEvent.setup();
    loginMock.mockResolvedValue(false);
    useAuth.mockReturnValue({
      login: loginMock,
      error: "Credenciales inválidas",
    });

    renderPage();
    await user.click(screen.getByTestId("btn-entrar"));

    expect(loginMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).not.toHaveBeenCalled();
    expect(screen.getByText("Credenciales inválidas")).toBeInTheDocument();
  });

  it("deshabilita el boton y muestra estado de envio mientras procesa", async () => {
    const user = userEvent.setup();
    let resolveLogin;
    loginMock.mockReturnValue(
      new Promise((resolve) => {
        resolveLogin = resolve;
      })
    );

    renderPage();
    await user.click(screen.getByTestId("btn-entrar"));

    expect(screen.getByTestId("btn-entrar")).toBeDisabled();
    expect(screen.getByTestId("btn-entrar")).toHaveTextContent("Validando...");

    resolveLogin(true);

    await waitFor(() => {
      expect(screen.getByTestId("btn-entrar")).not.toBeDisabled();
    });
    expect(screen.getByTestId("btn-entrar")).toHaveTextContent("Entrar");
  });
});
