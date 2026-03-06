describe("Simple Home Test", () => {
    it("debería cargar el home", () => {
        cy.visit("/");
        cy.contains("eShop").should("be.visible");
    });
});
