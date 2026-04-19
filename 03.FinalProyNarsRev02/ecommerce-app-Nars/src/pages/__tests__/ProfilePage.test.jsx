import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

const { getCurrentProfileMock, updateCurrentProfileMock } = vi.hoisted(() => ({
  getCurrentProfileMock: vi.fn(),
  updateCurrentProfileMock: vi.fn(),
}));

vi.mock("../../services/userService", () => ({
  getCurrentProfile: getCurrentProfileMock,
  updateCurrentProfile: updateCurrentProfileMock,
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
    updateCurrentProfileMock.mockResolvedValue({
      id: "user-1",
      displayName: "Jane Updated",
      email: "jane@mail.com",
      role: "customer",
      phone: "5512345678",
      active: true,
    });
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
    expect(screen.getByText("Consulta tu información y actualiza los datos.")).toBeInTheDocument();
    expect(screen.getByTestId("input-profile-displayName")).toHaveValue("Jane Doe");
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

  it("permite editar el perfil y enviar PATCH /users/me", async () => {
    const user = userEvent.setup();

    getCurrentProfileMock.mockResolvedValue({
      id: "user-1",
      displayName: "Jane Doe",
      email: "jane@mail.com",
      role: "customer",
      phone: "5511111111",
      active: true,
    });

    renderPage();

    await screen.findByTestId("profile-page");
    await user.clear(screen.getByTestId("input-profile-displayName"));
    await user.type(screen.getByTestId("input-profile-displayName"), "Jane Updated");
    await user.clear(screen.getByTestId("input-profile-phone"));
    await user.type(screen.getByTestId("input-profile-phone"), "5512345678");
    await user.click(screen.getByTestId("profile-save-button"));

    await waitFor(() => {
      expect(updateCurrentProfileMock).toHaveBeenCalledWith({
        displayName: "Jane Updated",
        phone: "5512345678",
      });
    });

    expect(await screen.findByText("Perfil actualizado correctamente.")).toBeInTheDocument();
    expect(screen.getAllByText("Jane Updated").length).toBeGreaterThan(0);
  });

  it("oculta el campo avatar en la interfaz", async () => {
    getCurrentProfileMock.mockResolvedValue({
      id: "user-1",
      displayName: "Jane Doe",
      email: "jane@mail.com",
      role: "customer",
      phone: "5511111111",
      active: true,
      avatar: "https://example.com/avatar.jpg",
    });

    renderPage();

    expect(await screen.findByTestId("profile-page")).toBeInTheDocument();
    expect(screen.queryByLabelText("Avatar (URL)")).not.toBeInTheDocument();
    expect(screen.queryByTestId("input-profile-avatar")).not.toBeInTheDocument();
  });
});
