import { renderOrderSummary } from "../../scripts/checkout/orderSummary.js";
import { loadFromStorage, cart } from "../../data/cart.js";
import { products, makeProduct } from "../../data/products.js";

describe("test suite: renderOrderSummary", () => {
  const productId1 = "e43638ce-6aa0-4b85-b27f-e1d07eb678c6";
  const productId2 = "15b6fc6f-327a-4ec4-896f-486349e85a3d";

  beforeAll(() => {
    products.length = 0;
    products.push(
      makeProduct({
        id: productId1,
        name: "Black and Gray Athletic Cotton Socks",
        priceCents: 1000,
        ratingCount: 12,
        ratingStars: 4.5,
      }),
      makeProduct({
        id: productId2,
        name: "Basketball",
        priceCents: 2000,
        ratingCount: 5,
        ratingStars: 4,
      })
    );
  });

  beforeEach(() => {
    const testContainer = document.querySelector(".js-test-container");
    if (testContainer) {
      testContainer.innerHTML = `
        <div class="js-order-summary"></div>
        <div class="js-payment-summary"></div>
      `;
    } else {
      const div = document.createElement("div");
      div.classList.add("js-test-container");
      div.innerHTML = `
        <div class="js-order-summary"></div>
        <div class="js-payment-summary"></div>
      `;
      document.body.appendChild(div);
    }

    spyOn(localStorage, "setItem");
    spyOn(localStorage, "getItem").and.callFake(() => {
      return JSON.stringify([
        {
          productId: productId1,
          quantity: 2,
          deliveryOptionId: "1",
        },
        {
          productId: productId2,
          quantity: 1,
          deliveryOptionId: "2",
        },
      ]);
    });

    loadFromStorage();

    renderOrderSummary();
  });

  afterEach(() => {
    const container = document.querySelector(".js-test-container");
    if (container) container.innerHTML = "";
  });

  it("displays the cart correctly", (done) => {
    setTimeout(() => {
      expect(
        document.querySelectorAll(".js-cart-item-container").length
      ).toEqual(2);

      expect(
        document.querySelector(`.js-product-quantity-${productId1}`).innerText
      ).toContain("Quantity: 2");

      expect(
        document.querySelector(`.js-product-quantity-${productId2}`).innerText
      ).toContain("Quantity: 1");

      expect(
        document.querySelector(`.js-product-name-${productId1}`).innerText
      ).toContain("Black and Gray Athletic Cotton Socks");

      expect(
        document.querySelector(`.js-product-name-${productId2}`).innerText
      ).toContain("Basketball");

      expect(
        document.querySelector(`.js-product-price-${productId1}`).innerText
      ).toContain("$10");

      expect(
        document.querySelector(`.js-product-price-${productId2}`).innerText
      ).toContain("$20");

      done();
    }, 50);
  });

  it("removes a product when delete link is clicked", (done) => {
    setTimeout(() => {
      const deleteLink = document.querySelector(
        `.js-delete-link-${productId1}`
      );
      expect(deleteLink).not.toBeNull();
      deleteLink.click();

      expect(
        document.querySelectorAll(".js-cart-item-container").length
      ).toEqual(1);
      expect(
        document.querySelector(`.js-cart-item-container-${productId1}`)
      ).toBeNull();
      expect(
        document.querySelector(`.js-cart-item-container-${productId2}`)
      ).not.toBeNull();

      expect(cart.length).toEqual(1);
      expect(cart[0].productId).toEqual(productId2);
      done();
    }, 50);
  });

  it("updates the delivery option correctly", (done) => {
    setTimeout(() => {
      const opt = document.querySelector(`.js-delivery-option-${productId1}-3`);
      expect(opt).not.toBeNull();
      opt.click();

      const input = document.querySelector(
        `.js-delivery-option-input-${productId1}-3`
      );

      expect(cart.length).toEqual(2);
      expect(cart[0].productId).toEqual(productId1);
      expect(cart[0].deliveryOptionId).toEqual("3");

      expect(
        document.querySelector(".js-payment-summary-shipping").innerText
      ).toContain("$");
      expect(
        document.querySelector(".js-payment-summary-total").innerText
      ).toContain("$");

      done();
    }, 50);
  });
});
