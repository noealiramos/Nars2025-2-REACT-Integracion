import { describe, it, expect, vi, beforeEach } from "vitest";
import { cartApi } from "../cartApi";
import { apiClient } from "../apiClient";

vi.mock("../apiClient", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("cartApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("obtiene el carrito desde backend", async () => {
    apiClient.get.mockResolvedValue({ data: { data: { _id: "c1" } } });

    const cart = await cartApi.getCurrent();

    expect(apiClient.get).toHaveBeenCalledWith("/cart/user");
    expect(cart).toEqual({ _id: "c1" });
  });

  it("agrega producto correctamente", async () => {
    apiClient.post.mockResolvedValue({ data: { data: { _id: "c1" } } });

    const cart = await cartApi.addProduct("p1", 2);

    expect(apiClient.post).toHaveBeenCalledWith("/cart/add-product", {
      productId: "p1",
      quantity: 2,
    });
    expect(cart).toEqual({ _id: "c1" });
  });

  it("actualiza items correctamente", async () => {
    apiClient.put.mockResolvedValue({ data: { data: { _id: "c1" } } });

    const cart = await cartApi.update("c1", [{ product: "p1", quantity: 1 }]);

    expect(apiClient.put).toHaveBeenCalledWith("/cart/c1", {
      products: [{ product: "p1", quantity: 1 }],
    });
    expect(cart).toEqual({ _id: "c1" });
  });

  it("elimina carrito correctamente", async () => {
    apiClient.delete.mockResolvedValue({ data: { data: { ok: true } } });

    const cart = await cartApi.remove("c1");

    expect(apiClient.delete).toHaveBeenCalledWith("/cart/c1");
    expect(cart).toEqual({ ok: true });
  });

  it("propaga errores de API", async () => {
    apiClient.get.mockRejectedValue(new Error("boom"));

    await expect(cartApi.getCurrent()).rejects.toThrow("boom");
  });
});
