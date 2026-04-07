import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const { getCurrentProfileMock } = vi.hoisted(() => ({
  getCurrentProfileMock: vi.fn(),
}));

vi.mock("../../services/userService", () => ({
  getCurrentProfile: getCurrentProfileMock,
}));

import { ProfilePage } from "../ProfilePage";

const renderPage = () =>
  render(
    <MemoryRouter>
      <ProfilePage />
    </MemoryRouter>
  );

describe("ProfilePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("muestra estado de carga inicialmente", () => {
    getCurrentProfileMock.mockReturnValue(new Promise(() => {}));

    renderPage();

    expect(screen.getByText("Cargando perfil...")).toBeInTheDocument();
  });

  it("muestra mensaje de error cuando falla la carga", async () => {
    getCurrentProfileMock.mockRejectedValue({
      response: {
        data: {
          message: "Sesión vencida",
        },
      },
    });

    renderPage();

    expect(await screen.findByText("Sesión vencida")).toBeInTheDocument();
  });

  it("renderiza los datos del perfil recibidos desde el backend", async () => {
    getCurrentProfileMock.mockResolvedValue({
      id: "user-1",
      displayName: "Jane Doe",
      email: "jane@mail.com",
      role: "customer",
      phone: "5512345678",
      active: true,
    });

    renderPage();

    expect(await screen.findByTestId("profile-page")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("jane@mail.com")).toBeInTheDocument();
    expect(screen.getByText("customer")).toBeInTheDocument();
    expect(screen.getByText("5512345678")).toBeInTheDocument();
    expect(screen.getByText("Activa")).toBeInTheDocument();
  });

  it("usa fallback visible cuando faltan campos opcionales", async () => {
    getCurrentProfileMock.mockResolvedValue({
      id: "user-1",
      displayName: "Jane Doe",
      email: "jane@mail.com",
      role: "customer",
      phone: "",
      active: false,
    });

    renderPage();

    await waitFor(() => {
      expect(screen.getByText("No registrado")).toBeInTheDocument();
    });
    expect(screen.getByText("Inactiva")).toBeInTheDocument();
  });
});
