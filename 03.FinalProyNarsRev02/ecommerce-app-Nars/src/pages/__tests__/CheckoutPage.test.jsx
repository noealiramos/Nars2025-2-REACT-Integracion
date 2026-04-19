import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

const {
  navigateMock,
  fetchShippingAddressesByUserMock,
  fetchPaymentMethodsByUserMock,
  shippingCreateMock,
  shippingUpdateMock,
  shippingRemoveMock,
  shippingSetDefaultMock,
  paymentCreateMock,
  paymentUpdateMock,
  paymentRemoveMock,
  paymentSetDefaultMock,
  orderCreateMock,
  orderCheckoutMock,
  clearCartMock,
  appendOrderToHistoryMock,
} = vi.hoisted(() => ({
  navigateMock: vi.fn(),
  fetchShippingAddressesByUserMock: vi.fn(),
  fetchPaymentMethodsByUserMock: vi.fn(),
  shippingCreateMock: vi.fn(),
  shippingUpdateMock: vi.fn(),
  shippingRemoveMock: vi.fn(),
  shippingSetDefaultMock: vi.fn(),
  paymentCreateMock: vi.fn(),
  paymentUpdateMock: vi.fn(),
  paymentRemoveMock: vi.fn(),
  paymentSetDefaultMock: vi.fn(),
  orderCreateMock: vi.fn(),
  orderCheckoutMock: vi.fn(),
  clearCartMock: vi.fn(),
  appendOrderToHistoryMock: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("../../contexts/CartContext", () => ({
  useCart: vi.fn(),
}));

vi.mock("../../contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../../services/shippingService", () => ({
  fetchShippingAddressesByUser: fetchShippingAddressesByUserMock,
}));

vi.mock("../../services/paymentService", () => ({
  fetchPaymentMethodsByUser: fetchPaymentMethodsByUserMock,
}));

vi.mock("../../api/shippingApi", () => ({
  shippingApi: {
    create: shippingCreateMock,
    update: shippingUpdateMock,
    remove: shippingRemoveMock,
    setDefault: shippingSetDefaultMock,
  },
}));

vi.mock("../../api/paymentApi", () => ({
  paymentApi: {
    create: paymentCreateMock,
    update: paymentUpdateMock,
    remove: paymentRemoveMock,
    setDefault: paymentSetDefaultMock,
  },
}));

vi.mock("../../api/orderApi", () => ({
  orderApi: {
    create: orderCreateMock,
    checkout: orderCheckoutMock,
  },
}));

vi.mock("../../utils/storageHelpers", () => ({
  appendOrderToHistory: appendOrderToHistoryMock,
}));

vi.mock("../../utils/logger", () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
  },
}));

import { CheckoutPage } from "../CheckoutPage";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";

const baseUser = {
  id: "user-1",
  displayName: "Test User",
};

const baseCart = {
  items: [{ id: "prod-1", quantity: 2 }],
  totalPrice: 199,
  clearCart: clearCartMock,
  isLoading: false,
};

const savedAddress = {
  _id: "addr-1",
  name: "Casa",
  address: "Calle 123",
  city: "Monterrey",
  state: "Nuevo Leon",
  postalCode: "64000",
  phone: "8112345678",
  isDefault: true,
};

const savedPaymentMethod = {
  _id: "pm-1",
  brand: "Visa",
  last4: "4242",
  cardHolderName: "Test User",
  expiryDate: "12/29",
  isDefault: true,
};

const renderPage = () =>
  render(
    <MemoryRouter>
      <CheckoutPage />
    </MemoryRouter>
  );

const fillCheckoutForm = async (user, expiryDate = "12/26") => {
  await user.type(screen.getByTestId("input-name"), "Test User");
  await user.type(screen.getByTestId("input-phone"), "5512345678");
  await user.type(screen.getByTestId("input-address"), "Av Reforma 123");
  await user.type(screen.getByTestId("input-city"), "CDMX");
  await user.type(screen.getByTestId("input-state"), "CDMX");
  await user.type(screen.getByTestId("input-postalCode"), "11000");
  await user.clear(screen.getByTestId("input-cardHolder"));
  await user.type(screen.getByTestId("input-cardHolder"), "Test User");
  await user.type(screen.getByTestId("input-cardNumber"), "4111111111111111");
  await user.type(screen.getByTestId("input-cardExpiry"), expiryDate);
  await user.type(screen.getByTestId("input-cardCvv"), "123");
};

describe("CheckoutPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.spyOn(window, "confirm").mockReturnValue(true);

    useCart.mockReturnValue(baseCart);
    useAuth.mockReturnValue({ user: baseUser });
    fetchShippingAddressesByUserMock.mockResolvedValue([]);
    fetchPaymentMethodsByUserMock.mockResolvedValue([]);
    shippingCreateMock.mockResolvedValue({ _id: "addr-new" });
    shippingUpdateMock.mockResolvedValue({ ...savedAddress, city: "Guadalajara" });
    shippingRemoveMock.mockResolvedValue({ message: "ok" });
    shippingSetDefaultMock.mockResolvedValue(savedAddress);
    paymentCreateMock.mockResolvedValue({ _id: "pm-new" });
    paymentUpdateMock.mockResolvedValue({ ...savedPaymentMethod, cardHolderName: "Updated User" });
    paymentRemoveMock.mockResolvedValue({ message: "ok" });
    paymentSetDefaultMock.mockResolvedValue(savedPaymentMethod);
    orderCreateMock.mockResolvedValue({ _id: "order-1" });
    orderCheckoutMock.mockResolvedValue({ _id: "order-1" });
  });

  it("no navega mientras carga carrito", () => {
    useCart.mockReturnValue({
      items: [],
      totalPrice: 0,
      clearCart: vi.fn(),
      isLoading: true,
    });

    renderPage();

    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("redirige si carrito vacio y no esta cargando", () => {
    useCart.mockReturnValue({
      items: [],
      totalPrice: 0,
      clearCart: vi.fn(),
      isLoading: false,
    });

    renderPage();

    expect(navigateMock).toHaveBeenCalledWith("/");
  });

  it("muestra opciones reutilizables y bloquea campos cuando selecciona datos existentes", async () => {
    fetchShippingAddressesByUserMock.mockResolvedValue([savedAddress]);
    fetchPaymentMethodsByUserMock.mockResolvedValue([savedPaymentMethod]);

    renderPage();

    expect(await screen.findByTestId("saved-shipping-options")).toBeInTheDocument();
    expect(await screen.findByTestId("saved-payment-options")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("input-phone")).toBeDisabled();
      expect(screen.getByTestId("input-cardNumber")).toBeDisabled();
    });

    expect(screen.getByDisplayValue("Calle 123")).toBeInTheDocument();
    expect(screen.getByDisplayValue("•••• 4242")).toBeInTheDocument();
  });

  it("comunica error remoto y permite fallback manual a datos nuevos", async () => {
    fetchShippingAddressesByUserMock.mockRejectedValue(new Error("shipping down"));
    fetchPaymentMethodsByUserMock.mockRejectedValue(new Error("payment down"));

    renderPage();

    expect(await screen.findByTestId("saved-data-error")).toHaveTextContent("No pudimos actualizar todos tus datos guardados");
    expect(screen.getByTestId("shipping-empty-state")).toBeInTheDocument();
    expect(screen.getByTestId("payment-empty-state")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("input-phone")).not.toBeDisabled();
      expect(screen.getByTestId("input-cardNumber")).not.toBeDisabled();
    });
  });

  it("restaura captura nueva al alternar desde datos existentes", async () => {
    const user = userEvent.setup();
    fetchShippingAddressesByUserMock.mockResolvedValue([savedAddress]);
    fetchPaymentMethodsByUserMock.mockResolvedValue([savedPaymentMethod]);

    renderPage();

    await screen.findByTestId("saved-shipping-options");
    await user.click(screen.getByTestId("shipping-option-new"));
    await user.click(screen.getByTestId("payment-option-new"));

    await waitFor(() => {
      expect(screen.getByTestId("input-phone")).not.toBeDisabled();
      expect(screen.getByTestId("input-cardNumber")).not.toBeDisabled();
    });

    expect(screen.getByTestId("input-phone")).toHaveValue("");
    expect(screen.getByTestId("input-cardNumber")).toHaveValue("");
    expect(screen.getByTestId("input-cardHolder")).toHaveValue("Test User");
  });

  it("usa IDs existentes para la orden final sin recrear shipping ni payment", async () => {
    const user = userEvent.setup();
    fetchShippingAddressesByUserMock.mockResolvedValue([savedAddress]);
    fetchPaymentMethodsByUserMock.mockResolvedValue([savedPaymentMethod]);

    renderPage();

    await screen.findByTestId("saved-shipping-options");
    await user.click(screen.getByTestId("btn-confirmar-compra"));

    await waitFor(() => {
        expect(orderCheckoutMock).toHaveBeenCalledWith(
          expect.objectContaining({
            shippingAddress: "addr-1",
            paymentMethod: "pm-1",
        })
      );
    });

    expect(shippingCreateMock).not.toHaveBeenCalled();
    expect(paymentCreateMock).not.toHaveBeenCalled();
    expect(clearCartMock).toHaveBeenCalled();
    expect(appendOrderToHistoryMock).toHaveBeenCalledWith({ _id: "order-1" });
    expect(navigateMock).toHaveBeenCalledWith("/confirmation", { state: { order: { _id: "order-1" } } });
  });

  it("normaliza el vencimiento numerico y continua el submit", async () => {
    const user = userEvent.setup();

    renderPage();

    await fillCheckoutForm(user, "1226");

    expect(screen.getByTestId("input-cardExpiry")).toHaveValue("12/26");

    await user.click(screen.getByTestId("btn-confirmar-compra"));

    await waitFor(() => {
      expect(paymentCreateMock).toHaveBeenCalledWith(
        expect.objectContaining({
          expiryDate: "12/26",
        })
      );
    });

    expect(orderCheckoutMock).toHaveBeenCalled();
  });

  it.each(["1/26", "13/26", "00/26"])("bloquea submit si el vencimiento %s no cumple MM/YY", async (expiryDate) => {
    const user = userEvent.setup();

    renderPage();

    await fillCheckoutForm(user, expiryDate);
    await user.click(screen.getByTestId("btn-confirmar-compra"));

    expect(await screen.findByText("Ingresa el vencimiento en formato MM/YY.")).toBeInTheDocument();
    expect(paymentCreateMock).not.toHaveBeenCalled();
    expect(orderCheckoutMock).not.toHaveBeenCalled();
    expect(orderCreateMock).not.toHaveBeenCalled();
  });

  it("hace fallback a order create si checkout especializado falla", async () => {
    const user = userEvent.setup();
    orderCheckoutMock.mockRejectedValue({ response: { status: 500, data: { error: "fail" } } });

    renderPage();

    await fillCheckoutForm(user, "12/26");
    await user.click(screen.getByTestId("btn-confirmar-compra"));

    await waitFor(() => {
      expect(orderCreateMock).toHaveBeenCalledWith(
        expect.objectContaining({
          shippingAddress: "addr-new",
          paymentMethod: "pm-new",
          products: [{ productId: "prod-1", quantity: 2 }],
        })
      );
    });
  });

  it("permite editar una direccion guardada antes de confirmar", async () => {
    const user = userEvent.setup();
    fetchShippingAddressesByUserMock.mockResolvedValue([savedAddress]);
    fetchPaymentMethodsByUserMock.mockResolvedValue([savedPaymentMethod]);
    shippingUpdateMock.mockResolvedValue({ ...savedAddress, city: "Guadalajara" });
    fetchShippingAddressesByUserMock
      .mockResolvedValueOnce([savedAddress])
      .mockResolvedValueOnce([{ ...savedAddress, city: "Guadalajara" }]);

    renderPage();

    await screen.findByTestId("shipping-edit-addr-1");
    await user.click(screen.getByTestId("shipping-edit-addr-1"));
    await user.clear(screen.getByTestId("input-city"));
    await user.type(screen.getByTestId("input-city"), "Guadalajara");
    await user.click(screen.getByTestId("shipping-save-edit"));

    await waitFor(() => {
      expect(shippingUpdateMock).toHaveBeenCalledWith(
        "addr-1",
        expect.objectContaining({ city: "Guadalajara" })
      );
    });

    expect(screen.getByTestId("input-city")).toBeDisabled();
    expect(screen.getByTestId("input-city")).toHaveValue("Guadalajara");
    expect(orderCheckoutMock).not.toHaveBeenCalled();
  });

  it("en modo new muestra guardar y cancelar, y guardar crea la direccion", async () => {
    const user = userEvent.setup();
    shippingCreateMock.mockResolvedValue({ ...savedAddress, _id: "addr-new", city: "Puebla" });
    fetchShippingAddressesByUserMock
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ ...savedAddress, _id: "addr-new", city: "Puebla" }]);

    renderPage();

    expect(await screen.findByTestId("shipping-empty-state")).toBeInTheDocument();
    expect(screen.getByTestId("shipping-save-new")).toBeInTheDocument();
    expect(screen.getByTestId("shipping-cancel-new")).toBeInTheDocument();

    await user.type(screen.getByTestId("input-name"), "Nueva Casa");
    await user.type(screen.getByTestId("input-phone"), "5512345678");
    await user.type(screen.getByTestId("input-address"), "Av Central 10");
    await user.type(screen.getByTestId("input-city"), "Puebla");
    await user.type(screen.getByTestId("input-state"), "Puebla");
    await user.type(screen.getByTestId("input-postalCode"), "72000");
    await user.click(screen.getByTestId("shipping-save-new"));

    await waitFor(() => {
      expect(shippingCreateMock).toHaveBeenCalledWith(
        expect.objectContaining({ city: "Puebla", address: "Av Central 10" })
      );
    });

    expect(screen.getByTestId("input-city")).toHaveValue("Puebla");
    expect(screen.getByTestId("input-city")).toBeDisabled();
  });

  it("en modo new cancelar limpia el formulario y mantiene estado inicial", async () => {
    const user = userEvent.setup();

    renderPage();

    expect(await screen.findByTestId("shipping-empty-state")).toBeInTheDocument();
    await user.type(screen.getByTestId("input-name"), "Temporal");
    await user.type(screen.getByTestId("input-city"), "Toluca");
    await user.click(screen.getByTestId("shipping-cancel-new"));

    expect(shippingCreateMock).not.toHaveBeenCalled();
    expect(screen.getByTestId("input-name")).toHaveValue("Test User");
    expect(screen.getByTestId("input-city")).toHaveValue("");
    expect(screen.getByTestId("shipping-save-new")).toBeInTheDocument();
  });

  it("permite cancelar la edicion de una direccion y restaura el estado previo", async () => {
    const user = userEvent.setup();
    fetchShippingAddressesByUserMock.mockResolvedValue([savedAddress]);
    fetchPaymentMethodsByUserMock.mockResolvedValue([savedPaymentMethod]);

    renderPage();

    await screen.findByTestId("shipping-edit-addr-1");
    await user.click(screen.getByTestId("shipping-edit-addr-1"));
    await user.clear(screen.getByTestId("input-city"));
    await user.type(screen.getByTestId("input-city"), "Guadalajara");
    await user.click(screen.getByTestId("shipping-cancel-edit"));

    expect(shippingUpdateMock).not.toHaveBeenCalled();
    expect(screen.getByTestId("input-city")).toHaveValue("Monterrey");
    expect(screen.getByTestId("input-city")).toBeDisabled();
  });

  it("permite eliminar un metodo de pago guardado", async () => {
    const user = userEvent.setup();
    fetchShippingAddressesByUserMock.mockResolvedValue([savedAddress]);
    fetchPaymentMethodsByUserMock.mockResolvedValue([savedPaymentMethod]);

    renderPage();

    await screen.findByTestId("payment-delete-pm-1");
    await user.click(screen.getByTestId("payment-delete-pm-1"));

    await waitFor(() => {
      expect(paymentRemoveMock).toHaveBeenCalledWith("pm-1");
    });

    expect(await screen.findByTestId("payment-empty-state")).toBeInTheDocument();
  });

  it("pide confirmacion antes de eliminar una direccion guardada", async () => {
    const user = userEvent.setup();
    fetchShippingAddressesByUserMock.mockResolvedValue([savedAddress]);
    fetchPaymentMethodsByUserMock.mockResolvedValue([savedPaymentMethod]);

    window.confirm.mockReturnValueOnce(false);

    renderPage();

    await screen.findByTestId("shipping-delete-addr-1");
    await user.click(screen.getByTestId("shipping-delete-addr-1"));

    expect(window.confirm).toHaveBeenCalledWith("¿Está seguro?, esta acción no podrá deshacerse?");
    expect(shippingRemoveMock).not.toHaveBeenCalled();
  });
});
