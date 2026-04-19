import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

const { getOrderDetailMock } = vi.hoisted(() => ({
  getOrderDetailMock: vi.fn(),
}));

vi.mock("../../contexts/AuthContext", () => ({
  useAuth: () => ({ user: { id: "user-1" } }),
}));

vi.mock("../../services/orderService", () => ({
  getOrderDetail: getOrderDetailMock,
}));

import { OrderDetailPage } from "../OrderDetailPage";

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={["/orders/order-1"]}>
      <Routes>
        <Route path="/orders/:id" element={<OrderDetailPage />} />
      </Routes>
    </MemoryRouter>
  );

describe("OrderDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getOrderDetailMock.mockResolvedValue({
      id: "order-1",
      user: { _id: "user-1" },
      createdAt: "2026-04-18T08:05:58.401Z",
      status: "pending",
      paymentStatus: "pending",
      subtotal: 1494.99,
      taxAmount: 0,
      shippingCost: 99,
      totalPrice: 1593.99,
      shippingAddressLabel: "Jane Doe, Calle 1, CDMX, CDMX, 11000",
      paymentMethodLabel: "Visa **** 4242",
      items: [
        { id: "1", name: "A", quantity: 1, subtotal: 999.99 },
        { id: "2", name: "B", quantity: 1, subtotal: 180 },
        { id: "3", name: "C", quantity: 1, subtotal: 95 },
        { id: "4", name: "D", quantity: 1, subtotal: 220 },
      ],
    });
  });

  it("muestra el desglose de subtotal y envio para explicar el total pagado", async () => {
    renderPage();

    await waitFor(() => {
      expect(getOrderDetailMock).toHaveBeenCalledWith("order-1");
    });

    expect(await screen.findByTestId("order-detail-card")).toBeInTheDocument();
    expect(screen.getByTestId("order-detail-subtotal")).toHaveTextContent("$1,494.99");
    expect(screen.getByTestId("order-detail-shipping-cost")).toHaveTextContent("$99.00");
    expect(screen.getByTestId("order-detail-total")).toHaveTextContent("$1,593.99");
    expect(screen.queryByTestId("order-detail-tax")).not.toBeInTheDocument();
  });
});
