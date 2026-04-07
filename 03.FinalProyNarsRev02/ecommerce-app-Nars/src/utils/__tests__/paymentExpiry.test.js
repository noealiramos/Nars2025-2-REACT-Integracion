import { describe, expect, it } from "vitest";
import { isValidExpiryDate, normalizeExpiryDateInput } from "../paymentExpiry";

describe("paymentExpiry", () => {
  it("acepta fechas ya canonicas", () => {
    expect(normalizeExpiryDateInput("12/26")).toBe("12/26");
    expect(normalizeExpiryDateInput("01/30")).toBe("01/30");
    expect(isValidExpiryDate("12/26")).toBe(true);
    expect(isValidExpiryDate("01/30")).toBe(true);
  });

  it("normaliza entrada numerica a MM/YY", () => {
    expect(normalizeExpiryDateInput("1226")).toBe("12/26");
  });

  it("rechaza formatos invalidos", () => {
    expect(isValidExpiryDate(normalizeExpiryDateInput("1/26"))).toBe(false);
    expect(isValidExpiryDate(normalizeExpiryDateInput("13/26"))).toBe(false);
    expect(isValidExpiryDate(normalizeExpiryDateInput("00/26"))).toBe(false);
    expect(isValidExpiryDate(normalizeExpiryDateInput(""))).toBe(false);
  });
});
