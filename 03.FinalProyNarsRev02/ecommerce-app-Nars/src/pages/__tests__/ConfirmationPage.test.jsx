import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ConfirmationPage } from "../ConfirmationPage";

const renderPage = (order) =>
  render(
    <MemoryRouter initialEntries={[{ pathname: "/confirmation", state: { order } }]}>
      <Routes>
        <Route path="/confirmation" element={<ConfirmationPage />} />
      </Routes>
    </MemoryRouter>
  );

describe("ConfirmationPage", () => {
  it("muestra subtotal, envio y total usando los campos del backend", async () => {
    renderPage({
      _id: "order-1",
      totalPrice: 339,
      subtotal: 240,
      taxAmount: 0,
      shippingCost: 99,
      shippingAddress: {
        name: "Jane Doe",
        address: "Calle 1",
        city: "CDMX",
        state: "CDMX",
        postalCode: "11000",
      },
      paymentMethod: { brand: "Visa", last4: "4242" },
      products: [
        {
          productId: { _id: "prod-1", name: "Anillo" },
          price: 120,
          quantity: 2,
        },
      ],
    });

    expect(await screen.findByTestId("order-summary")).toBeInTheDocument();
    expect(screen.getByText("$240.00")).toBeInTheDocument();
    expect(screen.getByText("$99.00")).toBeInTheDocument();
    expect(screen.getByText("$339.00")).toBeInTheDocument();
    expect(screen.queryByText(/IVA/i)).not.toBeInTheDocument();
  });
});
