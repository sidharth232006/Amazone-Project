import {
  cart,
  removeFromCart,
  updateDeliveryOption,
  calculateCartQuantity,
  updateQuantity,
} from "../../data/cart.js";

import { getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import {
  deliveryOptions,
  getDeliveryOption,
} from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";

export function renderOrderSummary() {
  let cartSummaryHTML = "";

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    const matchingProduct = getProduct(productId);

    if (!matchingProduct) {
      console.warn("⚠️ Product not found for ID:", productId);
      return;
    }

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);

    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
    const dateString = deliveryDate.format("dddd, MMMM D");

    cartSummaryHTML += `
      <div class="cart-item-container js-cart-item-container js-cart-item-container-${
        matchingProduct.id
      }">
        <div class="delivery-date">Delivery date: ${dateString}</div>

        <div class="cart-item-details-grid">
          <img class="product-image" src="${matchingProduct.image}" />

          <div class="cart-item-details">
            <div class="product-name">${matchingProduct.name}</div>
            <div class="product-price">${matchingProduct.getPrice()}</div>
            <div class="product-quantity">
              <span>
                Quantity:
                <span class="quantity-label js-quantity-label-${
                  matchingProduct.id
                }">
                  ${cartItem.quantity}
                </span>
              </span>
              <span class="update-quantity-link link-primary js-update-link" data-product-id="${
                matchingProduct.id
              }">
                Update
              </span>
              <input class="quantity-input js-quantity-input-${
                matchingProduct.id
              }" type="number" min="1" value="${cartItem.quantity}">
              <span class="save-quantity-link link-primary js-save-link" data-product-id="${
                matchingProduct.id
              }">
                Save
              </span>
              <span class="delete-quantity-link link-primary js-delete-link js-delete-link-${
                matchingProduct.id
              }" data-product-id="${matchingProduct.id}">
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">Choose a delivery option:</div>
            ${deliveryOptionsHTML(matchingProduct, cartItem)}
          </div>
        </div>
      </div>
    `;
  });

  document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

  // === Event Listeners ===

  document.querySelectorAll(".js-delete-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);

      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      if (container) container.remove();

      updateCartQuantity();
      renderPaymentSummary();
    });
  });

  document.querySelectorAll(".js-update-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      if (container) container.classList.add("is-editing-quantity");
    });
  });

  document.querySelectorAll(".js-save-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      if (container) container.classList.remove("is-editing-quantity");

      const quantityInput = document.querySelector(
        `.js-quantity-input-${productId}`
      );
      const newQuantity = Number(quantityInput.value);

      if (newQuantity < 1 || newQuantity > 1000) {
        alert("Quantity must be between 1 and 1000");
        return;
      }

      updateQuantity(productId, newQuantity);

      const quantityLabel = document.querySelector(
        `.js-quantity-label-${productId}`
      );
      if (quantityLabel) quantityLabel.innerHTML = newQuantity;

      updateCartQuantity();
      renderPaymentSummary();
    });
  });

  document.querySelectorAll(".js-delivery-option").forEach((element) => {
    element.addEventListener("click", () => {
      const { productId, deliveryOptionId } = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });

  updateCartQuantity();

  function updateCartQuantity() {
    const cartQuantity = calculateCartQuantity();
    const returnLink = document.querySelector(".js-return-to-home-link");
    if (returnLink) returnLink.innerHTML = `${cartQuantity} items`;
  }

  function deliveryOptionsHTML(matchingProduct, cartItem) {
    return deliveryOptions
      .map((deliveryOption) => {
        const today = dayjs();
        const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
        const dateString = deliveryDate.format("dddd, MMMM D");

        const priceString =
          deliveryOption.priceCents === 0
            ? "FREE"
            : `$${formatCurrency(deliveryOption.priceCents)} -`;

        const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

        return `
          <div class="delivery-option js-delivery-option js-delivery-option-${
            matchingProduct.id
          }-${deliveryOption.id}"
            data-product-id="${matchingProduct.id}"
            data-delivery-option-id="${deliveryOption.id}">
            <input type="radio"
              ${isChecked ? "checked" : ""}
              class="delivery-option-input"
              name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">${dateString}</div>
              <div class="delivery-option-price">${priceString} Shipping</div>
            </div>
          </div>
        `;
      })
      .join("");
  }
}
